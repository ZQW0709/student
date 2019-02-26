import Vue from 'vue'
import Router from 'vue-router'
import Homepage from 'views/homepage'
import UserInfo from 'views/user-info'
import OrderList from 'views/order-list'
import Login from 'views/login'
import NewOrder from 'views/new-order'
import OrderDetail from 'views/order-detail'
import UserOrder from 'views/user-order'
import ModifyInfo from 'views/modify-info'
import Page404 from 'views/404'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    // {
    //   path: '/',
    //   redirect: '/homepage'
    // },
    {
      name: 'homepage',
      path: '/homepage',
      component: Homepage,
      children: [{
        name: 'newOrder',
        path: 'new-order',
        component: NewOrder
      }]
    },
    {
      name: 'userInfo',
      path: '/user-info',
      component: UserInfo,
      children: [
        {
          name: 'userOrder',
          path: 'user-order',
          component: UserOrder,
          children: [{
            name: 'userOrderDetail',
            path: 'order-detail/:orderId',
            component: OrderDetail
          }]
        },
        {
          name: 'modifyInfo',
          path: 'modify-info/:id',
          component: ModifyInfo
        }
      ]
    },
    {
      name: 'orderList',
      path: '/order-list',
      component: OrderList,
      children: [{
        name: 'listOrderDetail',
        path: 'order-detail/:orderId',
        component: OrderDetail
      }]
    },
    
{
    path: '/page404',
    name: 'page404',
    component: Page404
},
// {
//       name: 'homepage',
//       path: '/homepage',
//       component: Homepage
//     },
    
    // {
    //   name: 'homepage',
    //   path: '/homepage',
    //   component: Homepage
    // },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      path: '*',
      component: Page404
    }
  ]
})
