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
      path: '/suspendScrollbar', 
      name: 'suspendScrollbar',
      component: () => import('@/views/suspendScrollbar.vue') 
    },
    { 
      path: '/scaleTool', 
      name: 'scaleTool',
      component: () => import('@/views/scaleTool/scaleTool.vue') 
    },
    { 
      path: '/disableRepeatClick', 
      name: 'disableRepeatClick',
      component: () => import('@/views/disableRepeatClick.vue') 
    },
    { 
      path: '/drag', 
      name: 'drag',
      component: () => import('@/views/drag.vue') 
    },
    { 
      path: '/reasonableActiveItem', 
      name: 'reasonableActiveItem',
      component: () => import('@/views/reasonableActiveItem.vue') 
    },
    { 
      path: '/inputDirective', 
      name: 'inputDirective',
      component: () => import('@/views/inputDirective.vue') 
    },
  ]
})