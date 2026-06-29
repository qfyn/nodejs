const { PdfReader } = require('pdfreader');
const fs = require('fs').promises
const path = require('path')
const { extractSupervisorMeetingInfo } = require('./extract');
const industryInfo = require('./IndustryInfo');
const industryCode = require('./IndustryCode');
const inputDis = 'data1'
const outputDis = 'result1'


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

        const [code, componeyName, filename, time] = file.split('_')
        const [year] = time.split('-')
        if(!industryCode[code]) {
          continue
        }

        const respath = fullPath.replace(/\\/g, '/')
        
        await extractPDFText(`./${respath}`)
        .then(async text => {
          // console.log('PDF内容:', text);
          const attendance = extractSupervisorMeetingInfo(text);
          if (attendance?.success) {
            if(industryInfo[`${code}_${year}`]) {
              
              const { sn2, sn1, name } = industryInfo[`${code}_${year}`]
              successRes.push(`${file}_${attendance.expectedCount}_${attendance.actualCount}_${attendance.attendanceRate}_${sn1}_${sn2}_${name}_${files.length}`)
            } else {
              successRes.push(`${file}_${attendance.expectedCount}_${attendance.actualCount}_${attendance.attendanceRate}_${'null'}_${'null'}_${'null'}_${files.length}`)
            }
          } else {
            errorRes.push(`${file}`)
          }
          if(successRes.length > 10000) {
            await fs.writeFile(`./${outputDis}/successRes${times}.js`, `const a = ${JSON.stringify(successRes, null, 2)}\nmodule.exports = a`)
            await fs.writeFile(`./${outputDis}/errorRes${times}.js`, `const a = ${JSON.stringify(errorRes, null, 2)}\nmodule.exports = a`)
            successRes = []
            errorRes = []
            times += 1
          }
        })
        .catch(console.error);
      }
    }
  } catch (err) {
    console.error('读取失败:', err)
    return []
  }
}

let successRes = []
let errorRes = []
let times = 1
async function getData() {
  await listFiles(`./${inputDis}`)
  await fs.writeFile(`./${outputDis}/successRes.js`, `const a = ${JSON.stringify(successRes, null, 2)}\nmodule.exports = a`)
  await fs.writeFile(`./${outputDis}/errorRes.js`, `const a = ${JSON.stringify(errorRes, null, 2)}\nmodule.exports = a`)
}
getData()
