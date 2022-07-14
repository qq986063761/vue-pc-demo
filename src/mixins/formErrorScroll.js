import { getScrollParents, scrollTop } from '@/assets/dom'

export default {
  methods: {
    scrollToError(errorEl) {
      const el = errorEl || this.$el
      // 找到所有可以滚动的父元素，根据情况判断哪个滚动元素垂直滚动，哪个滚动元素水平滚动
      const scrollers = getScrollParents(el)
      let isScrollX = false // 是否有滚动过水平方向
      let isScrollY = false // 是否有滚动过垂直方向
      scrollers.forEach(scroller => {
        const scrollRect = scroller.getBoundingClientRect()
        const errorRect = el.getBoundingClientRect()
        // 如果存在左右可以滚动的容器，就滚动到左右合适位置
        if (!isScrollX && 
            scroller.scrollWidth > scroller.clientWidth && 
            (errorRect.left > scrollRect.right || errorRect.right < scrollRect.left)) {
          scroller.scrollLeft = scroller.scrollLeft + errorRect.left - scrollRect.left - 10
          isScrollX = true
        }
        // 如果存在上下可以滚动的容器，就滚动到左右合适位置
        if (!isScrollY && 
          scroller.scrollHeight > scroller.clientHeight && 
          (errorRect.top > scrollRect.bottom || errorRect.bottom < scrollRect.top)) {
          scrollTop(scroller, scroller.scrollTop, scroller.scrollTop + errorRect.top - scrollRect.top - 10)
          isScrollY = true
        }
      })
    }
  },
  updated() {
    if (!this.elClassName) this.elClassName = ''
    // 如果当前组件因为表单校验导致报错，则滚动到可视区域
    if (!this.elClassName.includes('is-error') && this.$el.className.includes('is-error')) {
      this.scrollToError()
    }
    this.elClassName = this.$el.className
  },
}