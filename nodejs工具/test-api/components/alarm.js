import Layout from '@/layout'

export default [
  {
    path: '/alarm',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Alarm',
    meta: { title: 'Alarm', icon: 'el-icon-bell' },
    children: [
      {
        path: '/alarm/quality-config',
        hidden: true,
        component: () => import('@/views/alarm/quality/thresholdConf'),
        name: 'QualityThresholdConfigEdit',
        meta: { title: 'QualityThresholdConfigEdit', noCache: true }
      },
      {
        path: '/alarm/history',
        component: () => import('@/views/alarm/history'),
        name: 'AlarmHistory',
        meta: { title: 'AlarmHistory', noCache: false }
      },
      {
        path: '/alarm/policy',
        component: () => import('@/views/alarm/policy/index'),
        name: 'AlarmPolicy',
        meta: { title: 'AlarmPolicy', noCache: false }
      },
      {
        path: '/alarm/policy/create',
        hidden: true,
        component: () => import('@/views/alarm/policy/create'),
        name: 'AlarmPolicyCreate',
        meta: { title: 'AlarmPolicyCreate', noCache: true, activeMenu: '/alarm/policy' }
      },
      {
        path: '/alarm/policy/edit',
        hidden: true,
        component: () => import('@/views/alarm/policy/edit'),
        name: 'AlarmPolicyEdit',
        meta: { title: 'AlarmPolicyEdit', noCache: true, activeMenu: '/alarm/policy' }
      },
      {
        path: '/alarm/policy/detail',
        hidden: true,
        component: () => import('@/views/alarm/policy/detail'),
        name: 'AlarmPolicyDetail',
        meta: { title: 'AlarmPolicyDetail', noCache: true, activeMenu: '/alarm/policy' }
      },
      {
        path: '/alarm/notice',
        component: () => import('@/views/alarm/notice/index'),
        name: 'AlarmNotice',
        meta: { title: 'AlarmNotice', noCache: false }
      },
      {
        path: '/alarm/notice/create',
        hidden: true,
        component: () => import('@/views/alarm/notice/create'),
        name: 'AlarmNoticeCreate',
        meta: { title: 'AlarmNoticeCreate', noCache: true, activeMenu: '/alarm/notice' }
      },
      {
        path: '/alarm/notice/edit',
        hidden: true,
        component: () => import('@/views/alarm/notice/edit'),
        name: 'AlarmNoticeEdit',
        meta: { title: 'AlarmNoticeEdit', noCache: true, activeMenu: '/alarm/notice' }
      },
      {
        path: '/alarm/notice/detail',
        hidden: true,
        component: () => import('@/views/alarm/notice/detail'),
        name: 'AlarmNoticeDetail',
        meta: { title: 'AlarmNoticeDetail', noCache: true, activeMenu: '/alarm/notice' }
      }
    ]
  }
]
