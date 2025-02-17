import { createRouter, createWebHistory } from 'vue-router'
import * as page from '../pages'
import adminRoutes from '../admin/adminRoutes'

const routes = [
  { path: '/', component: page.Home },
  { path: '/products', component: page.Products },
  { path: '/product/:id', component: page.Product },
  { path: '/cart', component: page.Cart },
  { path: '/login', component: page.Login },
  { path: '/register', component: page.Register },
  { path: '/profile', component: page.Profile },
  { path: '/checkout', component: page.Checkout },
  { path: '/receipt/:id', component: page.Receipt },
  ...adminRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log('Navigating to:', to.path);
    return { top: 0 };
  },
})

export default router;
