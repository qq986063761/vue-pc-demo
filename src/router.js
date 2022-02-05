import {createRouter, createWebHashHistory} from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/comment' },
    { 
      path: '/comment', 
      name: 'comment',
      component: () => import('@/views/comment.vue') 
    },
    { 
      path: '/carousel', 
      name: 'carousel',
      component: () => import('@/views/carousel.vue') 
    },
    { 
      path: '/scrollBar', 
      name: 'scrollBar',
      component: () => import('@/views/scrollBar.vue') 
    },
    { 
      path: '/scaleTool', 
      name: 'scaleTool',
      component: () => import('@/views/scaleTool.vue') 
    },
  ]
})