import {closest} from '@/assets/dom'

// 元素可拖拽
export default {
  mounted(el, { value }) {
    if (value === false) return
    el.style.cursor = 'all-scroll'
    // 如果最终变位置的元素不是拖拽元素本身，而是祖先容器
    const { container } = value || {}
    let containerEl = null
    if (container) containerEl = closest(el, container)
    el._init = function () {
      el._helper = {
        el: containerEl || el, // 实际上要改变样式的元素，可能拖拽的手柄元素和实际上的元素会有不同
        x: 0,
        y: 0
      }
      el._helper.el.style.transition = 'unset'
      const rect = el._helper.el.getBoundingClientRect()
      el._helper.initX = rect.left
      el._helper.initY = rect.top
      if (el._helper.el.style.transform) el._helper.el.style.transform = ''
    }
    el._onMouseDown = function (event) {
      if (el._isDisableDrag) return

      el._helper.draging = true

      el._helper.preX = el._helper.x
      el._helper.preY = el._helper.y
      el._helper.startX = -el._helper.x + event.clientX
      el._helper.startY = -el._helper.y + event.clientY
      
      el._helper.bodyUserSelect = document.body.style.userSelect
      document.body.style.userSelect = 'none'

      document.addEventListener('mousemove', el._onMouseMove)
      document.addEventListener('mouseup', el._onMouseUp)
    }
    el._onMouseUp = function (event) {
      el._helper.draging = false
      document.body.style.userSelect = el._helper.bodyUserSelect
      document.removeEventListener('mousemove', el._onMouseMove)
      document.removeEventListener('mouseup', el._onMouseUp)
    }
    el._onMouseMove = function (event) {
      if (!el._helper.draging) return

      const nextX = el._helper.dir === 'v' ? 0 : event.clientX - el._helper.startX
      const nextY = el._helper.dir === 'h' ? 0 : event.clientY - el._helper.startY
      // if (el._helper.preX > nextX && el._helper.initX + nextX < 0 ||
      //   el._helper.preX < nextX && el._helper.initX + nextX + el._helper.el.offsetWidth > window.innerWidth) return
      // if (el._helper.preY > nextY && el._helper.initY + nextY < 0 ||
      //   el._helper.preY < nextY && el._helper.initY + nextY + el._helper.el.offsetHeight > window.innerHeight) return

      el._helper.x = nextX
      el._helper.y = nextY

      el._helper.el.style.transform = `translate3d(${el._helper.x}px, ${el._helper.y}px, 0)`
    }
    el.addEventListener('mousedown', el._onMouseDown)
    el._init()
  },
  updated(el, {value}, vnode, oldVnode) {
    el._isDisableDrag = value === false
  },
  unmounted(el) {
    el.removeEventListener('mousedown', el._onMouseDown)
    document.removeEventListener('mousemove', el._onMouseMove)
    document.removeEventListener('mouseup', el._onMouseUp)
  }
}
