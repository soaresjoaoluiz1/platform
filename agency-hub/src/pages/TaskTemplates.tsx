// =====================================================================
// Tarefas recorrentes — admin (dono/gerente)
//
// Lista de templates + modal de criar/editar.
// Reusa estrutura visual de Nova Tarefa / Nova Tarefa Mae do Pipeline.
// =====================================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchTaskTemplates, fetchTaskTemplate, createTaskTemplate, updateTaskTemplate, deleteTaskTemplate, runTaskTemplate,
  fetchClients, fetchDepartments, fetchUsers, fetchCategories,
  type TaskTemplate, type TaskTemplateSubtask, type Client, type Department, type User as UserT, type TaskCategory,
} from '../lib/api'
import { Repeat, Plus, Play, Pencil, Trash2, X, Pause, CheckCircle2 } from 'lucide-react'
import { useToast } from '../components/Toast'

const WEEKDAYS = [
  { v: 1, label: 'Segunda-feira' }, { v: 2, label: 'Terca-feira' }, { v: 3, label: 'Quarta-feira' },
  { v: 4, label: 'Quinta-feira' }, { v: 5, label: 'Sexta-feira' }, { v: 6, label: 'Sabado' }, { v: 7, label: 'Domingo' },
]

const HOURS = Array.from({ length: 24 }, (_, h) => h)

function formatFrequency(t: TaskTemplate) {
  if (t.recurrence_type === 'weekly') {
    const day = WEEKDAYS.find(w => w.v === t.recurrence_day)?.label || `Dia ${t.recurrence_day}`
    return `Semanal · ${day} ${String(t.recurrence_hour).padStart(2, '0')}:00`
  }
  return `Mensal · Dia ${t.recurrence_day} ${String(t.recurrence_hour).padStart(2, '0')}:00`
}

