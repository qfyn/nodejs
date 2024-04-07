import i18n from '@/lang'
// 路由地址 转 i18n的key
const menuTranslate = {
  // 系统名称
  '/platform': 'SystemPlatform',
  '/manage': 'AccountCenter',
  '/station': 'SystemStation',
  '/daping': 'SystemBig',
  '/message': 'SystemMessage',
  '/omc': 'SystemOMC',
  '/dss': 'SystemDSS',
  '/dashboard': 'DashboardManage',

  // platform
  '/base-station': 'BaseManagement',
  '/base-station/distribution': 'BaseLocator',
  '/base-station/list': 'BaseList',
  '/base-station/task': 'BaseTask',
  '/base-station/task/create-task': 'CreateTask',
  '/base-station/task/look-task': 'LookTask',
  '/base-station/firmware': 'Firmware',
  '/base-station/firmware/look-firmware': 'LookFirmware',
  '/terminal': 'ClientManagement',
  '/terminal/distribution': 'ClientLocator',
  '/terminal/list': 'ClientList',
  '/terminal/trajectory': 'ClientTrajectory',
  '/terminal/look-details': 'ClientDetails',
  '/terminal/approval': 'ApprovalList',
  '/system': 'System',
  '/system/baseset': 'BaseSet',
  '/log-audit': 'LogAudit',
  '/log-audit/login-audit': 'LoginAudit',
  '/log-audit/operation-audit': 'OperationAudit',

  // station
  '/satellite-system': 'SatelliteSystem',
  '/satellite-system/track-list': 'TrackList',
  '/satellite-system/sky-chart': 'SkyChart',
  '/data-record': 'DataManage',
  '/data-record/record': 'DataRecord',
  '/data-record/list': 'FileList',
  '/data-record/event': 'EventInfo',
  '/data-transmission': 'DataTransmission',
  '/data-transmission/serial': 'SerialTransmission',
  '/data-transmission/network': 'NetworkTransmission',
  '/system-set': 'SystemSet',
  '/system-set/host-info': 'HostInfo',
  '/system-set/mainboard-info': 'MainboardInfo',
  '/system-set/antenna-info': 'AntennaInfo',
  '/system-set/store-info': 'StoreInfo',
  '/system-set/power-info': 'PowerInfo',
  '/system-set/network-set': 'NetworkSet',
  '/system-set/work-mode': 'WorkMode',
  '/system-set/data-format': 'DataFormat',
  '/system-set/server-manage': 'ServerManage',
  '/system-set/authorize-register': 'AuthorizeRegister',
  // manage
  '/organization': 'OrganizationManage',
  '/organization/structure': 'Organization',
  '/organization/memberlist': 'MemberList',
  '/accountcenter': 'AccountManage',
  '/accountcenter/accountinfo': 'AccountInfo',
  '/system/accountset': 'Accountset',
  '/accountcenter/securityset': 'SecuritySet',
  '/authority': 'AuthorityManage',
  '/authority/appmanage': 'AppManage',
  '/authority/rolemanage': 'RoleManage',
  '/authority/service': 'ServiceAuthorization',
  '/authority/service/update-auth': 'UpdateAuthorization',
  '/authority/service/activate-service': 'ActivateService',
  '/partyapp': 'PartyAppManage',
  '/partyapp/applist': 'AppList',

  // message
  '/sitemessage': 'SiteMessage',
  '/subscription': 'Subscription',
  '/receiver': 'Receiver',
  '/sitemessage/sitemessage': 'SiteMessage',
  '/subscription/subscription': 'Subscription',
  '/receiver/receiver': 'Receiver',

  // omc
  '/alarm': 'Alarm',
  '/alarm/history': 'AlarmHistory',
  '/alarm/policy': 'AlarmPolicy',
  '/alarm/policy/create': 'AlarmPolicyCreate',
  '/alarm/policy/edit': 'AlarmPolicyEdit',
  '/alarm/policy/detail': 'AlarmPolicyDetail',
  '/alarm/notice': 'AlarmNotice',
  '/alarm/notice/create': 'AlarmNoticeCreate',
  '/alarm/notice/edit': 'AlarmNoticeEdit',
  '/alarm/notice/detail': 'AlarmNoticeDetail',
  '/alarm/quality-config': 'OmcQualityThresholdConfigEdit',
  '/monitor': 'Monitor',
  '/monitor/overview': 'MonitorOverview',
  '/monitor/list': 'MonitorList',
  '/monitor/list/detail': 'MonitorDetail',
  '/receiver-monitor': 'ReceiverMonitor',
  '/receiver-monitor/overview': 'ReceiverMonitorOverview',
  '/receiver-monitor/list': 'ReceiverMonitorList',
  '/receiver-monitor/detail': 'ReceiverMonitorDetail',
  '/netform-monitor': 'NetFormMonitor',
  '/netform-monitor/overview': 'NetFormMonitorOverview',
  '/netform-monitor/ionization': 'NetFormMonitorIonization',
  '/netform-monitor/convection': 'NetFormMonitorConvection',
  '/netform-monitor/list': 'NetFormMonitorTabList',
  '/netform-monitor/satelliteDetail': 'NetFormMonitorSatelliteDetail',
  '/netform-monitor/residualDetail': 'NetFormMonitorResidualDetail',
  '/netform-monitor/calculatingDetail': 'NetFormMonitorCalculatingDetail',
  '/netform-monitor/availabilityDetail': 'NetFormMonitorAvailabilityDetail',
  // 运监管理- 基准站运行状态监测,
  '/stationRunning': 'StationRunningMonitor',
  '/stationRunning/runningOverview': 'StationRunningOverview',
  '/stationRunning/runningList': 'StationRunningList',
  '/stationRunning/runningDetail': 'OmcStationRunningDetail',
  // 运监管理- 基准站坐标偏移监测
  '/stationCoordinateOffset': 'OmcStationCoordinateOffsetMonitor',
  '/stationCoordinateOffset/overview': 'OmcStationCoordinateOffsetOverview',
  '/stationCoordinateOffset/list': 'OmcStationCoordinateOffsetList',
  '/stationCoordinateOffset/detail': 'OmcStationCoordinateOffsetDetail',
  // 运监管理- 基准站数据质量监测
  '/stationDataQuality': 'OmcStationDataQualityMonitor',
  '/stationDataQuality/overview': 'OmcStationDataQualityOverview',
  '/stationDataQuality/list': 'OmcStationDataQualityList',
  '/stationDataQuality/detail': 'OmcStationDataQualityDetail',
  '/stationDataQuality/report': 'OmcStationDataQualityReport',
  // 运监管理- 指标等级设置
  '/quality': 'OmcQualityThresholdConfig',
  '/quality/config': 'OmcQualityThresholdConfigEdit',
  // 运监管理- 基准站运行状态监测
  '/broadcastMonitor': 'OmcBroadcastMonitor',
  '/broadcastMonitor/overview': 'OmcBroadcastMonitorOverview',
  '/broadcastMonitor/list': 'OmcBroadcastMonitorList',
  '/broadcastMonitor/detail': 'OmcBroadcastMonitorDetail',
  // 运监管理- 监控概览
  '/generalView': 'OmcGeneralView',
  '/generalView/index': 'OmcGeneralView',
  // 运监管理- 用户监测
  '/userMonitor': 'OmcUserMonitor',
  '/userMonitor/overview': 'OmcUserMonitorOverview',
  '/userMonitor/list': 'OmcUserMonitorList',
  '/userMonitor/detail': 'OmcUserMonitorDetail',
  // 运监管理- 应用监测
  '/applicationMonitor': 'OmcApplicationMonitor',
  '/applicationMonitor/overview': 'OmcApplicationMonitorOverview',
  '/applicationMonitor/list': 'OmcApplicationMonitorList',
  '/applicationMonitor/detail': 'OmcApplicationMonitorDetail',
  '/applicationMonitor/microservice/detail': 'OmcApplicationMonitorMicroserviceDetail',
  '/applicationMonitor/mysql/detail': 'OmcApplicationMonitorMysqlDetail',
  '/applicationMonitor/kafka/detail': 'OmcApplicationMonitorKafkaDetail',
  '/applicationMonitor/redis/detail': 'OmcApplicationMonitorRedisDetail',
  '/applicationMonitor/rabbitmq/detail': 'OmcApplicationMonitorRabbitmqDetail',
  '/applicationMonitor/elasticsearch/detail': 'OmcApplicationMonitorElasticsearchDetail',
  // 系统设置
  '/omc-system': 'System',
  '/omc-system/baseset': 'BaseSet',

  // 差分服务
  '/stream': 'StreamManagement',
  '/stream/access': 'StreamAccess',
  '/stream/access/edit': 'EditStreamAccess',
  '/stream/forward': 'StreamForward',
  '/stream/forward/edit': 'EditStreamForward',
  '/precision-network': 'NetworkConfifuration',
  '/precision-network/monitor': 'Monitoring',
  '/precision-network/network-list': 'Management',
  '/precision-network/partition': 'ZoneList',
  '/precision-network/partition/map': 'PartitionMap',
  '/precision-network/partition/table': 'PartitionTable',
  '/precision-network/network-look': 'Network',
  '/precision-network/cover': 'BaseCover',
  '/advertiser': 'AdvertiserManagement',
  '/advertiser/source-list': 'SourceNode',
  '/advertiser/list': 'ClientList',
  '/advertiser/trajectory': 'ClientTrajectory',
  '/advertiser/look-details': 'ClientViewDetails',
  '/dss-monitor': 'DssMonitor',
  '/dss-monitor/monitor-evaluation': 'CoordinateMonitor',
  '/dss-monitor/monitor-evaluation/create-monitor': 'MonitorTaskCreateTask',
  '/dss-monitor/monitor-evaluation/look-monitor': 'MonitorTaskLookTask',
  '/dss-monitor/monitor-evaluation-report': 'MonitorReport',
  '/dss-monitor/origin': 'OriginData',
  '/dss-monitor/origin/store': 'OriginDataStore',
  '/dss-monitor/origin/analyse': 'OriginDataAnalyse',
  '/dss-monitor/origin/store/lookTask': 'StoreLookTask',
  '/dss-monitor/origin/store/createTask': 'StoreCreateTask',
  '/dss-monitor/rinexlist': 'DataDownload',
  '/dss-monitor/rinexlist/create-task': 'RinexCreateTask',
  '/dss-system': 'System',
  '/dss-system/threshold': 'Threshold',
  '/dss-system/baseset': 'BaseSet',

  // todo
  '/satelliteMonitoring': 'SatelliteMonitoring'
}
/**
 * 翻译转换
 * @param {Object} data 路由数据 { name, path, meta }
 * @returns 转义后的菜单
 */
export function generateTitle(data) {
  const { path, name, meta } = data || {}
  if (path === '' || path === '/') {
    return i18n.t('route.HomePage')
  }
  const k = menuTranslate[path]
  if (i18n.te('route.' + k)) return i18n.t('route.' + k)
  return meta?.title || name
}
