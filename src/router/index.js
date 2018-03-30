import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main.vue'

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: require(`../components/${file}.vue`).default
  }
}

Vue.use(Router)

const router = new Router({
  base: __dirname,
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    // route('/login', 'Login', 'login'),
    // route('/error', 'Error', 'error'),
    route('/passtest/:idtest', 'pass_test'),

    // path, file(*.vue), name, children

    route('/', 'Main', null, [
      route('/', 'Home', 'home'),
      route('/:resource', 'Grid', 'grid'),
      // route('/crud/:resource/:id/edit', 'CrudForm', 'edit'),
      route('/:resource/create', 'Form', 'create'),
      route('/:resource/affecttest', 'Affect', 'affect'),
      // route('/:resource', 'GridAffect', 'affected_grid'),
      // route('/crud/:resource/:action', 'CrudForm', 'indexAction'),
      // route('/settings', 'Settings'),
      // route('/theme', 'Theme'),
      // route('/chat', 'Chat'),
      // route('/about', 'About')
    ])

    // Global redirect for 404
    // { path: '*', redirect: '/error', query: {code: 404, message: 'Page Not Found.'} }
  ]
})

router.beforeEach((to, from, next) => {
  global.store.dispatch('checkPageTitle', to.path)
  /* eslint-disable no-undef */
  if (typeof ga !== 'undefined') {
    ga('set', 'page', to.path)
    ga('send', 'pageview')
  }
  next()
})

export default router
