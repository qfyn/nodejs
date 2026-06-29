const { PdfReader } = require('pdfreader');
const fs = require('fs').promises
const path = require('path')
const { extractSupervisorMeetingInfo } = require('./extract');
const errorPath = require('./result/errorRes1.js');

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
    for (const filePath of errorPath) {
      const fileName = filePath.split('.')[0]
      const fileSplit = filePath.split('_')
      const time = fileName.split('_')[3]
      const respath = `./data/${time}/${fileSplit[0]}_${fileSplit[1]}_${fileSplit[2]}_${fileSplit[3]}`
        console.log('respath', respath);
        
        await extractPDFText(`./${respath}`)
        .then(text => {
          const attendance = extractSupervisorMeetingInfo(text);
          if (attendance?.success) {
            successRes.push(`${filePath}_${attendance.expectedCount}_${attendance.actualCount}`)
          } else {
            if(attendance?.isOnline) {
              errorRes.push(`${filePath}`)
            } else {
              errorRes.push(`${filePath}`)
            }
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
const restartRes = []
async function getData() {
  await listFiles()
  await fs.writeFile(`./result/successRes2.js`, `const a = ${JSON.stringify(successRes, null, 2)}\nmodule.exports = a`)
  await fs.writeFile(`./result/errorRes2.js`, `const a = ${JSON.stringify(errorRes, null, 2)}\nmodule.exports = a`)
  await fs.writeFile(`./result/restartRes.js`, `const a = ${JSON.stringify(restartRes, null, 2)}\nmodule.exports = a`)
  // console.log('successRes', successRes);
  // console.log('errorRes', errorRes);
}
getData()


// 使用示例
// const successRes = []
// const errorRes = []
// const filename = '000048_京基智农_第九届监事会2020年第三次临时会议决议公告_2020-10-31'
// extractPDFText('./data/2020-10-31/000048_京基智农_第九届监事会2020年第三次临时会议决议公告_2020-10-31.pdf')
//   .then(text => {
//     console.log('PDF内容:', text);
//     const attendance = extractSupervisorAttendanceFinal(text);
//      if (attendance) {
//       successRes.push(`${filename}_${attendance.expected}_${attendance.actual}`)
//     } else {
//       errorRes.push(`${filename}_${attendance.expected}_${attendance.actual}`)
//     }
//     console.log('successRes', successRes);
//     console.log('errorRes', errorRes);
//   })
//   .catch(console.error);