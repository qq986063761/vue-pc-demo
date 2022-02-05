// 防重复点击
export default {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      if (!el.disabled) {
        el.disabled = true
        const preCursor = el.style.cursor
        el.style.cursor = 'not-allowed'
        setTimeout(() => {
          el.style.cursor = preCursor
          el.disabled = false
        }, 300)
      }
    })
  }
}