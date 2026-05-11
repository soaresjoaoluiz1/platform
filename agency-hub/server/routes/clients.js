import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import db from '../db.js'
import jwt from 'jsonwebtoken'
import http from 'http'
import https from 'https'
import { URL } from 'url'
import { requireRole } from '../middleware/auth.js'

const CORE_EMBED_SECRET = process.env.CORE_EMBED_SECRET || 'dros-core-embed-2026-shared-key'
const CORE_API_URL = process.env.CORE_API_URL || 'http://localhost:3004'

// Mini wrapper de http.request com JSON — evita dependencia nova
function httpJsonGet(url) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url)
      const lib = u.protocol === 'https:' ? https : http
      const req = lib.get(u, (res) => {
        let body = ''
        res.on('data', (chunk) => { body += chunk })
        res.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {}
            resolve({ status: res.statusCode || 0, data: parsed })
          } catch (e) {
            resolve({ status: res.statusCode || 0, data: { error: 'Invalid JSON from upstream' } })
          }
        })
      })
      req.on('error', reject)
      req.setTimeout(8000, () => { req.destroy(new Error('Request timeout')) })
    } catch (e) { reject(e) }
  })
}

const router = Router()

router.get('/', requireRole('dono', 'gerente', 'funcionario'), (req, res) => {
  const isActive = req.query.inactive === '1' ? 0 : 1
  const clients = db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM tasks WHERE client_id = c.id AND is_active = 1) as task_count,
    (SELECT COUNT(*) FROM users WHERE client_id = c.id) as user_count
    FROM clients c WHERE c.is_active = ? ORDER BY c.name
  `).all(isActive)
  res.json({ clients })
})

router.post('/', requireRole('dono', 'gerente'), (req, res) => {
  const { name, contact_name, contact_email, contact_phone, logo_url, drive_folder, password,
          cnpj, razao_social, segmento, website, instagram, cidade, estado, observacoes,
          monthly_fee, payment_day, contrato_inicio } = req.body
  if (!name) return res.status(400).json({ error: 'Nome obrigatorio' })
  if (!contact_email) return res.status(400).json({ error: 'Email obrigatorio' })
  if (!password) return res.status(400).json({ error: 'Senha obrigatoria' })

  // Check if email already in use
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(contact_email)) return res.status(400).json({ error: 'Email ja cadastrado' })

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (db.prepare('SELECT id FROM clients WHERE slug = ?').get(slug)) return res.status(400).json({ error: 'Cliente ja existe' })

  // Create client with onboard token
  const onboard_token = randomBytes(16).toString('hex')
  const result = db.prepare(`
    INSERT INTO clients (name, slug, contact_name, contact_email, contact_phone, logo_url, drive_folder, onboard_token,
                         cnpj, razao_social, segmento, website, instagram, cidade, estado, observacoes,
                         monthly_fee, payment_day, contrato_inicio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, slug, contact_name || name, contact_email, contact_phone, logo_url, drive_folder || null, onboard_token,
    cnpj || null, razao_social || null, segmento || null, website || null, instagram || null, cidade || null, estado || null, observacoes || null,
    monthly_fee || 0, payment_day || 10, contrato_inicio || null
  )
  const clientId = result.lastInsertRowid

  // Auto-create user with role 'cliente'
  db.prepare("INSERT INTO users (client_id, name, email, password, role) VALUES (?, ?, ?, ?, 'cliente')").run(clientId, contact_name || name, contact_email, bcrypt.hashSync(password, 10))

  res.json({ client: db.prepare('SELECT * FROM clients WHERE id = ?').get(clientId) })
})

// Lista contas Meta do /core (pra autocomplete no form de cliente)
// IMPORTANTE: declarado ANTES de /:id pra Express nao casar como id="core-accounts"
router.get('/core-accounts', requireRole('dono', 'gerente'), async (req, res) => {
  try {
    const token = jwt.sign({ embed: true, account: '__list__' }, CORE_EMBED_SECRET, { expiresIn: '5m' })
    const { status, data } = await httpJsonGet(`${CORE_API_URL}/api/meta/accounts?embed_token=${token}`)
    if (status !== 200) return res.status(502).json({ error: `Falha ao consultar /core (${status}): ${data?.error || ''}` })
    const accounts = (data.accounts || []).map(a => ({ id: a.id, name: a.name }))
    res.json({ accounts })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Falha ao buscar contas do /core' })
  }
})

