import Layout from '@/layout'

export default [
  {
    path: '/userMonitor',
    component: Layout,
    redirect: 'noRedirect',
    name: 'UserMonitor',
    meta: { title: 'UserMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/userMonitor/overview',
        component: () => import('@/views/user-monitor/overview/index'),
        name: 'UserMonitorOverview',
        meta: { title: 'UserMonitorOverview', noCache: true, hasMap: true }
      },
      {
        path: '/userMonitor/list',
        component: () => import('@/views/user-monitor/list/index'),
        name: 'UserMonitorList',
        meta: { title: 'UserMonitorList', noCache: true }
      },
      {
        path: '/userMonitor/detail',
        hidden: true,
        component: () => import('@/views/user-monitor/detail/index'),
        name: 'UserMonitorDetail',
        meta: { title: 'UserMonitorDetail', noCache: true, activeMenu: '/userMonitor/list' }
      }
    ]
  }
]
