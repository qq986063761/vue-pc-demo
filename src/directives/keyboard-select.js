
// v-keyboard-select="{
//   index,
//   itemClass: 'el-select-dropdown__item',
//   onChange: onKeyBoardChange, // onKeyBoardChange({index}) {}
//   onEnter: onKeyBoardEnter
// }"
export default {
  bind(el, {value}) {
    const {index, itemClass, onChange, onEnter} = value
    el._keyboardSelect = {
      isShow: false,
      index,
      onKeyDown(event) {
        const isShow = !!(el.offsetWidth && el.offsetHeight)
        if (isShow && !el._keyboardSelect.isShow) el._keyboardSelect.index = -1
        el._keyboardSelect.isShow = isShow
        if (el._keyboardSelect.isShow) {
          const code = event.keyCode || event.which
          switch (code) {
            case 38:
            case 40:
              let currentIndex = el._keyboardSelect.index
              if (code === 38) {
                currentIndex--
                if (currentIndex < -1) return
              } else {
                currentIndex++
              }
              // 对看不到的元素重新滚动定位到指定位置
              if (itemClass) {
                const children = el.querySelectorAll('.' + itemClass)
                if (children) {
                  const rsEl = children[currentIndex]
                  if (rsEl) {
                    const rect = el.getBoundingClientRect()
                    const rsElRect = rsEl.getBoundingClientRect()
                    if (rsElRect.top >= rect.bottom) {
                      el.scrollTop += rsElRect.height * 2
                    } else if (rsElRect.bottom <= rect.top) {
                      el.scrollTop -= rsElRect.height * 2
                    }
                  } else if (currentIndex > children.length) {
                    return
                  }
                }
              }
              onChange && onChange({
                index: currentIndex
              })
              break
            case 13:
              onEnter && onEnter()
              break
          }
        }
      }
    }
    document.addEventListener('keydown', el._keyboardSelect.onKeyDown)
  },
  componentUpdated(el, {value}, vnode, oldVnode) {
    const {index} = value
    el._keyboardSelect.index = index
  },
  unbind(el) {
    document.removeEventListener('keydown', el._keyboardSelect.onKeyDown)
  }
}