router.get('/:id', requireRole('dono', 'gerente'), (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id)
  if (!client) return res.status(404).json({ error: 'Cliente nao encontrado' })
  const users = db.prepare('SELECT id, name, email, role, is_active FROM users WHERE client_id = ?').all(client.id)
  const tasksByStage = db.prepare('SELECT stage, COUNT(*) as count FROM tasks WHERE client_id = ? AND is_active = 1 GROUP BY stage').all(client.id)
  const credentials = db.prepare('SELECT * FROM client_credentials WHERE client_id = ? ORDER BY platform').all(client.id)
  res.json({ client, users, tasksByStage, credentials })
})

router.put('/:id', requireRole('dono', 'gerente'), (req, res) => {
  const { name, contact_name, contact_email, contact_phone, logo_url, drive_folder, is_active, monthly_fee, payment_day,
          cnpj, razao_social, segmento, website, instagram, cidade, estado, observacoes, contrato_inicio } = req.body
  const sets = []; const params = []
  if (name !== undefined) { sets.push('name = ?'); params.push(name) }
  if (contact_name !== undefined) { sets.push('contact_name = ?'); params.push(contact_name) }
  if (contact_email !== undefined) { sets.push('contact_email = ?'); params.push(contact_email) }
  if (contact_phone !== undefined) { sets.push('contact_phone = ?'); params.push(contact_phone) }
  if (logo_url !== undefined) { sets.push('logo_url = ?'); params.push(logo_url) }
  if (drive_folder !== undefined) { sets.push('drive_folder = ?'); params.push(drive_folder) }
  if (is_active !== undefined) {
    sets.push('is_active = ?'); params.push(is_active ? 1 : 0)
    // Quando inativa: registra data; quando reativa: limpa
    if (is_active) { sets.push('inactivated_at = NULL') }
    else { sets.push("inactivated_at = COALESCE(inactivated_at, datetime('now', '-3 hours'))") }
  }
  if (monthly_fee !== undefined) { sets.push('monthly_fee = ?'); params.push(monthly_fee) }
  if (payment_day !== undefined) { sets.push('payment_day = ?'); params.push(payment_day) }
  if (cnpj !== undefined) { sets.push('cnpj = ?'); params.push(cnpj || null) }
  if (razao_social !== undefined) { sets.push('razao_social = ?'); params.push(razao_social || null) }
  if (segmento !== undefined) { sets.push('segmento = ?'); params.push(segmento || null) }
  if (website !== undefined) { sets.push('website = ?'); params.push(website || null) }
  if (instagram !== undefined) { sets.push('instagram = ?'); params.push(instagram || null) }
  if (cidade !== undefined) { sets.push('cidade = ?'); params.push(cidade || null) }
  if (estado !== undefined) { sets.push('estado = ?'); params.push(estado || null) }
  if (observacoes !== undefined) { sets.push('observacoes = ?'); params.push(observacoes || null) }
  if (contrato_inicio !== undefined) { sets.push('contrato_inicio = ?'); params.push(contrato_inicio || null) }
  if (req.body.core_client_name !== undefined) { sets.push('core_client_name = ?'); params.push(req.body.core_client_name || null) }
  if (!sets.length) return res.status(400).json({ error: 'Nada pra atualizar' })
  sets.push("updated_at = datetime('now', '-3 hours')"); params.push(req.params.id)
  db.prepare(`UPDATE clients SET ${sets.join(', ')} WHERE id = ?`).run(...params)
  res.json({ client: db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id) })
})

// Client credentials (platform access)
router.get('/:id/credentials', requireRole('dono', 'gerente'), (req, res) => {
  const credentials = db.prepare('SELECT * FROM client_credentials WHERE client_id = ? ORDER BY platform').all(req.params.id)
  res.json({ credentials })
})

// Approval token — gerar (revoga o anterior) ou revogar
router.post('/:id/approval-token', requireRole('dono', 'gerente'), (req, res) => {
  const client = db.prepare('SELECT id FROM clients WHERE id = ?').get(req.params.id)
  if (!client) return res.status(404).json({ error: 'Cliente nao encontrado' })
  const token = randomBytes(20).toString('hex')
  db.prepare('UPDATE clients SET approval_token = ? WHERE id = ?').run(token, req.params.id)
  res.json({ approval_token: token })
})

