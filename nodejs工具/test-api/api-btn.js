const axios = require('axios')
const fs = require('fs')
const url = 'http://10.100.30.107:3003/api/mtxy-system-service/v1/resource/resource'
const token = '2615e05f-a885-40bb-8ed0-13b28cbd6e3e'

const menuData = [
  {
    "id": "1959873522381623297",
    "pid": "1780882785107378178",
    "label": "图层管理",
    "dataType": "resource",
    "disabled": false
  }
]

// 按照改顺序添加
const fileOrder = {
    // 新增
    'dss-maplayer-add': '新增',
    // 批量禁用
    'dss-maplayer-batchDisable': '批量禁用',
    // 批量启用
    'dss-maplayer-batchEnable': '批量启用',
    // 批量删除
    'dss-maplayer-batchDelete': '批量删除',
    // 启用
    'dss-maplayer-enable': '启用',
    // 删除
    'dss-maplayer-delete': '删除',
}

async function func () {
  let orderIndex = 1
  for (const key in fileOrder) {
    if (Object.hasOwnProperty.call(fileOrder, key)) {
      const name = fileOrder[key];
      // const menuInfo = menuData.find(menu => menu.label === key.split('-')[1])
      // await postApi({name, key, parentId: menuInfo.id})
      await postApi({name, key, parentId: menuData[0].id}, orderIndex)
      orderIndex++
    }
  }
}
func()
function postApi(fileData, orderIndex) {
  return new Promise((resolve, reject) => {
    const params = {
      "icon": "",
      "microAppId": "1780161010132254721",
      "parentId": fileData.parentId,
      "resourceCode": fileData.key,
      "resourceName": fileData.name,
      "resourceOrder": orderIndex,
      "resourceType": 3,
      "resourceUrl": fileData.key
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
      console.log('resolve:', response.msg);
      resolve()
    }).catch((error) => {
      console.error("Error:", error);
    });
  })
}
