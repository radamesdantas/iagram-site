/**
 * Google Apps Script para receber dados do formulário do site IAGRAM
 *
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 *
 * 1. Acesse https://sheets.google.com e crie uma nova planilha
 * 2. Renomeie a planilha para "IAGRAM - Contatos" (ou outro nome)
 * 3. Na primeira linha, adicione os cabeçalhos:
 *    A1: Data/Hora | B1: Nome | C1: E-mail | D1: Telefone | E1: Assunto | F1: Mensagem
 *
 * 4. Vá em Extensões > Apps Script
 * 5. Apague todo o código existente e cole este código
 * 6. Clique em "Implantar" > "Nova implantação"
 * 7. Selecione tipo: "App da Web"
 * 8. Configure:
 *    - Descrição: "IAGRAM Form Handler"
 *    - Executar como: "Eu"
 *    - Quem pode acessar: "Qualquer pessoa"
 * 9. Clique em "Implantar" e autorize o acesso
 * 10. Copie a URL do Web App e cole no arquivo script.js do site
 */

// Configuração - ID da planilha (extraia da URL da planilha)
// URL exemplo: https://docs.google.com/spreadsheets/d/ESTE_E_O_ID/edit
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_NAME = 'Página1'; // ou 'Sheet1' se estiver em inglês

function doPost(e) {
  try {
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);

    // Abre a planilha
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    // Adiciona nova linha com os dados
    sheet.appendRow([
      data.data || new Date().toLocaleString('pt-BR'),
      data.nome,
      data.email,
      data.telefone,
      data.assunto,
      data.mensagem
    ]);

    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Dados salvos com sucesso!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Retorna erro
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'IAGRAM Form Handler está funcionando!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Função de teste - execute manualmente para verificar se está funcionando
function testAppendRow() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  sheet.appendRow([
    new Date().toLocaleString('pt-BR'),
    'Teste Nome',
    'teste@email.com',
    '(84) 99999-9999',
    'Teste',
    'Esta é uma mensagem de teste'
  ]);

  Logger.log('Linha de teste adicionada com sucesso!');
}
