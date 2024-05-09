const axios = require('axios')
const fs = require('fs')
const url = 'http://172.16.36.148:32600/mtxy-system-service/v1/resource/resource'
const token = 'dc6ca927-69a8-4358-a20f-a42709cbb10f'

const menuData = [
  {
    "id": "1787687467125379073",
    "pid": "1787687395323088898",
    "label": "authorityService",
    "dataType": "resource",
    "disabled": false
  }
]

// 按照改顺序添加
const fileOrder = {
  // "manage-updateAuth-identificationCode": '生成标识码',
  // "manage-updateAuth-registration": '注册',
  "manage-authorityService-dssActivateNow": "差分服务系统-激活",
  "manage-authorityService-platformActivateNow": "运维管理系统-激活",
  "manage-authorityService-omcActivateNow": "运行监测系统-激活",
  "manage-authorityService-dssUpdate": "差分服务系统-更新授权",
  "manage-authorityService-platformUpdate": "运维管理系统-更新授权",
  "manage-authorityService-omcUpdate": "运行监测系统-更新授权",
  "manage-authorityService-modifyUser": "修改授权用户",
  "manage-authorityService-modifyEnterpriseTaxNo": "修改企业税号",
}

async function func () {
  for (const key in fileOrder) {
    if (Object.hasOwnProperty.call(fileOrder, key)) {
      const name = fileOrder[key];
      const menuInfo = menuData.find(menu => menu.label === key.split('-')[1])
      await postApi({name, key, parentId: menuInfo.id})
    }
  }
}
func()
function postApi(fileData) {
  return new Promise((resolve, reject) => {
    const params = {
      "icon": "",
      "microAppId": "1780897749964619778",
      "parentId": fileData.parentId,
      "resourceCode": fileData.key,
      "resourceName": fileData.name,
      "resourceOrder": 1,
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
      console.log(response.msg);
      resolve()
    }).catch((error) => {
      console.error("Error:", error);
    });
  })
}
