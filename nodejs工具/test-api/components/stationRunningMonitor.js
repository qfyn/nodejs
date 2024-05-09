import Layout from '@/layout'

export default [
  {
    path: '/stationRunning', // 基准站运行状态监测
    component: Layout,
    redirect: 'noRedirect',
    name: 'StationRunningMonitor',
    meta: { title: 'StationRunningMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/stationRunning/runningOverview', // 运行状态监测概览
        component: () => import('@/views/station/overview/running/index'),
        name: 'StationRunningOverview',
        meta: { title: 'StationRunningOverview', noCache: true, hasMap: true }
      },
      {
        path: '/stationRunning/runningList', // 运行状态监测列表
        component: () => import('@/views/station/list/running'),
        name: 'StationRunningList',
        meta: { title: 'StationRunningList', noCache: true }
      },
      {
        path: '/stationRunning/runningDetail', // 运行状态监测详情
        hidden: true,
        component: () => import('@/views/station/detail/tabs'),
        name: 'StationRunningDetail',
        meta: { title: 'StationRunningDetail', noCache: true, activeMenu: '/stationRunning/runningList' }
      }
      // ,
      // {
      //   path: '/stationRunning/snrDetail',
      //   hidden: true,
      //   component: () => import('@/views/station/detail/snrDetail'),
      //   name: 'NetFormMonitorSatelliteDetail',
      //   meta: { title: 'NetFormMonitorSatelliteDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      // },
      // {
      //   path: '/stationRunning/residualDetail',
      //   hidden: true,
      //   component: () => import('@/views/netform-monitor/tablist/residualDetail'),
      //   name: 'NetFormMonitorResidualDetail',
      //   meta: { title: 'NetFormMonitorResidualDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      // },
      // {
      //   path: '/stationRunning/calculatingDetail',
      //   hidden: true,
      //   component: () => import('@/views/netform-monitor/tablist/calculatingDetail'),
      //   name: 'NetFormMonitorCalculatingDetail',
      //   meta: { title: 'NetFormMonitorCalculatingDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      // },
      // {
      //   path: '/stationRunning/availabilityDetail',
      //   hidden: true,
      //   component: () => import('@/views/netform-monitor/tablist/availabilityDetail'),
      //   name: 'NetFormMonitorAvailabilityDetail',
      //   meta: { title: 'NetFormMonitorAvailabilityDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      // }
    ]
  }
]
