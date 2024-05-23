const fs = require('fs');
const path = require('path');
const modifyTemplateFile = require('./singleTemplateFile');
// 读取文件夹内容
const root = path.resolve(__dirname + '/views/')

fs.rmSync(__dirname + '/result', { recursive: true, force: true });
fs.rmSync(__dirname + '/lang', { recursive: true, force: true });
fs.rmSync(__dirname + '/lang-zh', { recursive: true, force: true });
fs.mkdirSync(__dirname + '/result', { recursive: true });
fs.mkdirSync(__dirname + '/lang', { recursive: true });
fs.mkdirSync(__dirname + '/lang-zh', { recursive: true });


const fileNameMapTwo = new Map()
const fileNameMap = new Map()
function getVueFile(url) {
  fs.readdir(url, {recursive: true}, (err, files) => {
    files.forEach(async file => {
      const currentUrl = path.resolve(url + `/${file}`);
      const fsStat = fs.statSync(currentUrl);
      if (fsStat.isDirectory()) {
        fs.mkdirSync(__dirname + `/result/${currentUrl.slice(root.length + 1)}`, { recursive: true });
        getVueFile(currentUrl);
        return;
      } else {
        let fileName = 'promptInfo';
        const currentFileDir = url.slice(root.length + 1)

        const {vue, chineseDir} = modifyTemplateFile(currentUrl, fileName);
        fs.mkdirSync(__dirname + `/result/${currentFileDir}`, { recursive: true });
        fs.writeFileSync(path.resolve(__dirname + `/result/${currentFileDir}/${file}`), vue, 'utf-8');
        if(fileNameMapTwo.has(fileName)) {
          fileNameMapTwo.get(fileName).push(...chineseDir)
        } else {
          fileNameMapTwo.set(fileName, [])
          fileNameMap.set(fileName, [...chineseDir])
          fs.writeFileSync(path.resolve(__dirname + `/lang/${fileName}.js`), `const ${fileName} = {${chineseDir}}\r\nmodule.exports = ${fileName}`, 'utf-8');
          fs.writeFileSync(path.resolve(__dirname + `/lang-zh/${fileName}.js`), `export default {${chineseDir}}`, 'utf-8');
        }
      }
    })
  })
}
getVueFile(root)
// fs.rm('./views/result', { recursive: true, force: true }, (err) => {
//   if (err) throw err;
// })


// 处理重复的文件
setTimeout(async () => {
  const keys = [...fileNameMapTwo.keys()]
  keys.forEach(async (fileName) => {
    let dirData = fileNameMapTwo.get(fileName)
    if(dirData.length > 0) {
      const firstDir = fileNameMap.get(fileName)
      dirData = Array.from(new Set([...firstDir, ...dirData]))

      fs.writeFileSync(path.resolve(__dirname + `/lang/${fileName}.js`), `const ${fileName} = {${dirData}}\r\nmodule.exports = ${fileName}`, 'utf-8');
      fs.writeFileSync(path.resolve(__dirname + `/lang-zh/${fileName}.js`), `export default {${dirData}}`, 'utf-8');
    }
  })
}, 2000)
