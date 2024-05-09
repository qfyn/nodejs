import Layout from '@/layout'

export default [
  {
    path: '/generalView', // 监控概览
    component: Layout,
    redirect: '/generalView/index',
    name: 'generalView',
    hidden: false,
    meta: { title: 'generalView', icon: 'el-icon-view' },
    // component: () => import('@/views/general-view/index'),
    children: [
      {
        path: '/generalView/index', // 监控概览
        hidden: true,
        component: () => import('@/views/general-view/index'),
        name: 'generalView',
        meta: { title: 'generalView', noCache: true, activeMenu: '/generalView' }
      }
    ]
  }
]
