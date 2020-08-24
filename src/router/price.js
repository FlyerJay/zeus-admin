const routes = [
    {
      path: '/price/search',
      name: 'priceSearch',
      component: () => import('../view/price/search')
    }, {
      path: '/price/batch',
      name: 'priceBatch',
      component: () => import('../view/price/batch')
    }
  ]
  
  export default routes