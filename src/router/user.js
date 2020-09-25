const routes = [
  {
    path: '/user/login',
    name: 'userLogin',
    component: () => import('../view/user/login')
  }, {
    path: '/user/setting',
    name: 'userSetting',
    component: () => import('../view/user/setting')
  }
]

export default routes