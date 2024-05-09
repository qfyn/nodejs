import Layout from '@/layout'

export default [
  {
    path: '/receiver-monitor',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ReceiverMonitor',
    meta: { title: 'ReceiverMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/receiver-monitor/overview',
        component: () => import('@/views/receiver-monitor/overview/index'),
        name: 'ReceiverMonitorOverview',
        meta: { title: 'ReceiverMonitorOverview', noCache: true, hasMap: true }
      },
      {
        path: '/receiver-monitor/list',
        component: () => import('@/views/receiver-monitor/list'),
        name: 'ReceiverMonitorList',
        meta: { title: 'ReceiverMonitorList', noCache: true }
      },
      {
        path: '/receiver-monitor/detail',
        hidden: true,
        component: () => import('@/views/receiver-monitor/detail/index'),
        name: 'ReceiverMonitorDetail',
        meta: { title: 'ReceiverMonitorDetail', noCache: true, activeMenu: '/receiver-monitor/list' }
      }
    ]
  }
]
