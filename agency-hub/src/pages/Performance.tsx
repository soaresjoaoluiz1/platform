import { useState, useEffect } from 'react'
import { BarChart3, ExternalLink } from 'lucide-react'
import { apiFetch } from '../lib/api'

export default function Performance() {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true); setError(null)
    apiFetch('/api/clients/me/core-embed-url')
      .then((d: any) => setEmbedUrl(d.url))
      .catch((e: any) => setError(e?.message || 'Falha ao gerar link do painel'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading-container" style={{ minHeight: 400 }}><div className="spinner" /><span>Carregando painel...</span></div>
  }

  if (error || !embedUrl) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40, color: '#9B96B0', maxWidth: 600, margin: '60px auto' }}>
        <BarChart3 size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#F2F0F7' }}>Painel de Performance</h3>
        <p style={{ fontSize: 13 }}>{error || 'Nao foi possivel carregar o painel.'}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1><BarChart3 size={20} style={{ marginRight: 8, verticalAlign: -3 }} /> Performance</h1>
        <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ExternalLink size={12} /> Abrir em tela cheia
        </a>
      </div>
      <div style={{ width: '100%', height: 'calc(100vh - 140px)', minHeight: 600, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: '#0A0118' }}>
        <iframe
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Painel de Performance"
        />
      </div>
    </div>
  )
}
