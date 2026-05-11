// =====================================================================
// PerformanceArea — UI principal de Performance (tabs + dados)
//
// Usado por:
//  - Performance.tsx (cliente) — pega a propria conta
//  - ClientDetail.tsx (admin)  — passa accountName via prop
//
// Equivale ao corpo de /core/src/pages/Dashboard.tsx, sem o sidebar de selecao
// (cliente so tem 1 conta; admin ve no contexto de um cliente especifico).
// =====================================================================
import { useState, useEffect } from 'react'
import {
  fetchAccounts, fetchCompare, fetchDailyCompare,
  type MetaAccount, type CompareResponse, type DailyCompareResponse,
  DAYS_MAP,
} from '../../lib/performanceApi'
import MetricCards from './MetricCards'
import SpendChart from './SpendChart'
import CampaignTable from './CampaignTable'
import FunnelChart from './FunnelChart'
import InstagramView from './InstagramView'
import CRMView from './CRMView'
import KiwifyView from './KiwifyView'
import GoogleAdsView from './GoogleAdsView'
import AnalyticsView from './AnalyticsView'
import OverviewView from './OverviewView'
import { BarChart3, Instagram, LineChart, LayoutDashboard, Calendar } from 'lucide-react'

const DATE_OPTIONS = [
  { label: '7 dias', value: '7d' },
  { label: '14 dias', value: '14d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
  { label: 'Personalizado', value: 'custom' },
]

type ClientTab = 'overview' | 'ads' | 'instagram' | 'googleads' | 'analytics'

interface Props {
  // Substring (case-insensitive) usado pra pre-selecionar a conta Meta.
  // - Cliente: nao precisa passar (backend filtra so a propria conta)
  // - Admin: passa client.core_client_name pra ancorar na conta do cliente
  accountNameHint?: string
  // ID exato da conta Meta — tem prioridade sobre nameHint (mais preciso)
  accountIdHint?: string
}

export default function PerformanceArea({ accountNameHint, accountIdHint }: Props) {
  const [accounts, setAccounts] = useState<MetaAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<MetaAccount | null>(null)
  const [clientTab, setClientTab] = useState<ClientTab>('overview')
  const [datePeriod, setDatePeriod] = useState('7d')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [showCustomDates, setShowCustomDates] = useState(false)
  const [compareData, setCompareData] = useState<CompareResponse | null>(null)
  const [campaignCompare, setCampaignCompare] = useState<CompareResponse | null>(null)
  const [dailyCompare, setDailyCompare] = useState<DailyCompareResponse | null>(null)
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    setLoadingAccounts(true); setError(null)
    fetchAccounts()
      .then((accs) => {
        setAccounts(accs)
        if (accs.length === 0) {
          setError('Nenhuma conta vinculada. Contate o administrador para configurar o vinculo Performance deste cliente.')
        } else if (accountIdHint) {
          const match = accs.find(a => a.id === accountIdHint)
          setSelectedAccount(match || accs[0])
        } else if (accountNameHint) {
          const q = accountNameHint.toLowerCase()
          const match = accs.find(a => (a.name || '').toLowerCase().includes(q))
          setSelectedAccount(match || accs[0])
        } else {
          setSelectedAccount(accs[0])
        }
      })
      .catch((e) => setError(e?.message || 'Falha ao carregar contas'))
      .finally(() => setLoadingAccounts(false))
  }, [accountNameHint, accountIdHint])

  const getEffectiveDays = (): number => {
    if (datePeriod === 'custom' && customDateFrom && customDateTo) {
      const diff = Math.ceil((new Date(customDateTo).getTime() - new Date(customDateFrom).getTime()) / 86400000) + 1
      return Math.max(diff, 1)
    }
    return DAYS_MAP[datePeriod] || 7
  }

  useEffect(() => {
    if (!selectedAccount || (clientTab !== 'ads' && clientTab !== 'overview')) return
    if (clientTab === 'overview') return
    if (datePeriod === 'custom' && (!customDateFrom || !customDateTo)) return
    setLoadingData(true)
    const days = getEffectiveDays()
    const since = datePeriod === 'custom' ? customDateFrom : undefined
    const until = datePeriod === 'custom' ? customDateTo : undefined
    Promise.all([
      fetchCompare(selectedAccount.id, days, 'account', since, until).catch(() => null),
      fetchCompare(selectedAccount.id, days, 'campaign', since, until).catch(() => null),
      fetchDailyCompare(selectedAccount.id, days, since, until).catch(() => null),
    ])
      .then(([acct, camp, daily]) => {
        setCompareData(acct); setCampaignCompare(camp); setDailyCompare(daily)
        setLastUpdate(new Date())
      })
      .finally(() => setLoadingData(false))
  }, [selectedAccount, datePeriod, clientTab, customDateFrom, customDateTo])

  useEffect(() => { setClientTab('overview') }, [selectedAccount])

  if (loadingAccounts) {
    return (
      <div className="loading-container" style={{ minHeight: 400 }}>
        <div className="spinner" /><span>Carregando contas...</span>
      </div>
    )
  }

  if (error || !selectedAccount) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40, color: '#9B96B0', maxWidth: 600, margin: '60px auto' }}>
        <BarChart3 size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#F2F0F7' }}>Painel de Performance</h3>
        <p style={{ fontSize: 13 }}>{error || 'Conta nao disponivel.'}</p>
      </div>
    )
  }

  const current = compareData?.current?.[0] || null
  const previous = compareData?.previous?.[0] || null
  const showAccountPicker = accounts.length > 1

  return (
    <div className="performance-area">
      {/* Header */}
      <div className="performance-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{selectedAccount.name}</h2>
        {showAccountPicker && (
          <select
            className="input"
            value={selectedAccount.id}
            onChange={(e) => {
              const acc = accounts.find(a => a.id === e.target.value)
              if (acc) setSelectedAccount(acc)
            }}
            style={{ padding: '6px 10px', fontSize: 12, maxWidth: 280 }}
          >
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        )}
        <div className="client-tabs" style={{ display: 'flex', gap: 4, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <button className={`client-tab ${clientTab === 'overview' ? 'active' : ''}`} onClick={() => setClientTab('overview')}>
            <LayoutDashboard size={14} /><span>Geral</span>
          </button>
          <button className={`client-tab ${clientTab === 'ads' ? 'active' : ''}`} onClick={() => setClientTab('ads')}>
            <BarChart3 size={14} /><span>Meta Ads</span>
          </button>
          <button className={`client-tab ${clientTab === 'instagram' ? 'active' : ''}`} onClick={() => setClientTab('instagram')}>
            <Instagram size={14} /><span>Instagram</span>
          </button>
          <button className={`client-tab ${clientTab === 'googleads' ? 'active' : ''}`} onClick={() => setClientTab('googleads')}>
            <BarChart3 size={14} /><span>Google Ads</span>
          </button>
          <button className={`client-tab ${clientTab === 'analytics' ? 'active' : ''}`} onClick={() => setClientTab('analytics')}>
            <LineChart size={14} /><span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Date selector */}
      <div className="date-bar" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
        <div className="date-selector" style={{ display: 'flex', gap: 4 }}>
          {DATE_OPTIONS.map((opt) => (
            <button key={opt.value} className={`date-btn ${datePeriod === opt.value ? 'active' : ''}`} onClick={() => {
              setDatePeriod(opt.value)
              setShowCustomDates(opt.value === 'custom')
            }}>
              {opt.value === 'custom' ? <><Calendar size={11} /> {opt.label}</> : opt.label}
            </button>
          ))}
        </div>
        {showCustomDates && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="date" className="input" value={customDateFrom} onChange={e => setCustomDateFrom(e.target.value)} style={{ width: 140, padding: '6px 10px', fontSize: 12 }} />
            <span style={{ color: '#6E6887', fontSize: 11 }}>ate</span>
            <input type="date" className="input" value={customDateTo} onChange={e => setCustomDateTo(e.target.value)} style={{ width: 140, padding: '6px 10px', fontSize: 12 }} />
          </div>
        )}
      </div>

      {/* Overview */}
      {clientTab === 'overview' && (
        <OverviewView
          accountId={selectedAccount.id}
          accountName={selectedAccount.name}
          days={getEffectiveDays()}
          since={datePeriod === 'custom' ? customDateFrom : undefined}
          until={datePeriod === 'custom' ? customDateTo : undefined}
        />
      )}

      {/* Meta Ads */}
      {clientTab === 'ads' && (
        <>
          {loadingData ? (
            <div className="loading-container"><div className="spinner" /><span>Carregando dados...</span></div>
          ) : !current ? (
            <div className="card" style={{ textAlign: 'center', padding: 32, color: '#9B96B0' }}>
              <p>Sem dados de Meta Ads nos ultimos {getEffectiveDays()} dias.</p>
            </div>
          ) : (
            <>
              <section className="dash-section">
                <MetricCards current={current} previous={previous} />
              </section>
              <section className="dash-section">
                <div className="section-title">Desempenho no Periodo</div>
                <div className="charts-grid">
                  <div className="chart-card">
                    {selectedAccount.name.toLowerCase().includes('sameco') ? (
                      <>
                        <h3>Leads</h3>
                        <SpendChart currentData={dailyCompare?.current || []} previousData={dailyCompare?.previous || []} dataKey="leads" label="Leads" />
                      </>
                    ) : (
                      <>
                        <h3>Conversas Iniciadas</h3>
                        <SpendChart currentData={dailyCompare?.current || []} previousData={dailyCompare?.previous || []} dataKey="messaging" label="Conversas" />
                      </>
                    )}
                  </div>
                  <div className="chart-card">
                    <h3>Funil de Conversao</h3>
                    <FunnelChart insight={current} />
                  </div>
                </div>
                <div className="charts-grid">
                  <div className="chart-card full-width">
                    <h3>Valor Investido</h3>
                    <SpendChart currentData={dailyCompare?.current || []} previousData={dailyCompare?.previous || []} dataKey="spend" label="Investimento" />
                  </div>
                </div>
              </section>
              <section className="dash-section">
                <div className="section-title">Campanhas</div>
                <CampaignTable currentCampaigns={campaignCompare?.current || []} previousCampaigns={campaignCompare?.previous || []} />
              </section>
              <CRMView accountId={selectedAccount.id} accountName={selectedAccount.name} days={getEffectiveDays()} adSpend={current ? parseFloat(current.spend) : undefined} />
              <KiwifyView accountName={selectedAccount.name} days={getEffectiveDays()} adSpend={current ? parseFloat(current.spend) : undefined} />
            </>
          )}
        </>
      )}

      {clientTab === 'instagram' && <InstagramView accountName={selectedAccount.name} />}
      {clientTab === 'googleads' && <GoogleAdsView accountName={selectedAccount.name} days={getEffectiveDays()} since={datePeriod === 'custom' ? customDateFrom : undefined} until={datePeriod === 'custom' ? customDateTo : undefined} />}
      {clientTab === 'analytics' && <AnalyticsView accountName={selectedAccount.name} days={getEffectiveDays()} since={datePeriod === 'custom' ? customDateFrom : undefined} until={datePeriod === 'custom' ? customDateTo : undefined} />}

      {lastUpdate && (
        <div style={{ marginTop: 24, textAlign: 'right', fontSize: 11, color: '#6E6887' }}>
          Ultima atualizacao: {lastUpdate.toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  )
}
