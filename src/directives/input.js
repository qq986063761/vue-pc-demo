function getValByVnode(vnode, isComponent) {
  // 不是组件的时候，需要找到 v-model 指令的 value，目前发现 item.dir.created 钩子是这时候独有的
  return (isComponent ? vnode.props.value : vnode.dirs.find(item => item.dir.created).value) || ''
}

function check(el, {value}, vnode, oldVnode, type) {
  if (value === false) return
  
  const isComponent = vnode.ref // 原生 input 没有 ref
  const val = getValByVnode(vnode, isComponent) 
  if (!val) return // 空值不用检查
  // 值没有变则不用检测，失焦是要检查的不用做旧值判断
  if (oldVnode && type !== 'blur') {
    const oldVal = getValByVnode(oldVnode, isComponent)
    if (val === oldVal) return
  }

  // 原生 input 没有 ref isComponent ? vnode.ref.i.proxy
  const proxy = {
    setValue(val) {
      // v-model:value 绑定的方法是 onUpdate:value，v-model 绑定的方法是 onUpdate:modelValue
      (vnode.props['onUpdate:modelValue'] || vnode.props['onUpdate:value'])(val)
    }
  }

  const {minus, decimal, length, max, min} = value || {}
  const num = Number(val)
  const valStr = val ? String(val) : ''
  
  // 只针对失焦后的检查
  if (type === 'blur') {
    // 一直只有一个负号
    if (minus && valStr === '-') {
      proxy.setValue('')
      return
    }
    // 最大值、最小值
    if (max && num > max) {
      proxy.setValue(max)
      return
    }
    if (min && num < min) {
      proxy.setValue(min)
      return
    }
  } else {
    // 负数
    if (minus && valStr[0] === '-') {
      if (valStr.length > 1 && isNaN(num)) {
        proxy.setValue('')
        return false
      }
    } else if (isNaN(num)) { // 数字
      proxy.setValue('')
      return false
    } else if (length && valStr.length > length) {
      proxy.setValue(valStr.slice(0, length))
      return false
    }

    // 小数
    if (decimal === false && valStr.includes('.')) {
      proxy.setValue('')
      return false
    } else if (decimal && typeof decimal === 'number' && valStr.includes('.')) {
      // 小数精度
      const decimalVal = valStr.split('.')[1] || ''
      if (decimalVal.length > decimal) {
        const intVal = valStr.split('.')[0]
        proxy.setValue(intVal + '.' + decimalVal.slice(0, decimal))
        return
      }
    }
  }
}

function initEvents(el, binding, vnode, oldVnode) {
  el._inputDirParams = {el, binding, vnode, oldVnode}
  if (el._onBlur) return

  // 处理一些输入过程中无法处理的事情
  el._onBlur = function () {
    check(
      el._inputDirParams.el, 
      el._inputDirParams.binding, 
      el._inputDirParams.vnode, 
      el._inputDirParams.oldVnode,
      'blur'
    )
  }
  el.addEventListener('blur', el._onBlur)
}

export default {
  mounted(el, binding, vnode, oldVnode) {
    if (binding.value !== false) initEvents(el, binding, vnode, oldVnode)
    check(el, binding, vnode, oldVnode)
  },
  updated(el, binding, vnode, oldVnode) {
    if (binding.value === false) {
      el.removeEventListener('blur', el._onBlur)
      el._onBlur = null
    } else {
      initEvents(el, binding, vnode, oldVnode)
    }
    check(el, binding, vnode, oldVnode)
  },
  unmounted(el) {
    el.removeEventListener('blur', el._onBlur)
    el._onBlur = null
    el._inputDirParams = null
  }
}