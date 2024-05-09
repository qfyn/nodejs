import Layout from '@/layout'

export default [
  {
    path: '/omc-system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'System',
    meta: { title: 'System', icon: 'el-icon-view' },
    children: [
      {
        path: '/omc-system/baseset',
        component: () => import('@/views/system/baseset/index'),
        name: 'BaseSet',
        meta: { title: 'BaseSet', noCache: true }
      }
    ]
  }
]
