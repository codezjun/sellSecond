import Vue from 'vue'
import Router from 'vue-router'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/sell'
Vue.use(Router)

export default new Router({
routes: [
    {
      path: '/',
      component: goods,
      redirect: '/goods'//用了重定向，是为了进入就有默认激活的class类名，设置导航样式。
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
]
})
