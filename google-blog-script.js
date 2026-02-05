/**
 * Google Apps Script para o Blog da IAGRAM
 *
 * INSTRUÇÕES:
 * 1. Crie uma planilha com os cabeçalhos: titulo, categoria, data, resumo, conteudo, publicado
 * 2. Cole este código em Extensões > Apps Script
 * 3. Implante como Web App (Qualquer pessoa pode acessar)
 * 4. Copie a URL e cole no arquivo script.js do site
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var posts = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var post = {};

    for (var j = 0; j < headers.length; j++) {
      post[headers[j]] = row[j];
    }

    // Só adiciona posts publicados
    if (post.publicado && post.publicado.toString().toLowerCase() === 'sim') {
      posts.push(post);
    }
  }

  // Ordena por data (mais recente primeiro)
  posts.sort(function(a, b) {
    return new Date(b.data) - new Date(a.data);
  });

  return ContentService
    .createTextOutput(JSON.stringify(posts))
    .setMimeType(ContentService.MimeType.JSON);
}
