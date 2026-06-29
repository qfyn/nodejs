const { PdfReader } = require('pdfreader');
const fs = require('fs').promises
const path = require('path')
const { extractSupervisorMeetingInfo } = require('./extract');
const inputDis = 'data1'
const outputDis = 'result1'

const industryInfo = require('./IndustryInfo');
const industryCode = require('./IndustryCode');
const componeyList = require('./szse_stock.js');

const orgIdList = {}
for (const element of componeyList) {
  if(element.category !== 'B股') {
    orgIdList[element.code] = element.orgId
  }
}


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


async function listFiles() {
  try {
    for (let index = 0; index < errorPathList.length; index++) {
      const filePath = errorPathList[index];
      console.log('errorPathList', index, errorPathListLength);
      const [code, name, filename, time] = filePath.split('_')
      const [year] = time.split('-')
      if(!industryCode[code]) {
        continue
      }
      const respath = `${inputDis}/${code}_${orgIdList[code]}_${name}/${filePath}`
        
        
        await extractPDFText(`./${respath}`)
        .then(text => {
          const attendance = extractSupervisorMeetingInfo(text);
          if (attendance?.success) {
            if(industryInfo[`${code}_${year}`]) {
              
              const { sn2, sn1, name } = industryInfo[`${code}_${year}`]
              successRes.push(`${filePath}_${attendance.expectedCount}_${attendance.actualCount}_${attendance.attendanceRate}_${sn1}_${sn2}_${name}`)
            } else {
              successRes.push(`${filePath}_${attendance.expectedCount}_${attendance.actualCount}_${attendance.attendanceRate}_${'null'}_${'null'}_${'null'}`)
            }
          } else {
            errorRes.push(`${filePath}`)
          }
        })
        .catch(console.error);
    }
  } catch (err) {
    console.error('读取失败:', err)
    return []
  }
}

const successRes = []
const errorRes = []

// // 第一步
// const errorPath = require('./result/errorRes.js');
// const error1Path = require('./result/errorRes1.js');
// const error2Path = require('./result/errorRes2.js');
// const error3Path = require('./result/errorRes3.js');
// const error4Path = require('./result/errorRes4.js');
// const error5Path = require('./result/errorRes5.js');
// const error6Path = require('./result/errorRes6.js');
// const error7Path = require('./result/errorRes7.js');

// const errorPathList = [
//   ...errorPath,
//   ...error1Path,
//   ...error2Path,
//   ...error3Path,
//   ...error4Path,
//   ...error5Path,
//   ...error6Path,
//   ...error7Path
// ]
// const errorPathListLength = errorPathList.length
// async function getData() {
//   await listFiles()
//   await fs.writeFile(`./result/successRes8.js`, `const a = ${JSON.stringify(successRes, null, 2)}\nmodule.exports = a`)
//   await fs.writeFile(`./result/errorRes8.js`, `const a = ${JSON.stringify(errorRes, null, 2)}\nmodule.exports = a`)
// }
// getData()

// 第二步
const errorPathList = require(`./${outputDis}/errorRes.js`);
const errorPathListLength = errorPathList.length
async function getData() {
  await listFiles()
  await fs.writeFile(`./${outputDis}/successRes1.js`, `const a = ${JSON.stringify(successRes, null, 2)}\nmodule.exports = a`)
  await fs.writeFile(`./${outputDis}/errorRes1.js`, `const a = ${JSON.stringify(errorRes, null, 2)}\nmodule.exports = a`)
}
getData()