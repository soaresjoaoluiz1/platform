import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchClients, createClient, updateClient, formatNumber, type Client } from '../lib/api'
import { Building2, Plus, Edit3, Save, X, Eye, Archive, ArchiveRestore } from 'lucide-react'

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', contact_name: '', contact_email: '', contact_phone: '', drive_folder: '', password: '', cnpj: '', razao_social: '', segmento: '', website: '', instagram: '', cidade: '', estado: '', observacoes: '', monthly_fee: '', payment_day: '10', contrato_inicio: '' })
  const [editId, setEditId] = useState<number | null>(null)
  const navigate = useNavigate()
  const [editData, setEditData] = useState<any>({})
  const [view, setView] = useState<'active' | 'inactive'>('active')

  const load = () => { setLoading(true); fetchClients({ inactive: view === 'inactive' }).then(setClients).finally(() => setLoading(false)) }
  useEffect(load, [view])

  const handleToggleActive = async (c: Client) => {
    const action = c.is_active ? 'inativar' : 'reativar'
    if (!confirm(`Tem certeza que quer ${action} "${c.name}"?`)) return
    await updateClient(c.id, { is_active: c.is_active ? 0 : 1 } as any)
    load()
  }

  const handleCreate = async () => {
    if (!newClient.name || !newClient.contact_email || !newClient.password) return
    const payload: any = { ...newClient }
    payload.monthly_fee = newClient.monthly_fee ? parseFloat(newClient.monthly_fee) : 0
    payload.payment_day = newClient.payment_day ? parseInt(newClient.payment_day) : 10
    await createClient(payload)
    setShowNew(false)
    setNewClient({ name: '', contact_name: '', contact_email: '', contact_phone: '', drive_folder: '', password: '', cnpj: '', razao_social: '', segmento: '', website: '', instagram: '', cidade: '', estado: '', observacoes: '', monthly_fee: '', payment_day: '10', contrato_inicio: '' })
    load()
  }
  const handleSaveEdit = async () => { if (!editId) return; await updateClient(editId, editData); setEditId(null); load() }
  const startEdit = (c: Client) => { setEditId(c.id); setEditData({ name: c.name, contact_name: c.contact_name || '', contact_email: c.contact_email || '', contact_phone: (c as any).contact_phone || '' }) }

  return (
    <div>
      <div className="page-header"><h1><Building2 size={22} style={{ marginRight: 8 }} /> Clientes</h1><button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}><Plus size={14} /> Novo Cliente</button></div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setView('active')}
          style={{ background: 'none', border: 'none', color: view === 'active' ? '#FFB300' : '#9B96B0', borderBottom: view === 'active' ? '2px solid #FFB300' : '2px solid transparent', padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >Ativos</button>
        <button
          onClick={() => setView('inactive')}
          style={{ background: 'none', border: 'none', color: view === 'inactive' ? '#FFB300' : '#9B96B0', borderBottom: view === 'inactive' ? '2px solid #FFB300' : '2px solid transparent', padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
        ><Archive size={12} /> Inativos</button>
      </div>
      {loading ? <div className="loading-container"><div className="spinner" /></div> : (
        <div className="table-card"><table>
          <thead><tr><th>Nome</th><th>Contato</th><th>Email</th><th className="right">Tarefas</th><th>Status</th><th className="right">Acoes</th></tr></thead>
          <tbody>
            {clients.map(c => editId === c.id ? (
              <tr key={c.id}>
                <td><input className="input" value={editData.name} onChange={e => setEditData((p: any) => ({ ...p, name: e.target.value }))} style={{ padding: '4px 8px' }} /></td>
                <td><input className="input" value={editData.contact_name} onChange={e => setEditData((p: any) => ({ ...p, contact_name: e.target.value }))} style={{ padding: '4px 8px' }} /></td>
                <td><input className="input" value={editData.contact_email} onChange={e => setEditData((p: any) => ({ ...p, contact_email: e.target.value }))} style={{ padding: '4px 8px' }} /></td>
                <td className="right">{formatNumber(c.task_count || 0)}</td>
                <td><span style={{ color: '#34C759' }}>Ativo</span></td>
                <td className="right" style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm btn-icon" onClick={handleSaveEdit}><Save size={12} /></button>
                  <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setEditId(null)}><X size={12} /></button>
                </td>
              </tr>
            ) : (
              <tr key={c.id}>
                <td className="name">{c.name}</td><td>{c.contact_name || '-'}</td><td>{c.contact_email || '-'}</td>
                <td className="right" style={{ fontWeight: 600 }}>{formatNumber(c.task_count || 0)}</td>
                <td><span style={{ color: c.is_active ? '#34C759' : '#FF6B6B' }}>{c.is_active ? 'Ativo' : 'Inativo'}</span></td>
                <td className="right" style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm btn-icon" onClick={() => navigate(`/clients/${c.id}`)} title="Ver detalhes"><Eye size={12} /></button>
                  <button className="btn btn-secondary btn-sm btn-icon" onClick={() => startEdit(c)} title="Editar"><Edit3 size={12} /></button>
                  <button
                    className="btn btn-secondary btn-sm btn-icon"
                    onClick={() => handleToggleActive(c)}
                    title={c.is_active ? 'Inativar cliente' : 'Reativar cliente'}
                    style={c.is_active ? { color: '#FF6B6B' } : { color: '#34C759' }}
                  >{c.is_active ? <Archive size={12} /> : <ArchiveRestore size={12} />}</button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#6B6580' }}>{view === 'active' ? 'Nenhum cliente ativo' : 'Nenhum cliente inativo'}</td></tr>}
          </tbody>
        </table></div>
      )}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
          <h2>Novo Cliente</h2>

          <div style={{ fontSize: 11, color: '#9B96B0', textTransform: 'uppercase', fontWeight: 600, margin: '12px 0 6px' }}>Identificacao</div>
          <div className="form-row">
            <div className="form-group"><label>Nome Fantasia *</label><input className="input" value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} placeholder="Nome do cliente" /></div>
            <div className="form-group"><label>Razao Social</label><input className="input" value={newClient.razao_social} onChange={e => setNewClient(p => ({ ...p, razao_social: e.target.value }))} placeholder="Razao social registrada" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>CNPJ</label><input className="input" value={newClient.cnpj} onChange={e => setNewClient(p => ({ ...p, cnpj: e.target.value }))} placeholder="00.000.000/0000-00" /></div>
            <div className="form-group"><label>Segmento</label><input className="input" value={newClient.segmento} onChange={e => setNewClient(p => ({ ...p, segmento: e.target.value }))} placeholder="Ex: Estetica, Industria, Varejo" /></div>
          </div>

          <div style={{ fontSize: 11, color: '#9B96B0', textTransform: 'uppercase', fontWeight: 600, margin: '16px 0 6px' }}>Contato</div>
          <div className="form-row">
            <div className="form-group"><label>Nome do Contato</label><input className="input" value={newClient.contact_name} onChange={e => setNewClient(p => ({ ...p, contact_name: e.target.value }))} placeholder="Pessoa responsavel" /></div>
            <div className="form-group"><label>Telefone</label><input className="input" value={newClient.contact_phone} onChange={e => setNewClient(p => ({ ...p, contact_phone: e.target.value }))} placeholder="(00) 00000-0000" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email de Acesso *</label><input className="input" type="email" value={newClient.contact_email} onChange={e => setNewClient(p => ({ ...p, contact_email: e.target.value }))} placeholder="email@cliente.com" /></div>
            <div className="form-group"><label>Senha de Acesso *</label><input className="input" type="password" value={newClient.password} onChange={e => setNewClient(p => ({ ...p, password: e.target.value }))} placeholder="Senha do cliente" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Cidade</label><input className="input" value={newClient.cidade} onChange={e => setNewClient(p => ({ ...p, cidade: e.target.value }))} placeholder="Cidade" /></div>
            <div className="form-group"><label>Estado</label><input className="input" value={newClient.estado} onChange={e => setNewClient(p => ({ ...p, estado: e.target.value }))} placeholder="UF" maxLength={2} /></div>
          </div>

          <div style={{ fontSize: 11, color: '#9B96B0', textTransform: 'uppercase', fontWeight: 600, margin: '16px 0 6px' }}>Redes / Site</div>
          <div className="form-row">
            <div className="form-group"><label>Site</label><input className="input" value={newClient.website} onChange={e => setNewClient(p => ({ ...p, website: e.target.value }))} placeholder="https://..." /></div>
            <div className="form-group"><label>Instagram</label><input className="input" value={newClient.instagram} onChange={e => setNewClient(p => ({ ...p, instagram: e.target.value }))} placeholder="@perfil" /></div>
          </div>

          <div style={{ fontSize: 11, color: '#9B96B0', textTransform: 'uppercase', fontWeight: 600, margin: '16px 0 6px' }}>Contrato / Financeiro</div>
          <div className="form-row">
            <div className="form-group"><label>Mensalidade (R$)</label><input className="input" type="number" step="0.01" value={newClient.monthly_fee} onChange={e => setNewClient(p => ({ ...p, monthly_fee: e.target.value }))} placeholder="0.00" /></div>
            <div className="form-group"><label>Dia do Pagamento</label><input className="input" type="number" min="1" max="31" value={newClient.payment_day} onChange={e => setNewClient(p => ({ ...p, payment_day: e.target.value }))} placeholder="10" /></div>
            <div className="form-group"><label>Inicio do Contrato</label><input className="input" type="date" value={newClient.contrato_inicio} onChange={e => setNewClient(p => ({ ...p, contrato_inicio: e.target.value }))} /></div>
          </div>

          <div style={{ fontSize: 11, color: '#9B96B0', textTransform: 'uppercase', fontWeight: 600, margin: '16px 0 6px' }}>Outros</div>
          <div className="form-group"><label>Pasta do Drive</label><input className="input" value={newClient.drive_folder} onChange={e => setNewClient(p => ({ ...p, drive_folder: e.target.value }))} placeholder="https://drive.google.com/..." /></div>
          <div className="form-group"><label>Observacoes</label><textarea className="input" value={newClient.observacoes} onChange={e => setNewClient(p => ({ ...p, observacoes: e.target.value }))} rows={3} style={{ resize: 'vertical' }} placeholder="Anotacoes internas sobre o cliente" /></div>

          <div style={{ padding: '10px 12px', background: 'rgba(245,166,35,0.06)', borderRadius: 8, fontSize: 12, color: '#F5A623', marginTop: 4 }}>
            Um usuario sera criado automaticamente com o email e senha acima. O cliente usara essas credenciais pra acessar o sistema, aprovar tarefas e acompanhar o andamento.
          </div>
          <div className="modal-actions"><button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button><button className="btn btn-primary" onClick={handleCreate}>Criar</button></div>
        </div></div>
      )}
    </div>
  )
}
