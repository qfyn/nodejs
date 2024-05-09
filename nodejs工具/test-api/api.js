const axios = require('axios')
const fs = require('fs')
const url = 'http://172.16.33.37:9123/mtxy-system-service/v1/resource/resource'
const token = 'd8f605c5-b19f-40da-9d6a-f31b126f301f'


// fs.readdir('./dist', 'utf8', (err, data) => {
//   data.forEach(async item => {
//     const data = require(`./dist/${item}`)
//     await postApi(data)
//   })
// })
// 按照改顺序添加
const fileOrder = [
  'generalView.js', 
  'stationRunningMonitor.js',
  'stationCoordinateOffsetMonitor.js',
  'stationDataQualityMonitor.js',
  'receiverMonitor.js',
  'netformMonitor.js',
  'broadcastMonitor.js',
  'userMonitor.js',
  'applicationMonitor.js',
  'monitor.js',
  'alarm.js',
  'system.js',
 ]

async function func () {
  for(let i = 0; i < fileOrder.length; i++) {
    const routeUrl = fileOrder[i];
    const data = require(`./dist/${routeUrl}`)
    await postApi(data)
  }
}
func()
//  fileOrder.forEach(async item => {
//   const data = require(`./dist/${item}`)
//   await postApi(data)
// })

function postApi(fileData) {
  return new Promise((resolve, reject) => {
    const params = {
      "icon": "",
      "microAppId": "1781142030470021122",
      "parentId": "1781257617942708225",
      "resourceCode": fileData.path,
      "resourceName": fileData.name,
      "resourceOrder": 1,
      "resourceType": 1,
      "resourceUrl": fileData.path
    }
  
    axios({
      url,
      method: "post", // or 'PUT'
      headers: {
        "Cookie": 'nToken=bearer ' + token,
        "Authorization": 'bearer ' + token,
        "Access-Control-Allow-Origi": '*'
      },
      data: params,
    }).then((response) => {
      const parent_Data = response.data.data
      fileData.children.forEach(async route => {
        const routeParams = {
          "icon": "",
          "microAppId": parent_Data.microAppId,
          "parentId": parent_Data.id,
          "resourceCode": route.path,
          "resourceName": route.name,
          "resourceOrder": 1,
          "resourceType": 1,
          "resourceUrl": route.path,
          "remark": ""
        }
        await postData(routeParams)
        resolve()
      });
    }).catch((error) => {
      console.error("Error:", error);
    });
  })
}

function postData(data) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: "post", // or 'PUT'
      headers: {
        "Cookie": 'nToken=bearer ' + token,
        "Authorization": 'bearer ' + token,
        "Access-Control-Allow-Origi": '*'
      },
      data,
    }).then((response) => {
      console.log(response.msg);
      resolve()
    })
  })
}