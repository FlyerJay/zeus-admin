const routes = [
    {
        path: '/manage/member',
        name: 'manageMember',
        component: () => import('../view/manage/member')
    }, {
        path: '/manage/role',
        name: 'manageRole',
        component: () => import('../view/manage/role')
    }
]
export default routes
