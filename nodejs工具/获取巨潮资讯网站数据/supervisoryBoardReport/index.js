const axios = require('axios')
const fs = require('fs')
const url = 'https://www.cninfo.com.cn/new/hisAnnouncement/query'
const componeyList = require('./szse_stock.js');

async function getReportData(pageNum, code, orgId,category, saveObj = {}) {
  return new Promise(async(resolve, reject) => {
    const params = {
      pageNum: pageNum,
      pageSize: 30,
      column: 'szse',
      tabName: 'fulltext',
      plate: '',
      // stock: '300030,9900009147',
      stock: `${code},${orgId}`,
      searchkey: '',
      secid: '',
      category,
      trade: '农、林、牧、渔业;交通运输、仓储和邮政业;科学研究和技术服务业;教育;综合;卫生和社会工作;房地产业;住宿和餐饮业;建筑业;采矿业;制造业;批发和零售业;信息传输、软件和信息技术服务业;租赁和商务服务业;居民服务、修理和其他服务业;文化、体育和娱乐业',
      seDate: `2020-01-01~2026-01-01`,
      sortName: 'time',
      sortType: 'desc',
      isHLtitle: true
    }
  
    await axios({
      url,
      method: "post", // or 'PUT'
      headers: {
        "accept": '*/*',
        "accept-encoding": 'gzip, deflate, br, zstd',
        "accept-language": 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        "cache-control": 'no-cache',
        "connection": 'keep-alive',
        "pragma": "no-cache",
        "Access-Control-Allow-Origi": '*',
        "content-type": 'application/x-www-form-urlencoded;charset=UTF-8',
        "host": 'www.cninfo.com.cn',
        "origin": 'https://www.cninfo.com.cn',
        "referer": 'https://www.cninfo.com.cn/new/commonUrl/pageOfSearch?url=disclosure/list/search'
      },
      data: params,
    }).then(async (response) => {
      
      const { announcements = [], totalpages } = response.data || {}
      for (const data of (announcements || [])) {
        
        const { announcementId, adjunctUrl, announcementTitle, secCode, secName, announcementTime, orgId } = data
        
          if(
            (announcementTitle.indexOf('会议决议公告') > -1 || announcementTitle.indexOf('会议决议的公告') > -1) && 
            secName.indexOf('ST') === -1
          ) {
          if(saveObj[announcementId]) {
            continue;
          }
          saveObj[announcementId] = announcementId
          // 下载
          await postData(adjunctUrl, announcementTitle, `${code}_${orgId}_${secName}`, secCode, secName, announcementTime)
        }
      };
      if(totalpages > pageNum && pageNum <= 100) {
       saveObj = await getReportData(pageNum + 1, code, orgId, category, saveObj)
      }
      resolve(saveObj);
    }).catch((error) => {
      console.error("Error:", error);
    });
  })
}


// 下载pdf
function postData(url, filename, folder, secCode, secName, announcementTime) {
  const time = url.split('/')[1]
  return new Promise((resolve, reject) => {
    axios({
      url: `https://static.cninfo.com.cn/${url}`,
      method: "get", // or 'PUT'
      responseType: 'arraybuffer',
      headers: {
        'content-type': 'application/pdf',
        'islatest': true,
        'Accept': 'application/pdf',
        // "Cookie": 'nToken=bearer ' + token,
        // "Authorization": 'bearer ' + token,
        "Access-Control-Allow-Origi": '*',
        // 'responseType': 'arraybuffer'
      },
    }).then((response) => {
      if (!fs.existsSync(`./data1/${folder}`)) {
        fs.mkdirSync(`./data1/${folder}`, { recursive: true });
      }
      fs.writeFile(
        `./data1/${folder}/${secCode}_${secName}_${filename}_${parseTime(announcementTime, '{y}-{m}-{d}')}.pdf`, 
        Buffer.from(response.data), 
        (err) => {
          console.log(err);
        }
      )
      resolve()
    })
  })
}

function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^\d+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
}

// 第一步
// 下载监事会报告
const companyLevelData = require('../mergeAllData/json1/整体数据/可改-2026-02-10-03.js');
async function LoadReportData() {
  const category = 'category_jshgg_szsh'
  const reportData = {}

  const codeArr = {}
  companyLevelData.filter(item => item.会出勤率 === "").forEach(item => {
    codeArr[item.证券代码] = item.证券代码
  })
  // fs.writeFile(
  //   `./codeArr.js`, 
  //   `const a = ${JSON.stringify(codeArr, null, 2)}\nmodule.exports = a`, 
  //   (err) => {
  //     console.log(err);
  //   }
  // )

  for (let index = 1; index < componeyList.length; index++) {
    const componey = componeyList[index];
    console.log('componey', index);
    const {code, orgId} = componey
    if(codeArr[code]) {
      await getReportData(1, code, orgId, category, reportData)
    }
  }
}
LoadReportData()