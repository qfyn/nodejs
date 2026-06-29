const fs = require('fs').promises
const path = require('path')

const dirArr = ['SafetyNet1','Railway','KilometerPost10']

const result = {}
async function listFilesRecursive(dirPath) {
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
        const httpUrl = respath.replace(/^(H:\/资料\/云侧开发\/2025四组学习文档\/铁路矢量数据)/, 'http://10.100.30.107:40080');
        const urlMap = httpUrl.split('/')
        const zlevel = urlMap[urlMap.length - 3]
        if(!result[zlevel]) {
          result[zlevel] = []
        }
        result[zlevel].push(httpUrl)
      }
    }
  } catch (err) {
    console.error('读取失败:', err)
    return []
  }
}

dirArr.forEach((name) => {
  listFilesRecursive('H:/资料/云侧开发/2025四组学习文档/铁路矢量数据/' + name, name)
})

setTimeout(() => {
  fs.writeFile(`./cesiumFile.ts`, `export const cesiumData = ${JSON.stringify(result, null, 2)}`)
}, 10000)