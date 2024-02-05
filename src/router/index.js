import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }, // 首页
    {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
]
export const asyncRouterMap  = [
    // 首页
    {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
 // 会员管理
  {
    path: '/admin/member',
    component: Layout,
    name: 'Member',
    redirect: '/admin/member/list',
    meta: { title: '会员', icon: 'el-icon-user-solid' },
    children: [{
      path: 'list',
      name: 'List',
      component: () => import('@/views/admin/mms/member/index'),
      meta: { 
        title: '会员',
        }
    },
    {
      path: 'update',
      name: 'Update',
      component: () => import('@/views/admin/mms/member/update'),
      meta: { title: '编辑会员'},
      hidden:true
    }]
  },
  // 商户管理
  {
    path: '/admin/mms',
    component: Layout,
    redirect: '/admin/mms/merchantList',
    name: 'Merchant',
    meta: {title: '商户', icon: 'el-icon-s-shop'},
    children: [
    //   {
    //     path: 'merchantList',
    //     name: 'MerchantList',
    //     component: () => import('@/views/admin/mms/merchant/index'),
    //     meta: {title: '商家列表'}
    //   },
    {
        path: 'merchantList',
        name: 'MerchantList',
        component: () => import('@/views/admin/pms/brand/index'),
        meta: {
            title: '商家列表',
            keepAlive: true
        }
      },
    {
        path: 'merchantExamine',
        name: 'MerchantExamine',
        component: () => import('@/views/admin/mms/merchant/examine'),
        meta: {title: '商家注册审核'}
      },{
        path: 'merchantDetail',
        name: 'MerchantDetail',
        component: () => import('@/views/admin/mms/merchant/detail'),
        meta: {title: '商家注册信息详情'},
        hidden:true
      },  
      {
        path: 'addBrand',
        name: 'addBrand',
        component: () => import('@/views/admin/pms/brand/add'),
        meta: {title: '添加商家'},
        hidden: true
      },
      {
        path: 'updateBrand',
        name: 'updateBrand',
        component: () => import('@/views/admin/pms/brand/update'),
        meta: {title: '编辑商家'},
        hidden: true
      }      
]
  },
   // 商品管理
  {
    path: '/admin/product',
    component: Layout,
    name: 'Product',
    redirect: '/admin/product/productList',
    meta: { title: '商品', icon: 'el-icon-s-goods' },
    children: [
      {
        path: 'productList',
        name: 'ProductList',
        component: () => import('@/views/admin/pms/product/index.vue'),
        meta: { 
            title: '商品列表',
            keepAlive: true
        }
     },{
        path: 'productUpdate',
        name: 'ProductUpdate',
        component: () => import('@/views/admin/pms/product/update.vue'),
        meta: { 
            title: '商品详情' ,
        },
         hidden: true
     },{  
        path: 'productAuth',
        name: 'ProductAuth',
        component: () => import('@/views/admin/pms/productApprove/index.vue'),
        meta: { 
            title: '产品认证审核',
        }
     },{ 
        path: 'productAuthDetail',
        name: 'ProductAuthDetail',
        component: () => import('@/views/admin/pms/productApprove/detail.vue'),
        meta: { title: '产品认证审核详情'},
        hidden:true
     },
     {
        path: 'productCate',
        name: 'productCate',
        component: () => import('@/views/admin/pms/productCate/index'),
        meta: {title: '商品分类'}
      },
      {
        path: 'addProductCate',
        name: 'addProductCate',
        component: () => import('@/views/admin/pms/productCate/add'),
        meta: {title: '添加商品分类'},
        hidden: true
      },
      {
        path: 'updateProductCate',
        name: 'updateProductCate',
        component: () => import('@/views/admin/pms/productCate/update'),
        meta: {title: '修改商品分类'},
        hidden: true
      }, {
        path: 'productAttr',
        name: 'productAttr',
        component: () => import('@/views/admin/pms/productAttr/index'),
        meta: {title: '商品类型'}
      },
      {
        path: 'productAttrList',
        name: 'productAttrList',
        component: () => import('@/views/admin/pms/productAttr/productAttrList'),
        meta: {title: '商品属性列表'},
        hidden: true
      },
      {
        path: 'addProductAttr',
        name: 'addProductAttr',
        component: () => import('@/views/admin/pms/productAttr/addProductAttr'),
        meta: {title: '添加商品属性'},
        hidden: true
      },
      {
        path: 'updateProductAttr',
        name: 'updateProductAttr',
        component: () => import('@/views/admin/pms/productAttr/updateProductAttr'),
        meta: {title: '修改商品属性'},
        hidden: true
      },
  ]
  },
  // 订单管理
  {
    path: '/admin/oms',
    component: Layout,
    redirect: '/admin/oms/order',
    name: 'Oms',
    meta: {title: '订单', icon: 'el-icon-s-order'},
    children: [
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/admin/oms/order/index'),
        meta: {
            title: '订单列表',
            keepAlive: true
        }
      },
      {
        path: 'orderSetting',
        name: 'OrderSetting',
        component: () => import('@/views/admin/oms/order/setting'),
        meta: {title: '订单设置'}
      },{
        path: 'returnReason',
        name: 'returnReason',
        component: () => import('@/views/admin/oms/apply/reason'),
        meta: {title: '退货原因设置'}
      },
      {
        path: 'returnApplyDetail',
        name: 'returnApplyDetail',
        component: () => import('@/views/admin/oms/apply/applyDetail'),
        meta: {title: '退货原因详情'},
        hidden:true
      }]
  },
  // 知识学习
  {
    path: '/admin/article',
    component: Layout,
    redirect: '/admin/study/list',
    name: 'Article',
    meta: {title:"知识学习", icon: 'el-icon-s-management'},
    children: [
        {
            path: 'articleList',
            name: 'ArticleList',
            component: () => import('@/views/admin/nms/study/list'),
            meta: {
                title: '文章列表',
                keepAlive: true
            }
        },{
            path: 'articleAdd',
            name: 'ArticleAdd',
            component: () => import('@/views/admin/nms/study/add'),
            meta: {title: '添加文章'}
        },{
            path: 'articleUpdate',
            name: 'ArticleUpdate',
            component: () => import('@/views/admin/nms/study/update'),
            meta: {title: '编辑文章'},
            hidden:true
        },
    ]
  },
  // 专家指导
  {
    path: '/admin/guidance',
    component: Layout,
    redirect: '/admin/guidance/list',
    name: 'Activity',
    meta: {title:"专家指导", icon: 'el-icon-s-help'},
    children: [
        {
            path: 'activityList',
            name: 'ActivityList',
            component: () => import('@/views/admin/nms/guidance/list'),
            meta: {
                title: '活动列表',
                keepAlive: true,
            }
        },{
            path: 'activityAdd',
            name: 'ActivityAdd',
            component: () => import('@/views/admin/nms/guidance/add'),
            meta: {title: '添加活动'}
        },{
            path: 'activityUpdate',
            name: 'ActivityUpdate',
            component: () => import('@/views/admin/nms/guidance/update'),
            meta: {title: '编辑活动'},
            hidden:true
        },
    ]
  },
  // 权限管理
  {
    path: '/admin/ums',
    component: Layout,
    redirect: '/admin/ums/admin',
    name: 'Ums',
    meta: {title: '权限', icon: 'el-icon-lock'},
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/admin/ums/admin/index'),
        meta: {
            title: '管理员列表',
            keepAlive: true
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/admin/ums/role/index'),
        meta: {title: '管理员设置'}
      },{
        path: 'allocMenu',
        name: 'AllocMenu',
        component: () => import('@/views/admin/ums/role/allocMenu'),
        meta: {title: '分配菜单'},
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/admin/ums/role/allocResource'),
        meta: {title: '分配资源'},
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/admin/ums/menu/index'),
        meta: {title: '菜单列表'}
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/admin/ums/menu/add'),
        meta: {title: '添加菜单'},
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/admin/ums/menu/update'),
        meta: {title: '修改菜单'},
        hidden: true
      },{
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/admin/ums/resource/index'),
        meta: {title: '资源列表'}
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/admin/ums/resource/categoryList'),
        meta: {title: '资源分类'},
        hidden: true
      }]
  },
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // 后端支持可开
  mode: 'hash',
  scrollBehavior:(to,from,position)=>{
        if(position){
            return position
        }else{
            return {x:0,y:0}
        }
    },
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
