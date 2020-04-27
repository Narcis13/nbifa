
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/utilizatori', component: () => import('pages/Utilizatori.vue') },
      { path: '/gestiuni', component: () => import('pages/Gestiuni.vue') },
      { path: '/categorii', component: () => import('pages/Categorii.vue') },
      { path: '/conturi', component: () => import('pages/Conturi.vue') },
      { path: '/locuri', component: () => import('pages/Locuri.vue') },
      { path: '/materiale', component: () => import('pages/Materiale.vue') },
      { path: '/documente', component: () => import('pages/Documente.vue') },
      { path: '/rap', component: () => import('pages/Rapoarte.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
