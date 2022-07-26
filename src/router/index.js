import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/Login.vue'
import LoggedInLayout from '@/views/LoggedInLayout.vue'
import Dashboard from '@/views/system/Dashboard.vue'
import Kategori from '@/views/system/Kategori.vue'
import Rekap from '@/views/system/Rekap.vue'
import Mitra from '@/views/system/Mitra.vue'
import Form from '@/views/system/Form.vue'
import Hutang from '@/views/system/Hutang.vue'
import Pengaturan from '@/views/system/Pengaturan.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '',
    component: LoggedInLayout,
    children:[
      {
        title : 'Dashboard',
        path: '',
        name: 'dashboard',
        component: Dashboard,
      },
      {
        title : 'Form',
        path: '/form',
        name: 'form',
        component: Form,
      },
      {
        title : 'Hutang',
        path: '/hutang',
        name: 'hutang',
        component: Hutang,
      },
      {
        title : 'Rekap',
        path: '/rekap',
        name: 'rekap',
        component: Rekap,
      },
      {
        title : 'Kategori',
        path: '/kategori',
        name: 'kategori',
        component: Kategori,
      },
      {
        title : 'Mitra',
        path: '/mitra',
        name: 'mitra',
        component: Mitra,
      },
      {
        title : 'Pengaturan',
        path: '/pengaturan',
        name: 'pengaturan',
        component: Pengaturan,
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
