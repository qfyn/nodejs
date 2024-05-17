const translate = require('./translate')
const fs = require('fs')
const path = require('path')

fs.rmSync(__dirname + '/result', { recursive: true, force: true });
fs.mkdirSync(__dirname + '/result', { recursive: true });

// 中文翻译为英文
async function extractEn(queryField) {
  const text = await translate(queryField)
  console.log(text);
}
// extractEn('你好，世界！')

fs.readdir(path.resolve(__dirname + '/../lang/'), async (err, files) => {
  for(let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = file.split('.')[0]
    const fileData = await require(`../lang/${file}`)
    const enNameObj = {}
    for (const key in fileData) {
      if (Object.hasOwnProperty.call(fileData, key)) {
        const chineseName = fileData[key];
        const enName = await translate(chineseName)
        enNameObj[key] = enName
      }
    }
    // console.log(enNameObj);
    fs.writeFileSync(path.resolve(__dirname + `/result/${fileName}.js`), `export default ${JSON.stringify(enNameObj)}`)
  }
})


// // 创建index.js文件，导入该文件夹下所有文件
// const files = fs.readdirSync(path.resolve(__dirname + '/result/'));
// let importStr = ''
// let exportsObj = ''
// files.forEach((file) => {
//   const fileName = file.split('.')[0]
//   importStr += `import ${fileName} from './${file}';\n`
//   exportsObj += fileName + ',\n'
// })
// const content = `${importStr}\r\n export default {\n${exportsObj}}`
// fs.writeFileSync(path.resolve(__dirname + `/result/index.js`), content)
