import Vue from 'vue'
import Router from 'vue-router'
import Auth from './../components/auth/Auth'
import Main from './../components/main/Main'
import Snack from './../components/main/snack-manage/snack-manage'
import lazyLoading from './lazyLoading'

Vue.use(Router)
const requireAuth = (to, from, next) => {
  next()
   //로그인 성공시 리다이렉트 시킨다.
   const IdToken = localStorage.getItem("idToken")

   if (IdToken) {
     console.log("1111")
     next()
   } else {
     console.log("none")
     alert ("로그인이 필요합니다.")
     next ({name : "login"})
   }

  /*
  - Auth가 존재하면 next로 계속 진행, 아니면 loginPath로 이동시킨다.
  */
}


export default new Router({
  routes: [
    {
      path: '*',
      redirect: {name: 'main-page'},
    },
    {
      path: '/auth',
      component: Auth,
      children: [
        {
          path: 'login',
          name: 'login',
          component: lazyLoading('auth/login/login'),
          meta: {
            requiresAuth: false
          }
        },
        {
          path: '',
          redirect: { name: 'login' },
        }
      ]
    },
    {
      path: '/main',
      component: Main,
      children: [
        {
          path: 'snack-search',
          name: 'snack-search',
          component: lazyLoading('main/snack-search/snack-search'),
          meta: {
            requiresAuth: false
          }
        },
        {
          path: 'main-page',
          name: 'main-page',
          component: lazyLoading('main/main-page/main-page'),
          meta: {
            requiresAuth: false
          }
        },
        {
          path: 'snack-manage',
          name: 'snack-manage',
          component: Snack,
          children : [
            {
              path: 'list',
              name: 'list',
              component: lazyLoading('main/snack-manage/list/list'),
              meta: {
                requiresAuth: false
              }
            },
            {
              path: 'register',
              name: 'register',
              component: lazyLoading('main/snack-manage/register/register'),
              meta: {
                requiresAuth: false
              }
            }
          ]
        },
        {
          path: 'org-manage',
          name: 'org-manage',
          component: lazyLoading('main/org-manage/org-manage'),
          meta: {
            requiresAuth: false
          }
        },
        {
          path: '',
          redirect: { name: 'main-page' },
        }
      ]
    }
  ]
})
