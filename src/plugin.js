import CommentInput from './components/CommentInput.vue'
import ScrollBar from '@/components/ScrollBar.vue'
import ScaleTool from '@/components/ScaleTool.vue'
// import drClick from '../directives/dr-click'

export default {
  install(Vue, opts) {
    Vue.component(CommentInput.name, CommentInput)
    Vue.component(ScrollBar.name, ScrollBar)
    Vue.component(ScaleTool.name, ScaleTool)
    // Vue.directive('dr-click', drClick)
  }
}