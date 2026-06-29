

const fs = require('fs').promises

const sheet1 = require('./json/Sheet1.js');
const sheet2 = require('./json/Sheet2.js');
const sheet3 = require('./json/Sheet3.js');

function handleSheetData(sheet, mergeObj = {}) {
  const datas = sheet.slice(1)
  for (const data1 of datas) {
    const { Symbol, Enddate } = data1
    const symbolObj = mergeObj[Symbol] || {}
    let enddateObj = symbolObj[Enddate] || {
      "Symbol": "",
      "ShortName": "",
      "Enddate": "",
      "PropertyRightsNature": "",
      "ConcurrentPosition": "",
      "Mngmhldn": "",
      "Boardsize": "",
      "IndDirectorRatio": "",
      "Total_3": "",

      "Conme": "",
      "Shrcr1": "",
      "__EMPTY": "",

      "TotalHoldShares": "",
      "InsInvestorProp": "",
    }
    enddateObj = {...enddateObj, ...data1}
    symbolObj[Enddate] = enddateObj
    mergeObj[Symbol] = symbolObj
  }
  return mergeObj
}
const merge1 = handleSheetData(sheet1)

const merge2 = handleSheetData(sheet2, merge1)

const merge3 = handleSheetData(sheet3, merge2)



console.log('merge3', Object.keys(merge3).length)
// console.log('merge3', Object.keys(merge3['000002']['2020-12-31']))
// sheet的键的对应值
const name = {
  "Symbol": "证券代码",
  "ShortName": "证券简称",
  "Enddate": "统计截止日期",
  "PropertyRightsNature": "产权性质",
  "ConcurrentPosition": "两职合一",
  "Mngmhldn": "管理层持股比例",
  "Boardsize": "董事会规模",
  "IndDirectorRatio": "独立董事占比",
  "Total_3": "高管前三名薪酬总额",

  "Conme": "公司全称",
  "Shrcr1": "第一大股东持股比例",
  "__EMPTY": "股权制衡度",

  "TotalHoldShares": "机构投资者持股数量",
  "InsInvestorProp": "机构投资者持股比例(相对总股本)",
}
const array = [Object.values(name).join()]
for (const key in merge3) {
  const element = merge3[key];
  const length = Object.keys(element).length
  if(length < 5) {
    delete merge3[key]
    continue
  }
  for (const elementKey in element) {
    const data = element[elementKey];
    array.push(Object.values(data).join())
  }
}
console.log('merge3_1', Object.keys(merge3).length)
console.log('array', array.length)
fs.writeFile(`./merge/merge.js`, `const a = ${JSON.stringify(array, null, 2)}\nmodule.exports = a`)