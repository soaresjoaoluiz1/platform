/**
 * Importacao em lote de leads pra conta QUIMIPROL no Dros CRM.
 *
 * Como usar:
 *   1. Abre a planilha com os leads no Google Sheets
 *   2. Extensoes > Apps Script > cola esse codigo
 *   3. Ajusta SHEET_NAME se a aba nao se chamar "Página1"
 *   4. Clica Salvar > Executar > funcao "importarLeadsQuimiprol"
 *   5. Autoriza acesso na 1a vez (UrlFetchApp + SpreadsheetApp)
 *   6. Abre Visualizar > Logs pra ver progresso
 *
 * Mapeamento de colunas (A-G):
 *   A = Nome
 *   B = Email
 *   C = Telefone
 *   D = Status        (Loja Autorizada -> stage "Em Atendimento" + tag "Loja Autorizada"
 *                      qualquer outro  -> stage "Em Atendimento" + tag "Revendedor")
 *   E = Corretor      (Nelson / Darlan -> vira atendente do lead)
 *   F = Origem        (SITE -> source do lead)
 *   G = Publico       (ignorado, mas pode ser usado depois)
 *
 * Comportamento:
 *   - Linha 1 e header, comeca da linha 2
 *   - Se telefone ja existe no CRM, faz update (mantem dados existentes via COALESCE)
 *   - Cria atendentes (corretores) que ainda nao existem? NAO. Voce ja criou Nelson e Darlan.
 *   - Cria tags que ainda nao existem? SIM, automaticamente
 *   - Move lead pra etapa "Em Atendimento"
 *
 * IMPORTANTE: rode 1x so. Se rodar 2x, vai atualizar (nao duplica) mas adiciona log dobrado.
 */

const CRM_WEBHOOK = 'https://drosagencia.com.br/crm/api/webhooks/sheets/quimiprol'
const SHEET_NAME = 'Página1' // Ajuste se sua aba tiver outro nome (ex: 'LEADS', 'Sheet1')
const START_ROW = 2          // Pula header

function importarLeadsQuimiprol() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    throw new Error(`Aba "${SHEET_NAME}" nao encontrada. Ajuste a constante SHEET_NAME.`)
  }

  const lastRow = sheet.getLastRow()
  if (lastRow < START_ROW) {
    Logger.log('Nenhum lead pra importar.')
    return
  }

  // Le A2:G{lastRow} de uma vez (rapido)
  const numRows = lastRow - START_ROW + 1
  const data = sheet.getRange(START_ROW, 1, numRows, 7).getValues()

  let okCount = 0, errCount = 0, skipCount = 0
  const errors = []

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const nome    = String(row[0] || '').trim()
    const email   = String(row[1] || '').trim()
    const tel     = String(row[2] || '').trim()
    const status  = String(row[3] || '').trim()
    const corretor= String(row[4] || '').trim()
    const origem  = String(row[5] || '').trim() || 'SITE'

    if (!tel) { skipCount++; continue } // sem telefone, pula

    // Decide tag pelo status
    const tag = /loja\s+autorizada/i.test(status) ? 'Loja Autorizada' : 'Revendedor'

    const payload = {
      nome: nome,
      telefone: tel,
      email: email,
      source: origem,
      corretor: corretor,
      stage_name: 'Em Atendimento',
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
      if (code >= 200 && code < 300) {
        okCount++
      } else {
        errCount++
        errors.push(`Linha ${i + START_ROW} (${tel}): HTTP ${code} - ${r.getContentText().substring(0, 200)}`)
      }
    } catch (e) {
      errCount++
      errors.push(`Linha ${i + START_ROW} (${tel}): ${e.message}`)
    }

    // Throttle leve pra nao saturar o backend
    if ((i + 1) % 25 === 0) {
      Logger.log(`Progresso: ${i + 1}/${data.length} (ok=${okCount} err=${errCount})`)
      Utilities.sleep(500)
    }
  }

  Logger.log(`\n=== RESUMO ===`)
  Logger.log(`Total linhas:  ${data.length}`)
  Logger.log(`Enviados OK:   ${okCount}`)
  Logger.log(`Erros:         ${errCount}`)
  Logger.log(`Pulados:       ${skipCount} (sem telefone)`)
  if (errors.length > 0) {
    Logger.log(`\n=== ERROS ===`)
    errors.slice(0, 30).forEach(e => Logger.log(e))
    if (errors.length > 30) Logger.log(`... +${errors.length - 30} erros (so 30 mostrados)`)
  }
}
