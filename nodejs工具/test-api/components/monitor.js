import Layout from '@/layout'

export default [
  {
    path: '/monitor',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Monitor',
    meta: { title: 'Monitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/monitor/overview',
        component: () => import('@/views/monitor/overview'),
        name: 'MonitorOverview',
        meta: { title: 'MonitorOverview', noCache: true }
      },
      {
        path: '/monitor/list',
        component: () => import('@/views/monitor/list'),
        name: 'MonitorList',
        meta: { title: 'MonitorList', noCache: true }
      },
      {
        path: '/monitor/list/detail',
        hidden: true,
        component: () => import('@/views/monitor/detail'),
        name: 'MonitorDetail',
        meta: { title: 'MonitorDetail', noCache: true, activeMenu: '/monitor/list' }
      }

    ]
  }
]
