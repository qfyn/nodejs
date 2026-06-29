const { PdfReader } = require('pdfreader');
const fs = require('fs').promises
const path = require('path')
const { extractSupervisorMeetingInfo } = require('./extract');

function extractPDFText(filePath) {
  return new Promise((resolve, reject) => {
    const reader = new PdfReader();
    let text = '';
    
    reader.parseFileItems(filePath, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        // 解析完成
        resolve(text);
      } else if (item.text) {
        // 收集文本
        text += item.text + ' ';
      }
    });
  });
}


async function listFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath)
    for (const file of files) {
      const fullPath = path.join(dirPath, file)
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        // 如果是目录，递归读取
        console.log('fullPath', fullPath);
        await listFiles(fullPath)
      } else {
        // 如果是文件，添加到结果
        const respath = fullPath.replace(/\\/g, '/')
        console.log('fullPath', file);
        
        await extractPDFText(`./${respath}`)
        .then(text => {
          // console.log('PDF内容:', text);
          const attendance = extractSupervisorMeetingInfo(text);
          // if (attendance?.success) {
          //   successRes.push(`${file}_${attendance.expectedCount}_${attendance.actualCount}_${attendance.attendanceRate}`)
          // } else {
          //   if(attendance?.isOnline) {
          //     restartRes.push(`${file}`)
          //   } else {
          //     errorRes.push(`${file}`)
          //   }
          // }
        })
        .catch(console.error);
      }
    }
  } catch (err) {
    console.error('读取失败:', err)
    return []
  }
}

const successRes = []
const errorRes = []
async function getData() {
  await listFiles('./test')
  // await fs.writeFile(`./result/successRes.js`, `const a = ${JSON.stringify(successRes, null, 2)}\nmodule.exports = a`)
  // await fs.writeFile(`./result/errorRes.js`, `const a = ${JSON.stringify(errorRes, null, 2)}\nmodule.exports = a`)
  // await fs.writeFile(`./result/restartRes.js`, `const a = ${JSON.stringify(restartRes, null, 2)}\nmodule.exports = a`)

}
getData()
