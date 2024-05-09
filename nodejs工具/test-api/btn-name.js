const fs = require('fs');
const opr = {
  Operation: '操作',
  View: '查看',
  Edit: '编辑',
  Delete: '删除',
  More: '更多',
  DeleteAccount: '删除账号',
  DisableAccount: '禁用账号',
  EnableAccount: '启用账号',
  ChangePassword: '修改密码',
  ClientTrajectory: '终端用户轨迹',
  Cancel: '取消',
  Confirm: '确认',
  Add: '新增',
  BatchImport: '批量导入',
  BatchExport: '导出全部',
  TemplateDownload: '下载导入模板',
  Query: '查询',
  Save: '保存',
  CreateTask: '创建任务',
  StartTask: '开始任务',
  PausedTask: '暂停任务',
  CancelTask: '取消任务',
  Upload: '上传',
  Submit: '提交',
  AddSelected: '添加选中',
  DeleteSelected: '删除选中',
  NextSiteSelection: '下一步：基准站选择',
  PreviousTaskInfo: '上一步：任务信息',
  NextConfirmTask: '下一步：确认任务',
  PreviousSiteSelection: '上一步：基准站选择',
  ReturnToTaskList: '返回基准站任务',
  Download: '下载',
  Disable: '禁用',
  Enable: '启用',
  Reset: '重置',
  BatchModify: '批量修改',
  Binding: '绑定',
  Unbinding: '解绑',
  ConfirmUnbinding: '确定解绑',
  SeniorSearch: '高级搜索',
  GoBack: '返回上一级',
  AllFiles: '全部文件',
  Close: '关闭',
  Open: '打开',
  BatchEnable: '批量启用',
  BatchDisable: '批量禁用',
  BatchDelete: '批量删除',
  FTPEdit: 'FTP编辑',
  SshEdit: 'SSH编辑',
  HttpLocalEdit: 'HTTP本地编辑',
  HttpRemoteEdit: 'HTTP远程编辑',
  MqttRemoteEdit: 'MQTT远程编辑',
  TelnetEdit: 'Telnet编辑',
  UsbFormat: 'USB格式化',
  TfCardFormat: 'TF卡格式化',
  PositioningEdit: '定位格式编辑',
  ObservationEdit: '观测格式编辑',
  DiffEdit: '差分格式编辑',
  AddMember: '新建成员',
  ResetPassword: '重置密码',
  MarkAllRead: '全部标记已读',
  MarkRead: '标记已读',
}

const btnKey = {
  'message-memberlist-addMember': true,
  'message-memberlist-edit': true,
  'message-memberlist-resetPassword': true,
  'message-memberlist-delete': true,
  'message-sitemessage-markAllRead': true,
  'message-sitemessage-markRead': true,
  'message-sitemessage-delete': true,
  'message-subscription-edit': true
}

const test = {...btnKey}
for (const key in test) {
  if (Object.hasOwnProperty.call(test, key)) {
    let btnName = key.split('-')[2];
    btnName = btnName.charAt(0).toUpperCase() + btnName.slice(1)
    if(opr[btnName]){
      test[key] = opr[btnName]
    } else {
      btnName = btnName.slice(5,)
      btnName = btnName.charAt(0).toUpperCase() + btnName.slice(1)
      test[key] = opr[btnName] || btnName
    }
  }
}
fs.writeFile(`./test/test-message.json`, JSON.stringify(test), (err) => {
  console.log(err);
})