router.delete('/:id/approval-token', requireRole('dono', 'gerente'), (req, res) => {
  db.prepare('UPDATE clients SET approval_token = NULL WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

router.post('/:id/credentials', requireRole('dono', 'gerente'), (req, res) => {
  const { platform, login, password, observation } = req.body
  if (!platform || !login || !password) return res.status(400).json({ error: 'platform, login e password obrigatorios' })
  const result = db.prepare('INSERT INTO client_credentials (client_id, platform, login, password, observation) VALUES (?, ?, ?, ?, ?)').run(req.params.id, platform, login, password, observation || null)
  res.json({ credential: db.prepare('SELECT * FROM client_credentials WHERE id = ?').get(result.lastInsertRowid) })
})

router.put('/:id/credentials/:credId', requireRole('dono', 'gerente'), (req, res) => {
  const { platform, login, password, observation } = req.body
  const sets = []; const params = []
  if (platform !== undefined) { sets.push('platform = ?'); params.push(platform) }
  if (login !== undefined) { sets.push('login = ?'); params.push(login) }
  if (password !== undefined) { sets.push('password = ?'); params.push(password) }
  if (observation !== undefined) { sets.push('observation = ?'); params.push(observation) }
  if (!sets.length) return res.status(400).json({ error: 'Nada pra atualizar' })
  sets.push("updated_at = datetime('now', '-3 hours')"); params.push(req.params.credId)
  db.prepare(`UPDATE client_credentials SET ${sets.join(', ')} WHERE id = ?`).run(...params)
  res.json({ credential: db.prepare('SELECT * FROM client_credentials WHERE id = ?').get(req.params.credId) })
})

router.delete('/:id/credentials/:credId', requireRole('dono', 'gerente'), (req, res) => {
  db.prepare('DELETE FROM client_credentials WHERE id = ?').run(req.params.credId)
  res.json({ ok: true })
})

// Onboard - get all responses (authenticated)
router.get('/:id/onboard', requireRole('dono', 'gerente'), (req, res) => {
  const entries = db.prepare('SELECT * FROM client_onboard WHERE client_id = ? ORDER BY created_at DESC').all(req.params.id)
  res.json({ entries: entries.map(e => ({ ...e, data: JSON.parse(e.data) })) })
})

// Cliente final pega URL embed do proprio painel (usa client_id do user logado)
router.get('/me/core-embed-url', requireRole('cliente'), (req, res) => {
  if (!req.user.client_id) return res.status(400).json({ error: 'Usuario sem client_id' })
  const client = db.prepare('SELECT id, name, core_client_name FROM clients WHERE id = ?').get(req.user.client_id)
  if (!client) return res.status(404).json({ error: 'Cliente nao encontrado' })
  if (!client.core_client_name) return res.status(400).json({ error: 'Painel de Performance ainda nao foi configurado pra este cliente. Fale com a agencia.' })

  const embedToken = jwt.sign(
    { embed: true, account: client.core_client_name, hub_user_id: req.user.id, client_id: client.id },
    CORE_EMBED_SECRET,
    { expiresIn: '1h' }
  )
  const url = `/core/?account=${encodeURIComponent(client.core_client_name)}&embed=1&embed_token=${embedToken}`
  res.json({ url, expires_in: 3600 })
})

// Gera URL embed do /core com token assinado (auto-login)
router.get('/:id/core-embed-url', requireRole('dono', 'gerente'), (req, res) => {
  const client = db.prepare('SELECT id, name, core_client_name FROM clients WHERE id = ?').get(req.params.id)
  if (!client) return res.status(404).json({ error: 'Cliente nao encontrado' })
  if (!client.core_client_name) return res.status(400).json({ error: 'Cliente sem vinculo no /core. Preencha o campo "Nome no Painel de Performance".' })

  // Token JWT (1h), assinado com chave compartilhada entre Hub e Core
  const embedToken = jwt.sign(
    { embed: true, account: client.core_client_name, hub_user_id: req.user.id },
    CORE_EMBED_SECRET,
    { expiresIn: '1h' }
  )
  const url = `/core/?account=${encodeURIComponent(client.core_client_name)}&embed=1&embed_token=${embedToken}`
  res.json({ url, expires_in: 3600 })
})

export default router
