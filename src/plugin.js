import CommentInput from './components/CommentInput.vue'
import ScrollBar from '@/components/ScrollBar.vue'
import ScaleTool from '@/components/ScaleTool.vue'
import disableRepeatClick from '@/directives/disable-repeat-click'
import drag from '@/directives/drag'
import reasonableActiveItem from '@/directives/reasonable-active-item'

export default {
  install(app, opts) {
    app.component(CommentInput.name, CommentInput)
    app.component(ScrollBar.name, ScrollBar)
    app.component(ScaleTool.name, ScaleTool)
    app.directive('disable-repeat-click', disableRepeatClick)
    app.directive('drag', drag)
    app.directive('reasonable-active-item', reasonableActiveItem)
  }
}