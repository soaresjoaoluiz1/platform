// Google Apps Script — cole em Extensões > Apps Script na planilha SAMECO
// Converte cores de fundo das linhas em texto na coluna "QUALIFICAÇÃO" (coluna Y)
//
// Cores:
//   Vermelho = DESQUALIFICADO
//   Azul     = QUALIFICADO
//   Amarelo  = EM ATENDIMENTO
//   Verde    = VENDIDO
//   Sem cor  = (vazio)

function colorParaStatus() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('LEADS');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Aba "LEADS" não encontrada!');
    return;
  }

  var lastRow = sheet.getLastRow();

  // Escrever header na coluna Y (coluna 25)
  sheet.getRange(1, 25).setValue('QUALIFICAÇÃO');

  // Ler cores de fundo da coluna A (todas as linhas de uma vez pra performance)
  var backgrounds = sheet.getRange(2, 1, lastRow - 1, 1).getBackgrounds();
  var statuses = [];

  for (var i = 0; i < backgrounds.length; i++) {
    var color = backgrounds[i][0].toLowerCase();
    var status = '';

    // Vermelho (vários tons)
    if (color === '#ff0000' || color === '#cc0000' || color === '#e06666' ||
        color === '#ea9999' || color === '#f4cccc' || color === '#ff9999' ||
        color === '#cc4125' || color === '#dd7e6b' || color === '#e6b8af') {
      status = 'DESQUALIFICADO';
    }
    // Azul (vários tons)
    else if (color === '#0000ff' || color === '#3c78d8' || color === '#6fa8dc' ||
             color === '#9fc5e8' || color === '#cfe2f3' || color === '#4a86e8' ||
             color === '#6d9eeb' || color === '#a4c2f4' || color === '#c9daf8' ||
             color === '#3d85c6' || color === '#2986cc' || color === '#0b5394' ||
             color === '#1155cc' || color === '#1c4587' || color === '#073763') {
      status = 'QUALIFICADO';
    }
    // Amarelo (vários tons)
    else if (color === '#ffff00' || color === '#f1c232' || color === '#ffd966' ||
             color === '#ffe599' || color === '#fff2cc' || color === '#ff9900' ||
             color === '#e69138' || color === '#f6b26b' || color === '#f9cb9c' ||
             color === '#fce5cd' || color === '#bf9000' || color === '#b45f06') {
      status = 'EM ATENDIMENTO';
    }
    // Verde (vários tons)
    else if (color === '#00ff00' || color === '#6aa84f' || color === '#93c47d' ||
             color === '#b6d7a8' || color === '#d9ead3' || color === '#38761d' ||
             color === '#274e13' || color === '#0b8043' || color === '#00c853' ||
             color === '#34a853' || color === '#a8d08d') {
      status = 'VENDIDO';
    }

    statuses.push([status]);
  }

  // Escrever todos os status de uma vez (performance)
  sheet.getRange(2, 25, statuses.length, 1).setValues(statuses);

  SpreadsheetApp.getUi().alert('Pronto! ' + statuses.filter(function(s) { return s[0] !== ''; }).length + ' leads classificados na coluna Y.');
}
