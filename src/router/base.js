const routes = [
    {
      path: '/base/supplier',
      name: 'baseSupplier',
      component: () => import('../view/base/supplier')
    }, {
      path: '/base/freight',
      name: 'baseFreight',
      component: () => import('../view/base/freight')
    }, {
      path: '/base/price',
      name: 'basePrice',
      component: () => import('../view/base/price')
    }
  ]
  
  export default routes