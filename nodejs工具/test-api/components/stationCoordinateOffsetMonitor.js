import Layout from '@/layout'

export default [
  {
    path: '/stationCoordinateOffset',
    component: Layout,
    redirect: 'noRedirect',
    name: 'StationCoordinateOffsetMonitor',
    meta: { title: 'StationCoordinateOffsetMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/stationCoordinateOffset/overview',
        component: () => import('@/views/station/overview/coordinateOffset/index'),
        name: 'StationCoordinateOffsetOverview',
        meta: { title: 'StationCoordinateOffsetOverview', noCache: true, hasMap: true }
      },
      {
        path: '/stationCoordinateOffset/list',
        component: () => import('@/views/station/list/coordinateOffset'),
        name: 'StationCoordinateOffsetList',
        meta: { title: 'StationCoordinateOffsetList', noCache: true }
      },
      {
        path: '/stationCoordinateOffset/detail',
        hidden: true,
        component: () => import('@/views/station/detail/coordinateOffsetDetail'),
        name: 'StationCoordinateOffsetDetail',
        meta: { title: 'StationCoordinateOffsetDetail', noCache: true, activeMenu: '/stationCoordinateOffset/list' }
      }
    ]
  }
]
