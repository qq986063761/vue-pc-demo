import { on, off } from '@/assets/js/utils.js'

// 元素可拖拽
export default {
  inserted(el, { value }) {
    // const {  } = value || {}
    
    el._init = function () {
      el._helper = {
        el, // 实际上要改变样式的元素，可能拖拽的手柄元素和实际上的元素会有不同
        x: 0,
        y: 0
      }

      if (el._helper.el.style.transform) {
        el._helper.el.style.transform = ''
      }
    }

    el._init()
    el._onMouseDown = function (event) {
      el._helper.draging = true

      el._helper.preX = el._helper.x
      el._helper.preY = el._helper.y
      el._helper.startX = -el._helper.x + event.clientX
      el._helper.startY = -el._helper.y + event.clientY

      on(document, 'mousemove', el._onMouseMove)
      on(document, 'mouseup', el._onMouseUp)
    }

    el._onMouseUp = function (event) {
      el._helper.draging = false

      off(document, 'mousemove', el._onMouseMove)
      off(document, 'mouseup', el._onMouseUp)
    }

    el._onMouseMove = function (event) {
      if (!el._helper.draging) return

      const nextX = el._helper.dir === 'v' ? 0 : event.clientX - el._helper.startX
      const nextY = el._helper.dir === 'h' ? 0 : event.clientY - el._helper.startY

      if (el._helper.initX + nextX < 0 || el._helper.initX + nextX + el._helper.el.offsetWidth > window.innerWidth) return
      if (el._helper.initY + nextY < 0 || el._helper.initY + nextY + el._helper.el.offsetHeight > window.innerHeight) return

      el._helper.x = nextX
      el._helper.y = nextY

      el._helper.el.style.transform = `translate3d(${el._helper.x}px, ${el._helper.y}px, 0)`
    }
    
    on(el, 'mousedown', el._onMouseDown)
  },
  unbind(el) {
    off(el, 'mousedown', el._onMouseDown)
    off(document, 'mousemove', el._onMouseMove)
    off(document, 'mouseup', el._onMouseUp)
  }
}