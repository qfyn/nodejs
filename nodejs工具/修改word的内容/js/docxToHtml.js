// 读取word文档并保存为html
const path = require('path')
const fs = require('fs')
const mammoth = require('mammoth')

function docxToHtml(url, outFile) {
  // 读取Word文档并保存为html
  mammoth.convertToHtml({ path: url }).then(res => {
    fs.writeFileSync(path.resolve(__dirname + `/html/${outFile}.html`), res.value);
  })
}

module.exports = docxToHtml