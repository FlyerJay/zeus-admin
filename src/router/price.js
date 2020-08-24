const routes = [
    {
      path: '/price/search',
      name: 'priceSearch',
      component: () => import('../view/price/search')
    }, {
      path: '/price/batch',
      name: 'priceBatch',
      component: () => import('../view/price/batch')
    }, {
      path: '/price/cart',
      name: 'priceCart',
      component: () => import('../view/price/cart')
    }, {
      path: '/price/order',
      name: 'priceOrder',
      component: () => import('../view/price/order')
    }
  ]
  
  export default routes