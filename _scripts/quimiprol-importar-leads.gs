/**
 * Importacao em lote de leads pra QUIMIPROL.
 * Tem checkpoint automatico: se der timeout (6min), rerodar Executar continua de onde parou.
 *
 * Pra zerar progresso e comecar do zero: rodar funcao `resetarCheckpoint`
 */

const CRM_WEBHOOK = 'https://drosagencia.com.br/crm/api/webhooks/sheets/quimiprol'
const SHEET_NAME = 'Leads'
const HEADER_ROW = 1
const FIRST_DATA_ROW = 2
const CHECKPOINT_KEY = 'quimiprol_last_row'
const MAX_RUNTIME_MS = 5 * 60 * 1000 // 5min — para antes do limite de 6min, evita timeout

const STAGE_MAP = {
  'novo lead': 'Novo Lead',
  'atendimento': 'Em Atendimento',
  'em atendimento': 'Em Atendimento',
  'loja autorizada': 'Em Atendimento',
  'qualificado': 'Qualificado',
  'visita agendada': 'Visita Agendada',
  'proposta': 'Proposta',
  'venda': 'Venda',
  'perdido': 'Perdido',
}

function importarLeadsQuimiprol() {
  const props = PropertiesService.getScriptProperties()
  const startTime = Date.now()

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) throw new Error(`Aba "${SHEET_NAME}" nao encontrada.`)

  const lastRow = sheet.getLastRow()
  const lastProcessed = Number(props.getProperty(CHECKPOINT_KEY)) || (HEADER_ROW)
  const startRow = lastProcessed + 1

  if (startRow > lastRow) {
    Logger.log(`Nada novo pra importar. Ultimo processado: linha ${lastProcessed}, ultima da planilha: ${lastRow}`)
    Logger.log(`Pra reimportar tudo do zero, rode "resetarCheckpoint" e depois "importarLeadsQuimiprol".`)
    return
  }

  Logger.log(`Retomando da linha ${startRow} ate ${lastRow} (${lastRow - startRow + 1} restantes)`)

  const numRows = lastRow - startRow + 1
  const data = sheet.getRange(startRow, 1, numRows, 7).getValues()
  let ok = 0, err = 0, skip = 0
  const errors = []
  let currentRow = startRow

  for (let i = 0; i < data.length; i++) {
    currentRow = startRow + i

    // Checa runtime — se ja passou 5min, salva checkpoint e para
    if (Date.now() - startTime > MAX_RUNTIME_MS) {
      props.setProperty(CHECKPOINT_KEY, String(currentRow - 1))
      Logger.log(`\n⏱  TIMEOUT preventivo na linha ${currentRow}. Rerode "importarLeadsQuimiprol" pra continuar.`)
      Logger.log(`Parcial: ok=${ok} err=${err} skip=${skip}`)
      return
    }

    const row = data[i]
    const nome    = String(row[0] || '').trim()
    const email   = String(row[1] || '').trim().replace(/^-$/, '')
    const tel     = String(row[2] || '').trim().replace(/[^\d]/g, '')
    const status  = String(row[3] || '').trim()
    const corretor= String(row[4] || '').trim()
    const origem  = String(row[5] || '').trim() || 'SITE'

    if (!tel) { skip++; props.setProperty(CHECKPOINT_KEY, String(currentRow)); continue }

    const statusLower = status.toLowerCase()
    const stageName = STAGE_MAP[statusLower] || 'Novo Lead'
    const tag = statusLower === 'loja autorizada' ? 'Loja Autorizada' : 'Revendedor'

    const payload = {
      nome, telefone: tel, email,
      source: origem,
      corretor,
      stage_name: stageName,
      tags: [tag],
    }

    try {
      const r = UrlFetchApp.fetch(CRM_WEBHOOK, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
      })
      const code = r.getResponseCode()
      if (code >= 200 && code < 300) ok++
      else { err++; errors.push(`L${currentRow} (${tel}): HTTP ${code} - ${r.getContentText().substring(0, 200)}`) }
    } catch (e) {
      err++; errors.push(`L${currentRow} (${tel}): ${e.message}`)
    }

    // Salva checkpoint a cada 10 linhas pra nao perder progresso
    if ((i + 1) % 10 === 0) props.setProperty(CHECKPOINT_KEY, String(currentRow))
    if ((i + 1) % 25 === 0) { Logger.log(`Linha ${currentRow}/${lastRow} (ok=${ok} err=${err})`); Utilities.sleep(300) }
  }

  // Acabou tudo
  props.setProperty(CHECKPOINT_KEY, String(lastRow))
  Logger.log(`\n=== CONCLUIDO ===`)
  Logger.log(`Faixa processada: ${startRow}-${lastRow} | OK: ${ok} | Erros: ${err} | Pulados: ${skip}`)
  if (errors.length) { Logger.log(`\n=== ERROS ===`); errors.slice(0, 30).forEach(e => Logger.log(e)) }
}

function resetarCheckpoint() {
  PropertiesService.getScriptProperties().deleteProperty(CHECKPOINT_KEY)
  Logger.log('Checkpoint zerado. Proxima execucao comeca da linha 2.')
}

function verCheckpoint() {
  const v = PropertiesService.getScriptProperties().getProperty(CHECKPOINT_KEY)
  Logger.log(`Ultima linha processada: ${v || '(nenhuma — vai comecar do inicio)'}`)
}

// Define checkpoint manualmente — proxima execucao retoma da linha SEGUINTE
// Util quando a 1a tentativa rodou sem checkpoint e voce precisa pular as ja importadas
function definirCheckpoint() {
  PropertiesService.getScriptProperties().setProperty(CHECKPOINT_KEY, '3100')
  Logger.log(`Checkpoint definido em 3100. Proxima execucao comeca na linha 3101.`)
}
