// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// export default router
import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/auth"

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Products.vue"),
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: () => import("../views/ProductDetail.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: () => import("../views/Checkout.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/auth/Register.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: () => import("../views/admin/Dashboard.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    // path: "/admin/products",
    // name: "AdminProducts",
    // component: () => import("../views/admin/Products.vue"),
    // meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next("/")
  } else {
    next()
  }
})

export default router
