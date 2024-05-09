import Layout from '@/layout'

export default [
  {
    path: '/broadcastMonitor',
    component: Layout,
    redirect: 'noRedirect',
    name: 'BroadcastMonitor',
    meta: { title: 'BroadcastMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/broadcastMonitor/overview',
        component: () => import('@/views/broadcast-monitor/overview/index'),
        name: 'BroadcastMonitorOverview',
        meta: { title: 'BroadcastMonitorOverview', noCache: true, hasMap: true }
      },
      {
        path: '/broadcastMonitor/list',
        component: () => import('@/views/broadcast-monitor/list/index'),
        name: 'BroadcastMonitorList',
        meta: { title: 'BroadcastMonitorList', noCache: true }
      },
      {
        path: '/broadcastMonitor/detail',
        hidden: true,
        component: () => import('@/views/broadcast-monitor/detail/index'),
        name: 'BroadcastMonitorDetail',
        meta: { title: 'BroadcastMonitorDetail', noCache: true, activeMenu: '/broadcastMonitor/list' }
      }
    ]
  }
]
