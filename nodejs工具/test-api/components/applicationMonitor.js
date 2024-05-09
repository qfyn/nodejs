import Layout from '@/layout'

export default [
  {
    path: '/applicationMonitor',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ApplicationMonitor',
    meta: { title: 'ApplicationMonitor', icon: 'el-icon-view' },
    children: [
      {
        path: '/applicationMonitor/overview',
        component: () => import('@/views/application-monitor/overview/index'),
        name: 'ApplicationMonitorOverview',
        meta: { title: 'ApplicationMonitorOverview', noCache: true }
      },
      {
        path: '/applicationMonitor/list',
        component: () => import('@/views/application-monitor/list/index'),
        name: 'ApplicationMonitorList',
        meta: { title: 'ApplicationMonitorList', noCache: true }
      },
      {
        path: '/applicationMonitor/microservice/detail',
        hidden: true,
        component: () => import('@/views/application-monitor/detail/microserviceDetail'),
        name: 'MicroserviceDetail',
        meta: { title: 'MicroserviceDetail', noCache: true, activeMenu: '/applicationMonitor/list' }
      },
      {
        path: '/applicationMonitor/mysql/detail',
        hidden: true,
        component: () => import('@/views/application-monitor/detail/mysqlDetail'),
        name: 'MysqlDetail',
        meta: { title: 'MysqlDetail', noCache: true, activeMenu: '/applicationMonitor/list' }
      },
      {
        path: '/applicationMonitor/kafka/detail',
        hidden: true,
        component: () => import('@/views/application-monitor/detail/kafkaDetail'),
        name: 'KafkaDetail',
        meta: { title: 'KafkaDetail', noCache: true, activeMenu: '/applicationMonitor/list' }
      },
      {
        path: '/applicationMonitor/redis/detail',
        hidden: true,
        component: () => import('@/views/application-monitor/detail/redisDetail'),
        name: 'RedisDetail',
        meta: { title: 'RedisDetail', noCache: true, activeMenu: '/applicationMonitor/list' }
      },
      {
        path: '/applicationMonitor/rabbitmq/detail',
        hidden: true,
        component: () => import('@/views/application-monitor/detail/rabbitmqDetail'),
        name: 'RabbitmqDetail',
        meta: { title: 'RabbitmqDetail', noCache: true, activeMenu: '/applicationMonitor/list' }
      },
      {
        path: '/applicationMonitor/elasticsearch/detail',
        hidden: true,
        component: () => import('@/views/application-monitor/detail/elasticsearchDetail'),
        name: 'ElasticsearchDetail',
        meta: { title: 'ElasticsearchDetail', noCache: true, activeMenu: '/applicationMonitor/list' }
      }
    ]
  }
]
