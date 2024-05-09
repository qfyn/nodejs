import Layout from '@/layout'

export default [
  {
    path: '/quality',
    component: Layout,
    hidden: false,
    redirect: '/quality/config',
    name: 'QualityThresholdConfig',
    meta: { title: 'QualityThresholdConfig', icon: 'el-icon-view' },
    children: [
      {
        path: '/quality/config',
        hidden: true,
        component: () => import('@/views/quality/thresholdConf'),
        name: 'QualityThresholdConfigEdit',
        meta: { title: 'QualityThresholdConfigEdit', noCache: true, activeMenu: '/quality' }
      }
    ]
  }
]
