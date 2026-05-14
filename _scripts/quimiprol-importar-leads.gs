/**
 * Importacao em lote de leads pra conta QUIMIPROL no Dros CRM.
 *
 * Como usar:
 *   1. Abre a planilha "leads_2026-05-14.xlsx" no Google Sheets
 *   2. Menu Extensoes > Apps Script > apaga codigo padrao e cola tudo isso
 *   3. Clica Salvar > Executar > funcao "importarLeadsQuimiprol"
 *   4. Autoriza acesso na 1a vez (UrlFetchApp + SpreadsheetApp)
 *   5. Menu Ver > Registros pra acompanhar progresso
 *
 * Mapeamento de colunas (A-G):
 *   A = Nome
 *   B = Email
 *   C = Telefone
 *   D = Status        valores possiveis: "Novo Lead", "Atendimento", "Loja Autorizada"
 *                     - "Loja Autorizada" -> etapa "Atendimento" + tag "Loja Autorizada"
 *                     - qualquer outro    -> etapa = mesmo nome do status + tag "Revendedor"
 *   E = Corretor      "Nelson" ou "Darlan" -> vira atendente do lead
 *   F = Origem        SITE -> source do lead
 *   G = Publico       ignorado
 *
 * Comportamento:
 *   - Linha 1 e header, comeca da linha 2
 *   - Se telefone ja existe no CRM da QUIMIPROL, faz update (nao duplica)
 *   - Cria tags automaticamente se ainda nao existirem
 *   - Busca atendente pelo nome do corretor (Nelson eh gerente, Darlan atendente — ambos OK)
 *
 * IMPORTANTE:
 *   - Rode apenas 1x. Se rodar 2x, atualiza dados mas nao duplica leads.
 *   - Confira se conta "QUIMIPROL" tem slug "quimiprol" no CRM (se for diferente, ajuste CRM_WEBHOOK)
 */

const CRM_WEBHOOK = 'https://drosagencia.com.br/crm/api/webhooks/sheets/quimiprol'
const SHEET_NAME = 'Leads'   // Nome da aba (em baixo da planilha)
const START_ROW = 2          // Linha 1 e header

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

  const numRows = lastRow - START_ROW + 1
  const data = sheet.getRange(START_ROW, 1, numRows, 7).getValues()

  let okCount = 0, errCount = 0, skipCount = 0
  const errors = []

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const nome    = String(row[0] || '').trim()
    const email   = String(row[1] || '').trim().replace(/^-$/, '') // celula com "-" vira vazio
    const tel     = String(row[2] || '').trim().replace(/[^\d]/g, '')
    const status  = String(row[3] || '').trim()
    const corretor= String(row[4] || '').trim()
    const origem  = String(row[5] || '').trim() || 'SITE'

    if (!tel) { skipCount++; continue }

    // Decisao etapa + tag conforme status
    let stageName, tag
    if (/loja\s+autorizada/i.test(status)) {
      stageName = 'Atendimento'
      tag = 'Loja Autorizada'
    } else {
      stageName = status || 'Novo Lead' // se vazio, joga em Novo Lead
      tag = 'Revendedor'
    }

    const payload = {
      nome: nome,
      telefone: tel,
      email: email,
      source: origem,
      corretor: corretor,
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
