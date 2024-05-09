import Layout from '@/layout'

export default [
  {
    path: '/netform-monitor',
    component: Layout,
    redirect: 'noRedirect',
    name: 'NetFormMonitor',
    meta: { title: 'NetFormMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/netform-monitor/overview',
        component: () => import('@/views/netform-monitor/overview/index'),
        name: 'NetFormMonitorOverview',
        meta: { title: 'NetFormMonitorOverview', noCache: true, hasMap: true }
      },
      {
        path: '/netform-monitor/ionization',
        hidden: true,
        component: () => import('@/views/netform-monitor/ionization/index'),
        name: 'NetFormMonitorIonization',
        meta: { title: 'NetFormMonitorIonization', noCache: true, activeMenu: '/netform-monitor/overview', hasMap: true }
      },
      {
        path: '/netform-monitor/convection',
        hidden: true,
        component: () => import('@/views/netform-monitor/convection/index'),
        name: 'NetFormMonitorConvection',
        meta: { title: 'NetFormMonitorConvection', noCache: true, activeMenu: '/netform-monitor/overview', hasMap: true }
      },
      {
        path: '/netform-monitor/list',
        component: () => import('@/views/netform-monitor/tablist/tabs'),
        name: 'NetFormMonitorTabList',
        meta: { title: 'NetFormMonitorTabList', noCache: true }
      },
      {
        path: '/netform-monitor/satelliteDetail',
        hidden: true,
        component: () => import('@/views/netform-monitor/tablist/fixedSatelliteDetail'),
        name: 'NetFormMonitorSatelliteDetail',
        meta: { title: 'NetFormMonitorSatelliteDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      },
      {
        path: '/netform-monitor/residualDetail',
        hidden: true,
        component: () => import('@/views/netform-monitor/tablist/residualDetail'),
        name: 'NetFormMonitorResidualDetail',
        meta: { title: 'NetFormMonitorResidualDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      },
      {
        path: '/netform-monitor/calculatingDetail',
        hidden: true,
        component: () => import('@/views/netform-monitor/tablist/calculatingDetail'),
        name: 'NetFormMonitorCalculatingDetail',
        meta: { title: 'NetFormMonitorCalculatingDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      },
      {
        path: '/netform-monitor/availabilityDetail',
        hidden: true,
        component: () => import('@/views/netform-monitor/tablist/availabilityDetail'),
        name: 'NetFormMonitorAvailabilityDetail',
        meta: { title: 'NetFormMonitorAvailabilityDetail', noCache: true, activeMenu: '/netform-monitor/list' }
      }
    ]
  }
]
