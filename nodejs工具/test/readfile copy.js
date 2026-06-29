const fs = require('fs').promises
const path = require('path')
const dirArr = [
  {
    name: 'SafetyNet1',
    reg: /^(H:\/资料\/云侧开发\/2025四组学习文档\/铁路矢量数据\/SafetyNet1)/
  },
  {
    name: 'Railway',
    reg: /^(H:\/资料\/云侧开发\/2025四组学习文档\/铁路矢量数据\/Railway)/
  },
  {
    name: 'KilometerPost10',
    reg: /^(H:\/资料\/云侧开发\/2025四组学习文档\/铁路矢量数据\/KilometerPost10)/
  }
]
let zlevelMap = {}
async function listFilesRecursive(dirPath, name, reg) {
  try {
    const files = await fs.readdir(dirPath)
    for (const file of files) {
      const fullPath = path.join(dirPath, file)
      
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        // 如果是目录，递归读取
         await listFilesRecursive(fullPath)
      } else {
        // 如果是文件，添加到结果
        const respath = fullPath.replace(/\\/g, '/')
        const httpUrl = respath.replace(reg, 'http://10.100.30.107:40080/' + name);
        const urlMap = httpUrl.split('/')
        const zlevel = urlMap[urlMap.length - 3]
        
        if(!zlevelMap[zlevel]) {
          zlevelMap[zlevel] = []
        }
        zlevelMap[zlevel].push(httpUrl)

      }
    }
    // console.log(zlevelMap);
    // return zlevelMap
  } catch (err) {
    console.error('读取失败:', err)
    return []
  }
}

dirArr.forEach(async(item) => {
  await listFilesRecursive(`H:/资料/云侧开发/2025四组学习文档/铁路矢量数据/${item.name}`, item.name, item.reg)
})
setTimeout(() => {
  fs.writeFile(`./cesiumFile.js`, `const a = ${JSON.stringify(zlevelMap, null, 2)}\nmodule.exports = a`)
}, 10000)