function formatDateBR(s: string | null) {
  if (!s) return '—'
  const d = new Date(s + '-03:00')
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

interface FormState {
  id?: number
  name: string
  task_type: 'normal' | 'mae'
  client_id: string
  category_id: string
  department_id: string
  title: string
  description: string
  priority: string
  drive_link: string
  drive_link_raw: string
  approval_link: string
  approval_text: string
  publish_date: string
  publish_objective: string
  due_date_offset_days: number
  recurrence_type: 'weekly' | 'monthly'
  recurrence_day: number
  recurrence_hour: number
  assigned_to: string[]
  subtasks: TaskTemplateSubtask[]
  is_active: boolean
}

const BLANK_FORM: FormState = {
  name: '', task_type: 'normal', client_id: '', category_id: '', department_id: '',
  title: '', description: '', priority: 'normal',
  drive_link: '', drive_link_raw: '', approval_link: '', approval_text: '',
  publish_date: '', publish_objective: '',
  due_date_offset_days: 7,
  recurrence_type: 'monthly', recurrence_day: 1, recurrence_hour: 6,
  assigned_to: [], subtasks: [], is_active: true,
}

export default function TaskTemplates() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [allUsers, setAllUsers] = useState<UserT[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [modalMode, setModalMode] = useState<'new' | number | null>(null)
  const [form, setForm] = useState<FormState>(BLANK_FORM)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    fetchTaskTemplates().then(setTemplates).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    fetchClients().then(setClients).catch(() => {})
    fetchDepartments().then(setDepartments).catch(() => {})
    fetchUsers().then(u => setAllUsers(u as any)).catch(() => {})
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  const openNew = () => { setForm(BLANK_FORM); setModalMode('new') }

  const openEdit = async (id: number) => {
    try {
      const t = await fetchTaskTemplate(id)
      let approvalFiles: string[] = []
      try { approvalFiles = t.approval_files ? JSON.parse(t.approval_files) : [] } catch {}
      // approval_link sempre vai ser o primeiro file (ou single) — pra simplificar UI usa approval_link
      setForm({
        id: t.id,
        name: t.name,
        task_type: t.task_type,
        client_id: String(t.client_id || ''),
        category_id: t.category_id ? String(t.category_id) : '',
        department_id: t.department_id ? String(t.department_id) : '',
        title: t.title,
        description: t.description || '',
        priority: t.priority || 'normal',
        drive_link: t.drive_link || '',
        drive_link_raw: t.drive_link_raw || '',
        approval_link: approvalFiles[0] || t.approval_link || '',
        approval_text: t.approval_text || '',
        publish_date: t.publish_date || '',
        publish_objective: t.publish_objective || '',
        due_date_offset_days: t.due_date_offset_days || 7,
        recurrence_type: t.recurrence_type,
        recurrence_day: t.recurrence_day,
        recurrence_hour: t.recurrence_hour,
        assigned_to: (t.assigned_to || []).map(String),
        subtasks: (t.subtasks || []).map(s => ({ ...s, assigned_to: s.assigned_to || [] })),
        is_active: !!t.is_active,
      })
      setModalMode(id)
    } catch (e: any) { toast(e?.message || 'Erro ao carregar template', 'error') }
  }

  const close = () => { setModalMode(null); setForm(BLANK_FORM) }

  const handleSave = async () => {
    if (!form.name || !form.client_id || !form.title) {
      toast('Nome, cliente e titulo obrigatorios', 'error')
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        name: form.name,
        task_type: form.task_type,
        client_id: +form.client_id,
        category_id: form.category_id ? +form.category_id : null,
        department_id: form.department_id ? +form.department_id : null,
        title: form.title,
        description: form.description || null,
        priority: form.priority,
        drive_link: form.drive_link || null,
        drive_link_raw: form.drive_link_raw || null,
        approval_link: form.approval_link || null,
        approval_files: form.approval_link ? [form.approval_link] : [],
        approval_text: form.approval_text || null,
        publish_date: form.publish_date || null,
        publish_objective: form.publish_objective || null,
        due_date_offset_days: +form.due_date_offset_days,
        recurrence_type: form.recurrence_type,
        recurrence_day: +form.recurrence_day,
        recurrence_hour: +form.recurrence_hour,
        assigned_to: form.assigned_to.map(Number),
        subtasks: form.subtasks.map((s, i) => ({
          subtask_position: i + 1,
          title: s.title,
          description: s.description || null,
          priority: s.priority || 'normal',
          category_id: s.category_id || null,
          department_id: s.department_id || null,
          due_date_offset_days: s.due_date_offset_days != null ? +s.due_date_offset_days : null,
          drive_link: s.drive_link || null,
          drive_link_raw: s.drive_link_raw || null,
          approval_link: s.approval_link || null,
          approval_files: s.approval_link ? [s.approval_link] : [],
          approval_text: s.approval_text || null,
          publish_date: s.publish_date || null,
          publish_objective: s.publish_objective || null,
          assigned_to: (s.assigned_to || []).map(Number),
        })),
        is_active: form.is_active,
      }
      if (form.id) await updateTaskTemplate(form.id, payload)
      else await createTaskTemplate(payload)
      close(); load()
      toast(form.id ? 'Template atualizado' : 'Template criado')
    } catch (e: any) { toast(e?.message || 'Erro ao salvar', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Pausar/arquivar o template "${name}"? Ele para de gerar tarefas. Pode ser reativado depois.`)) return
    try {
      await deleteTaskTemplate(id)
      load()
      toast('Template arquivado')
    } catch (e: any) { toast(e?.message || 'Erro', 'error') }
  }

  const handleRunNow = async (id: number, name: string) => {
    if (!confirm(`Criar uma tarefa agora a partir de "${name}"?`)) return
    try {
      const r = await runTaskTemplate(id)
      toast(`Tarefa criada (id ${r.task_id}, ${r.subtasks_created} subtarefas)`)
      load()
    } catch (e: any) { toast(e?.message || 'Erro ao executar', 'error') }
  }

  const addSubtaskRow = () => {
    setForm(p => ({ ...p, subtasks: [...p.subtasks, { title: '', priority: 'normal', due_date_offset_days: p.due_date_offset_days, assigned_to: [] }] }))
  }

  const updateSubtask = (idx: number, patch: Partial<TaskTemplateSubtask>) => {
    setForm(p => ({ ...p, subtasks: p.subtasks.map((s, i) => i === idx ? { ...s, ...patch } : s) }))
  }

  const removeSubtask = (idx: number) => {
    setForm(p => ({ ...p, subtasks: p.subtasks.filter((_, i) => i !== idx) }))
  }

  return (
    <div>
      <div className="page-header">
        <h1><Repeat size={20} style={{ marginRight: 8, verticalAlign: -3 }} /> Tarefas Recorrentes</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Templates que criam tarefas automaticamente em intervalos definidos
        </p>
        <div className="page-header-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-primary btn-sm" onClick={openNew}><Plus size={14} /> Nova Recorrencia</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container" style={{ minHeight: 200 }}><div className="spinner" /></div>
      ) : templates.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Nenhum template criado. Clica em "Nova Recorrencia" pra comecar.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="campaign-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Nome / Cliente</th>
                <th>Tipo</th>
                <th>Frequencia</th>
                <th>Proxima execucao</th>
                <th>Ultima execucao</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id} style={{ opacity: t.is_active ? 1 : 0.55 }}>
                  <td className="name">
                    <div style={{ fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {t.client_name} · "{t.title}"
                    </div>
                  </td>
                  <td>
                    {t.task_type === 'mae' ? (
                      <span className="stage-badge" style={{ background: 'rgba(255,179,0,0.15)', color: 'var(--accent)', borderColor: 'rgba(255,179,0,0.3)' }}>
                        Mae ({t.subtasks_count || 0} subs)
                      </span>
                    ) : (
                      <span className="stage-badge" style={{ background: 'rgba(155,89,182,0.15)', color: '#c39bda', borderColor: 'rgba(155,89,182,0.3)' }}>
                        Normal
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{formatFrequency(t)}</td>
                  <td style={{ fontSize: 12 }}>{formatDateBR(t.next_run_at)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDateBR(t.last_run_at)}</td>
                  <td>
                    {t.is_active ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--positive)' }}>
                        <CheckCircle2 size={12} /> Ativa
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                        <Pause size={12} /> Arquivada
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleRunNow(t.id, t.name)} title="Executar agora" style={{ padding: '4px 8px' }}><Play size={12} /></button>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t.id)} title="Editar" style={{ padding: '4px 8px' }}><Pencil size={12} /></button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(t.id, t.name)} title="Arquivar" style={{ padding: '4px 8px' }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal criar/editar */}
      {modalMode !== null && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}>
          <div className="modal" style={{ maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2>{form.id ? 'Editar Recorrencia' : 'Nova Recorrencia'}</h2>

            {/* Recorrencia / agendamento */}
            <div style={{ padding: '14px 16px', background: 'rgba(255,179,0,0.04)', border: '1px solid rgba(255,179,0,0.15)', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Agendamento
              </div>
              <div className="form-group"><label>Nome do template (interno) *</label><input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Linha Editorial ASK Mensal" /></div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de tarefa</label>
                  <select className="select" value={form.task_type} onChange={e => setForm(p => ({ ...p, task_type: e.target.value as any }))}>
                    <option value="normal">Tarefa normal</option>
                    <option value="mae">Tarefa Mae (com subtarefas)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Frequencia</label>
                  <select className="select" value={form.recurrence_type} onChange={e => setForm(p => ({ ...p, recurrence_type: e.target.value as any }))}>
                    <option value="monthly">Mensal</option>
                    <option value="weekly">Semanal</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{form.recurrence_type === 'weekly' ? 'Dia da semana' : 'Dia do mes'}</label>
                  {form.recurrence_type === 'weekly' ? (
                    <select className="select" value={form.recurrence_day} onChange={e => setForm(p => ({ ...p, recurrence_day: +e.target.value }))}>
                      {WEEKDAYS.map(w => <option key={w.v} value={w.v}>{w.label}</option>)}
                    </select>
                  ) : (
                    <select className="select" value={form.recurrence_day} onChange={e => setForm(p => ({ ...p, recurrence_day: +e.target.value }))}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>Dia {d}</option>)}
                    </select>
                  )}
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <select className="select" value={form.recurrence_hour} onChange={e => setForm(p => ({ ...p, recurrence_hour: +e.target.value }))}>
                    {HOURS.map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Prazo da tarefa</label>
                  <input className="input" type="number" min={0} value={form.due_date_offset_days} onChange={e => setForm(p => ({ ...p, due_date_offset_days: +e.target.value || 0 }))} />
                  <small style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>+N dias apos criacao</small>
                </div>
              </div>
              {form.recurrence_type === 'monthly' && form.recurrence_day === 31 && (
                <div style={{ fontSize: 11, color: 'var(--warning)', marginTop: 6 }}>
                  Em meses com menos de 31 dias, vai usar o ultimo dia disponivel (28/29/30).
                </div>
              )}
            </div>

            {/* Dados da tarefa */}
            <div className="form-row">
              <div className="form-group"><label>Titulo da tarefa *</label><input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Linha Editorial Mensal" /></div>
              <div className="form-group"><label>Cliente *</label><select className="select" value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}><option value="">Selecione</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            </div>
            <div className="form-group"><label>Descricao</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="form-row">
              <div className="form-group"><label>Categoria</label><select className="select" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}><option value="">Nenhuma</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="form-group"><label>Departamento</label><select className="select" value={form.department_id} onChange={e => setForm(p => ({ ...p, department_id: e.target.value }))}><option value="">Nenhum</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
              <div className="form-group"><label>Prioridade</label><select className="select" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}><option value="low">Baixa</option><option value="normal">Normal</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></div>
            </div>
            <div className="form-group">
              <label>Responsaveis</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {allUsers.filter(u => u.role !== 'cliente').map(u => {
                  const sel = form.assigned_to.includes(String(u.id))
                  return <button type="button" key={u.id} onClick={() => setForm(p => ({ ...p, assigned_to: sel ? p.assigned_to.filter(x => x !== String(u.id)) : [...p.assigned_to, String(u.id)] }))} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${sel ? 'var(--positive)' : 'var(--border-subtle)'}`, background: sel ? 'var(--positive-bg)' : 'transparent', color: sel ? 'var(--positive)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{sel ? '✓ ' : ''}{u.name}</button>
                })}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Link Drive Bruto</label><input className="input" value={form.drive_link_raw} onChange={e => setForm(p => ({ ...p, drive_link_raw: e.target.value }))} /></div>
              <div className="form-group"><label>Link Drive Pronto</label><input className="input" value={form.drive_link} onChange={e => setForm(p => ({ ...p, drive_link: e.target.value }))} /></div>
            </div>

            {/* Subtarefas (so se task_type=mae) */}
            {form.task_type === 'mae' && (
              <div style={{ padding: '14px 16px', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', borderRadius: 10, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Subtarefas ({form.subtasks.length})
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addSubtaskRow}><Plus size={11} /> Adicionar subtarefa</button>
                </div>
                {form.subtasks.length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>
                    Sem subtarefas. Cada execucao criara uma mae vazia.
                  </div>
                )}
                {form.subtasks.map((sub, idx) => (
                  <div key={idx} style={{ padding: 10, background: 'var(--bg-card)', borderRadius: 8, marginBottom: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>SUB {idx + 1}</span>
                      <button type="button" onClick={() => removeSubtask(idx)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} title="Remover"><X size={12} /></button>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>Titulo *</label><input className="input" value={sub.title} onChange={e => updateSubtask(idx, { title: e.target.value })} /></div>
                      <div className="form-group"><label>Prazo (+N dias)</label><input className="input" type="number" min={0} value={sub.due_date_offset_days ?? ''} onChange={e => updateSubtask(idx, { due_date_offset_days: e.target.value === '' ? null : +e.target.value })} /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>Departamento</label><select className="select" value={sub.department_id || ''} onChange={e => updateSubtask(idx, { department_id: e.target.value ? +e.target.value : null })}><option value="">Nenhum</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                      <div className="form-group"><label>Prioridade</label><select className="select" value={sub.priority || 'normal'} onChange={e => updateSubtask(idx, { priority: e.target.value })}><option value="low">Baixa</option><option value="normal">Normal</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></div>
                    </div>
                    <div className="form-group">
                      <label>Responsaveis</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {allUsers.filter(u => u.role !== 'cliente').map(u => {
                          const sel = (sub.assigned_to || []).map(String).includes(String(u.id))
                          return <button type="button" key={u.id} onClick={() => updateSubtask(idx, { assigned_to: sel ? (sub.assigned_to || []).filter(x => +x !== u.id) : [...(sub.assigned_to || []), u.id] })} style={{ padding: '4px 8px', borderRadius: 4, border: `1px solid ${sel ? 'var(--positive)' : 'var(--border-subtle)'}`, background: sel ? 'var(--positive-bg)' : 'transparent', color: sel ? 'var(--positive)' : 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>{u.name}</button>
                        })}
                      </div>
                    </div>
                    <div className="form-group"><label>Descricao</label><textarea className="input" rows={2} value={sub.description || ''} onChange={e => updateSubtask(idx, { description: e.target.value })} /></div>
                  </div>
                ))}
              </div>
            )}

            {form.id && (
              <div className="form-group" style={{ marginTop: 12 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                  Template ativo (gera tarefas no horario agendado)
                </label>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={close}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : (form.id ? 'Salvar' : 'Criar template')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
