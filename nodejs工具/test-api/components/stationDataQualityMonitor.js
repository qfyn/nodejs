import Layout from '@/layout'

export default [
  {
    path: '/stationDataQuality', // 基准站数据质量监测
    component: Layout,
    redirect: 'noRedirect',
    name: 'StationDataQualityMonitor',
    meta: { title: 'StationDataQualityMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/stationDataQuality/overview', // 数据质量监测概览
        component: () => import('@/views/station/overview/dataQuality/index'),
        name: 'StationDataQualityOverview',
        meta: { title: 'StationDataQualityOverview', noCache: true, hasMap: true }
      },
      {
        path: '/stationDataQuality/list', // 数据质量监测列表
        component: () => import('@/views/station/list/dataQuality'),
        name: 'StationDataQualityList',
        meta: { title: 'StationDataQualityList', noCache: true }
      },
      {
        path: '/stationDataQuality/detail', // 数据质量监测详情
        hidden: true,
        component: () => import('@/views/station/detail/dataQualityDetail'),
        name: 'StationDataQualityDetail',
        meta: { title: 'StationDataQualityDetail', noCache: true, activeMenu: '/stationDataQuality/list' }
      },
      {
        path: '/stationDataQuality/report', // 数据质量监测报告
        hidden: true,
        component: () => import('@/views/station/detail/qualityReport'),
        name: 'StationDataQualityReport',
        meta: { title: 'StationDataQualityReport', noCache: true, activeMenu: '/stationDataQuality/list' }
      }
    ]
  }
]
