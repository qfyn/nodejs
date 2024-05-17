const fs = require('fs')

// 读取word文档并保存为html=
const mammoth = require('mammoth')
const url = 'H:/资料/云侧开发/2024/国网安徽/新技术及应用-2023年电力北斗系统服务能力提升-设计开发实施项目-概要设计V0.1-合稿(1).docx'
// 读取Word文档并保存为html
mammoth.convertToHtml({ path: url }).then(res => {
  fs.writeFileSync('./html/sheji.html', res.value);
})


// 删除img标签
const file = fs.readFileSync('./html/sheji.html')
const filteString = file.toString().replace(/<img([\s\S]*?) \/>/g, '')
fs.writeFileSync('./html/filteString.html', filteString);

// const outputfile = fs.readFileSync('./output.html')
// const tableHtml = fs.readFileSync('./table.html')

// const file = fs.readFileSync('./filteString.html')
// const title = file.toString().match(/(?<=(<h4>&lt;))(.*?)(?=(&gt;功能点清单<\/h4>))/g)
// // for (let i = 0; i < title.length; i++) {
// //   fs.rmSync(`./result/${title[i]}.html`);
// // }
// const tableString = file.toString().match(/<table>([\s\S]*?)<\/table>/g)
// for (let i = 0; i < tableString.length; i++) {
//   const table = tableString[i];
//   let tableBody = ''

//   // 删除标题
//   if(table.match(/<thead>([\s\S]*?)<\/thead>/g)?.[0]) {
//     tableBody = table.replace(/<thead>([\s\S]*?)<\/thead>/, '')
//   } else {
//     tableBody = table.replace(/<tr>([\s\S]*?)<\/tr>/, '')
//   }

//   // 修改内容
//   const tableString1 = tableBody.toString().match(/(?<=(<table>))([\s\S]*?)(?=(<\/table>))/g)
//   const trs = tableString1[0].replace(/<tr>([\s\S]*?)<\/tr>/g, $1 => {
//     let tds = $1.match(/<td>([\s\S]*?)<\/td>/g)
//     tds[6] = modifyTd(outputfile, tds[6])
//     tds[7] = modifyTd(outputfile, tds[7])
//     $1 = `<tr>\r\n    ${tds[1]}\r\n    ${tds[5]}\r\n    ${tds[6]}\r\n    ${tds[7]}    \r\n<\/tr>`
//     $1 = $1.replace(/<td>([\s\S]*?)<\/td>/g, tds$1 => {
//       const tdsMatch = tds$1.match(/(?<=(<td>))([\s\S]*?)(?=(<\/td>))/g)[0]
//       tds$1 = `<td style="padding: 0 5px;
//       text-align:justify;
//       text-justify:inter-ideograph;
//       font-size: 14px; 
//       border: 1px solid #000;
//       border-collapse: collapse;">\r\n      ${tdsMatch}\r\n    </td>`
//       // console.log(tds$1);
//       return tds$1
//     })
//     // console.log($1);
//     return $1
//   })

//   // 保存为html
//   const tableFile = tableHtml.toString().replace(/<tbody>([\s\S]*?)<\/tbody>/g, $1 => {
//     return `<tbody>\r\n    ${trs}    \r\n<\/tbody>`
//   })

//   const wordTableHtml = fs.readFileSync('./wordTable.html')
//   const tableWordFile = wordTableHtml.toString().replace(/<body>([\s\S]*?)<\/body>/g, tableWord$1 => {
//     const tableWordMatch = tableWord$1.match(/(?<=(<body>))([\s\S]*?)(?=(<\/body>))/g)[0]
//     const tableData = `<div style="font-size: 14px;font-family: fangsong;text-align: center;">表14-${i+1}w=${title[i]}j=组件分项说明</div>    \r\n` + tableFile + '<br>'
//     return `<body>${tableWordMatch}    \r\n    ${tableData}    \r\n<\/body>`
//   })
//   fs.writeFileSync(`./wordTable.html`, `${tableWordFile}`);
//   // fs.writeFileSync(`./result/${title[i]}.html`, `${tableWordFile}`);
// }


// // 找到原始文件中td对应的中文
// function modifyTd(outputfile, data) {
//   const inputCodes = data.match(/(?<=(<p>))([\s\S]*?)(?=(<\/p>))/g)?.[0]
//   if(!inputCodes) {
//     return `<td>\r\n      <p>无</p>\r\n    </td>`
//   }
//   const splitChar1 = /\//g
//   const splitChar2 = /、/g
//   let codes = []
//   if(splitChar1.test(inputCodes)) {
//     codes = inputCodes.split('/')
//   } else if(splitChar2.test(inputCodes)) {
//     codes = inputCodes.split('、')
//   } else {
//     codes = [inputCodes]
//   }
//   const name = []
//   codes.forEach(code => {
//     const outputfileReg = new RegExp(`(?<=(<h4>${code.trim()}))(.*?)(?=(<\/h4>))`, 'g')
//     const codeName = outputfile.toString().match(outputfileReg)?.[0]
//     if(codeName) {
//       name.push(codeName.trim())
//     } else {
//       name.push(code.trim())
//     }
//   })
//   return `<td>\r\n      <p>${name.join('、')}</p>\r\n    </td>`
// }

