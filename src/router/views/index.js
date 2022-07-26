import Layout from '@/page/layout/index.vue'
import spaceLayout from  '@/views/projectManager/space/index.vue'
export default [
  {
    path: '/',
    name: '主页',
    component: () =>import(/* webpackChunkName: "page" */ "@/views/index/index"),
  },
  {
    path: '/index',
    component: Layout,
    redirect: '/index/home',
    children: [{
        path: '/index/home',
        name: '工作台',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/home/index'),
    }]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/index',
    children: [{
        path: '/project/index',
        name: '项目管理',
        redirect:'/project/list/my',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/projectManager/index'),
        children:[
          {
            path: '/project/list/:type',
            name: '我的项目',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/projectManager/list/index')
          },
          {
            path: '/project/analysis',
            name: '项目分析',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/projectManager/analysis/index')
          },
          {
            path: '/project/organization',
            name: '我的组织',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/projectManager/organization/index')
          },
          {
            path: '/project/template',
            name: '项目模板',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/projectManager/template/index')
          },
          {
            path: '/project/notify/notice',
            name: '站内消息',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/projectManager/notify/tainan')
          },
          {
            path: '/project/notify/system',
            name: '系统公告',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/projectManager/notify/system')
          }
        ]
    },{
      path:'/project/space',
      component:spaceLayout,
      children:[{
        path:'/project/space/task',
        name:"项目空间",
        component:()=> import('@/views/projectManager/space/task/index.vue'),
        children:[{
          path:"/project/space/task/:taskId",
          name:"项目空间"
        },{
          path:"/project/space/task/:taskId/detail/:code",
          name:"任务详情",
          component:()=>import('@/views/projectManager/space/task/taskDetail.vue')
        }]
      },{
        path:'/project/space/files/:taskId',
        name:"文件管理",
          component:()=> import('@/views/projectManager/space/files/index.vue')
      },{
        path:"/project/space/overview/:taskId",
        name:"任务概览",
        component:()=>import('@/views/projectManager/space/overview/index.vue')
      },{
        path:"/project/space/features/:taskId",
        name:"任务版本",
        component:()=>import('@/views/projectManager/space/features/index.vue')
      }]
    },{
      path:'/project/template/taskstages/:code',
      name:'任务列表',
      component:()=>import('@/views/projectManager/template/taskStages.vue')
    },{
      path:'/invite_from_link/:code',
      name:'邀请加入',
      component:()=>import('@/views/projectManager/inviteFromLink/index.vue')
    }]
  },
  {
    path: '/team',
    component: Layout,
    redirect: '/team/index',
    children: [{
        path: '/team/index',
        name: '团队管理',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/teamUser/index'),
    }]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    children: [{
        path: '/system/index',
        name: '系统设置',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/sysSetting/index'),
    }]
  }
];
