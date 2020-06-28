const userLogin = () => import('../view/user/login')

const routes = [
  {
    path: '/user/login',
    name: 'userLogin',
    component: userLogin
  }
]

export default routes