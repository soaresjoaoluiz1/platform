import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Loader } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface CoreAccount { id: string; name: string }

export default function CoreAccountSelect({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [accounts, setAccounts] = useState<CoreAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const loadAccounts = () => {
    if (loaded || loading) return
    setLoading(true); setError(null)
    apiFetch('/api/clients/core-accounts')
      .then((d: any) => { setAccounts(d.accounts || []); setLoaded(true) })
      .catch((e: any) => setError(e?.message || 'Falha ao carregar'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const filterText = query.trim().toLowerCase()
  const filtered = filterText
    ? accounts.filter(a => a.name.toLowerCase().includes(filterText))
    : accounts

  const handleSelect = (a: CoreAccount) => {
    onChange(a.name)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          className="input"
          value={open ? query : value}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); if (!open) { setOpen(true); loadAccounts() } }}
          onFocus={() => { setQuery(value); setOpen(true); loadAccounts() }}
          placeholder={placeholder || 'Buscar conta no /core...'}
          autoComplete="off"
          style={{ paddingRight: 32, width: '100%' }}
        />
        <button
          type="button"
          onClick={() => { setOpen(o => { if (!o) loadAccounts(); return !o }) }}
          aria-label="Abrir lista"
          style={{ position: 'absolute', right: 8, top: '50%', transform: `translateY(-50%) ${open ? 'rotate(180deg)' : ''}`, background: 'none', border: 'none', color: '#9B96B0', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', transition: 'transform 0.15s' }}
        >
          <ChevronDown size={16} />
        </button>
      </div>
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: '#1a1428', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 8, maxHeight: 280, overflowY: 'auto', zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}
        >
          {loading && (
            <div style={{ padding: '14px 14px', fontSize: 12, color: '#9B96B0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader size={14} className="spinning" /> Carregando contas do /core...
            </div>
          )}
          {error && !loading && (
            <div style={{ padding: '12px 14px', fontSize: 12, color: '#FF6B6B' }}>{error}</div>
          )}
          {!loading && !error && filtered.length === 0 && filterText && (
            <div
              onClick={() => handleSelect({ id: '__custom__', name: query.trim() })}
              style={{ padding: '10px 14px', fontSize: 13, color: '#FFB300', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              Usar "<strong>{query.trim()}</strong>" (busca por substring)
            </div>
          )}
          {!loading && !error && filtered.map(a => {
            const isSelected = a.name === value
            return (
              <div
                key={a.id}
                onClick={() => handleSelect(a)}
                style={{
                  padding: '10px 14px', fontSize: 13, color: '#F2F0F7', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: isSelected ? 'rgba(255,179,0,0.08)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <span>{a.name}</span>
                {isSelected && <Check size={14} style={{ color: '#FFB300' }} />}
              </div>
            )
          })}
          {!loading && !error && loaded && accounts.length === 0 && (
            <div style={{ padding: '14px', fontSize: 12, color: '#6B6580', textAlign: 'center' }}>Nenhuma conta encontrada no /core</div>
          )}
        </div>
      )}
    </div>
  )
}
