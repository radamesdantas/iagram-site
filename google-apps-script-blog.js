/**
 * Google Apps Script para o BLOG da IAGRAM
 *
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 *
 * 1. Na planilha "IAGRAM - Blog", crie uma aba chamada "Posts"
 * 2. Na primeira linha, adicione os cabeçalhos EXATAMENTE assim:
 *    A1: titulo | B1: categoria | C1: data | D1: resumo | E1: conteudo | F1: publicado | G1: imagem
 *
 * 3. A partir da linha 2, adicione os posts:
 *    - titulo: Título do artigo
 *    - categoria: Ex: "Eventos", "Startups", "Capacitação", "Tecnologia", "Agronegócio"
 *    - data: Data no formato DD/MM/AAAA
 *    - resumo: Texto curto (2-3 frases) para aparecer no card
 *    - conteudo: Texto completo do artigo (pode usar quebras de linha)
 *    - publicado: "sim" ou "não" (apenas os "sim" aparecem no site)
 *    - imagem: URL pública da imagem (Google Drive, Imgur, etc.) - opcional
 *
 * 4. Vá em Extensões > Apps Script
 * 5. Apague todo o código existente e cole este código
 * 6. Clique em "Implantar" > "Nova implantação"
 * 7. Selecione tipo: "App da Web"
 * 8. Configure:
 *    - Executar como: "Eu"
 *    - Quem pode acessar: "Qualquer pessoa"
 * 9. Clique em "Implantar" e autorize
 * 10. Copie a URL e cole no blog.html (variável BLOG_API_URL)
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Posts');

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Aba "Posts" não encontrada' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const posts = [];

    // Encontrar índices das colunas
    const tituloIdx = headers.indexOf('titulo');
    const categoriaIdx = headers.indexOf('categoria');
    const dataIdx = headers.indexOf('data');
    const resumoIdx = headers.indexOf('resumo');
    const conteudoIdx = headers.indexOf('conteudo');
    const publicadoIdx = headers.indexOf('publicado');
    const imagemIdx = headers.indexOf('imagem');

    // Processar cada linha (exceto cabeçalho)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Verificar se está publicado
      const publicado = publicadoIdx >= 0 ? row[publicadoIdx] : 'sim';
      if (publicado && publicado.toString().toLowerCase() !== 'sim') {
        continue;
      }

      // Verificar se tem título (linha não vazia)
      if (!row[tituloIdx]) {
        continue;
      }

      posts.push({
        titulo: row[tituloIdx] || '',
        categoria: row[categoriaIdx] || 'Geral',
        data: formatDate(row[dataIdx]),
        resumo: row[resumoIdx] || '',
        conteudo: row[conteudoIdx] || '',
        imagem: imagemIdx >= 0 ? (row[imagemIdx] || '') : ''
      });
    }

    // Ordenar por data (mais recente primeiro)
    posts.sort((a, b) => new Date(b.data) - new Date(a.data));

    return ContentService
      .createTextOutput(JSON.stringify(posts))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatDate(date) {
  if (!date) return '';
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date.toString();
}

// Função de teste
function testGetPosts() {
  const result = doGet();
  Logger.log(result.getContent());
}
