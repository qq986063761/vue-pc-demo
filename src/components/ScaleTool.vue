<template>
  <div class="scale-tool" :style="{width: width + 'px'}">
    <div 
      class="window" 
      :class="{close: isClose}" 
      :style="{height: height + 'px'}"
      @mousemove="onMouseMove">
      <div class="window-content" v-show="!isClose">
        <div class="target" :class="{center: type === 'tb'}" :style="targetStyle">
          <div class="target-item" 
            v-for="(item, i) in data" 
            :key="i"
            :style="targetItemStyle">
          </div>
        </div>
        <div
          class="drag-window"
          :class="{dragging: dragging}"
          :style="dragWinStyle"
          @mousedown="onMouseDown">
        </div>
      </div>
    </div>
    <div class="scale-toolbar">
      <div class="btn-fold-box">
        <div 
          class="btn-fold iconfont icon-arrow-down" 
          :class="{close: isClose}"
          @click="isClose = !isClose">
        </div> 
      </div>
      <div class="scale">
        <div class="btn-minus el-icon-remove-outline" @click="changeScale(false)">-</div>
        <div class="text">{{scaleVal}}%</div>
        <div class="btn-add el-icon-circle-plus-outline" @click="changeScale(true)">+</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {debounce} from 'throttle-debounce'
  import {addResizeListener, removeResizeListener} from '@/assets/dom'

  export default {
    name: 'scaleTool',
    props: {
      data: {
        type: Array,
        default: () => []
      },
      // tb：从上到下 tree 形布局，默认从左到右 tree 形布局
      type: String,
      scroller: HTMLElement,
      content: HTMLElement,
    },
    data() {
      return {
        dragging: false,
        // 窗口宽高
        width: 180,
        height: 86,
        // 是否折叠
        isClose: false,
        // 拖拽窗口和目标样式
        dragWinStyle: null,
        targetStyle: null,
        targetItemStyle: null,
        // 缩放值
        scaleVal: 100,
      }
    },
    watch: {
      scroller(val, oldVal) {
        this.offScrollerEvents(oldVal)
        this.init({init: true}) 
      },
      content(val, oldVal) {
        this.offContentEvents(oldVal)
        this.init({init: true})
      },
      data: {
        handler(val) {
          this.setTargetItemStyle()
        },
        immediate: true
      }
    },
    methods: {
      onMouseDown(event) {
        this.dragging = true
        this.clicked = true // 表示我点过这个界面了，需要控制一些逻辑
        
        this.startX = event.clientX
        this.startY = event.clientY
        this.startOffsetX = this.offsetX
        this.startOffsetY = this.offsetY

        document.body.addEventListener('mouseup', this.onMouseUp)
      },
      onMouseMove(event) {
        if (!this.dragging) return

        const diffX = event.clientX - this.startX
        const diffY = event.clientY - this.startY
        let offsetX = this.startOffsetX + diffX
        let offsetY = this.startOffsetY + diffY
        
        // 避免移出边界
        if (offsetX < 0) {
          offsetX = 0
        } else if (offsetX > (this.width - this.dragWinWidth)) {
          offsetX = this.width - this.dragWinWidth
        }

        if (offsetY < 0) {
          offsetY = 0
        } else if (offsetY > (this.height - this.dragWinHeight)) {
          offsetY = this.height - this.dragWinHeight
        }

        // 更新窗口样式
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.updateWin()

        // 同步更新内容样式（这里要取反）
        this.contentOffsetX = (this.offsetX - this.initOffsetX) / -this.scale
        this.contentOffsetY = (this.offsetY - this.initOffsetY) / -this.scale
        this.updateContent()
      },
      onMouseUp(event) {
        this.dragging = false
        this.scroller.style.cursor = 'grab'
        this.scroller.removeEventListener('mousemove', this.onContentMouseMove)
        document.body.removeEventListener('mouseup', this.onMouseUp)

        setTimeout(() => {
          window.isDragged = false
        }, 200)
      },
      onWheel(event) {
        const {deltaY} = event
        // 内容向上滚动
        if (deltaY) {
          let contentOffsetY = this.contentOffsetY - deltaY
          let offsetY = contentOffsetY * -this.scale + this.initOffsetY
          // 避免移出边界
          if (offsetY < 0) {
            offsetY = 0
            contentOffsetY = (offsetY - this.initOffsetY) / -this.scale
          } else if (offsetY > (this.height - this.dragWinHeight)) {
            offsetY = this.height - this.dragWinHeight
            contentOffsetY = (offsetY - this.initOffsetY) / -this.scale
          }
          
          // 同步更新窗口样式
          this.offsetY = offsetY
          this.updateWin()

          this.contentOffsetY = contentOffsetY
          this.updateContent()
        }
      },
      onContentMouseMove(event) {
        if (!this.dragging) return

        this.scroller.style.cursor = 'grabbing'
        const diffX = event.clientX - this.contentStartX
        const diffY = event.clientY - this.contentStartY

        // 这里给一个全局的标识是经过了拖拽的标识，让外部自己避免和点击冲突
        if (Math.abs(diffX) > 100 || Math.abs(diffY) > 100) {
          window.isDragged = true
        }

        let contentOffsetX = this.contentStartOffsetX + diffX
        let contentOffsetY = this.contentStartOffsetY + diffY

        // 同步更新窗口样式
        let offsetX = contentOffsetX * -this.scale + this.initOffsetX
        let offsetY = contentOffsetY * -this.scale + this.initOffsetY

        // 避免移出边界
        if (offsetX < 0) {
          offsetX = 0
          contentOffsetX = (offsetX - this.initOffsetX) / -this.scale
        } else if (offsetX > (this.width - this.dragWinWidth)) {
          offsetX = this.width - this.dragWinWidth
          contentOffsetX = (offsetX - this.initOffsetX) / -this.scale
        }

        if (offsetY < 0) {
          offsetY = 0
          contentOffsetY = (offsetY - this.initOffsetY) / -this.scale
        } else if (offsetY > (this.height - this.dragWinHeight)) {
          offsetY = this.height - this.dragWinHeight
          contentOffsetY = (offsetY - this.initOffsetY) / -this.scale
        }

        this.contentOffsetX = contentOffsetX
        this.contentOffsetY = contentOffsetY
        this.updateContent()

        this.offsetX = offsetX
        this.offsetY = offsetY
        this.updateWin()
      },
      onContentMouseDown(event) {
        this.dragging = true
        this.clicked = true // 表示我点过这个界面了，需要控制一些逻辑
        
        this.contentStartX = event.clientX
        this.contentStartY = event.clientY
        this.contentStartOffsetX = this.contentOffsetX
        this.contentStartOffsetY = this.contentOffsetY

        this.scroller.addEventListener('mousemove', this.onContentMouseMove)
        document.body.addEventListener('mouseup', this.onMouseUp)
      },
      // 更新实际内容的
      updateContent(opts) {
        const {animate} = opts || {}
        if (this.content) {
          this.style = {
            'minWidth': '100%',
            'minHeight': '100%',
            'transform': `
              scale(${this.scaleVal / 100}) translate3d(${this.contentOffsetX}px, ${this.contentOffsetY}px, 0)
            `,
            'transform-origin': 'left top',
            'transition': animate ? 'all 0.3s ease-in-out' : ''
          }
          Object.assign(this.content.style, this.style)
        } else {
          console.error('props content 不存在')
        }
      },
      setScale(val) {
        this.scaleVal = val
        this.updateContent()
      },
      // 更改缩放
      changeScale(isAdd) {
        if (isAdd) {
          this.scaleVal += 10
        } else {
          this.scaleVal -= 10
        }
        if (this.scaleVal > 150) {
          this.scaleVal = 150
        } else if (this.scaleVal < 0) {
          this.scaleVal = 0
        }
        this.updateContent({animate: true})
      },
      // 销毁滚容容器事件
      offScrollerEvents(scroller) {
        if (!scroller) return
        scroller.removeEventListener('wheel', this.onWheel)
        scroller.removeEventListener('mousedown', this.onContentMouseDown)
        scroller.removeEventListener('mousemove', this.onContentMouseMove)
      },
      offContentEvents(content) {
        if (!content) return
        removeResizeListener(content, this.onResize)
      },
      updateWin() {
        this.dragWinStyle = {
          ...(this.dragWinStyle || {}),
          'transform': `translate3d(${this.offsetX}px, ${this.offsetY}px, 0)`
        }
      },
      setTargetItemStyle() {
        this.targetItemStyle = {
          width: `${230 * this.scale}px`,
          height: `${this.data.length <= 1 ? 25 : (this.targetHeight / this.data.length)}px`
        }
      },
      initWin() {
        let contentWidth = this.content.offsetWidth
        let contentHeight = this.content.offsetHeight
        let dragWinWidth = this.scroller.offsetWidth
        let dragWinHeight = this.scroller.offsetHeight

        let scaleWRatio = (this.width - 40) / contentWidth
        let scaleHRatio = (this.height - 20) / contentHeight
        this.scale = Math.min(scaleWRatio, scaleHRatio)
       
        this.targetWidth = contentWidth * this.scale
        this.targetHeight = contentHeight * this.scale
        this.targetStyle = {
          width: `${this.targetWidth}px`,
          height: `${this.targetHeight}px`,
        }

        // 实际上缩小后的窗口宽高
        this.dragWinWidth = dragWinWidth * this.scale
        this.dragWinHeight = dragWinHeight * this.scale
        this.dragWinStyle = {
          ...(this.dragWinStyle || {}),
          left: 0,
          top: 0,
          width: `${this.dragWinWidth}px`,
          height: `${this.dragWinHeight}px`,
        }

        this.initOffsetX = (this.width - this.targetWidth) / 2
        this.initOffsetY = (this.height - this.targetHeight) / 2

        this.setTargetItemStyle()

        // 如果我没有对界面做过任何操作导致的内容大小变化，则初始化窗口位置
        if (!this.clicked) {
          this.offsetX = this.initOffsetX
          this.offsetY = this.initOffsetY

          // 如果从上到下默认布局初始化移动到中间
          if (this.type === 'tb') {
            this.offsetX += (this.targetWidth - this.dragWinWidth) / 2
            this.contentOffsetX = (this.offsetX - this.initOffsetX) / -this.scale
          }

          this.updateWin()
          this.updateContent()
        }
      }
    },
    mounted() {
      this.init = debounce(200, opts => {
        const {init} = opts || {}
        
        if (!this.scroller && !this.content) {
          console.error('props scroller 和 content 不存在')
          return
        }

        this.clicked = false
        this.offsetX = 0
        this.offsetY = 0
        this.contentOffsetX = 0
        this.contentOffsetY = 0
        this.scaleVal = 100
        
        // 内部自己初始化的时候，才需要重新绑定事件
        if (init) {
          // 覆盖滚动容器样式，监听事件
          this.scroller.style.userSelect = 'none'
          this.scroller.style.overflow = 'hidden'
          this.scroller.style.cursor = 'grab'
          this.scroller.addEventListener('wheel', this.onWheel)
          this.scroller.addEventListener('mousedown', this.onContentMouseDown)
          addResizeListener(this.content, this.onResize)
        }

        this.initWin()
      })
      
      this.onResize = debounce(200, () => {
        this.initWin()
      })

      this.init({init: true})
    },
    beforeDestroy() {
      this.offScrollerEvents(this.scroller)
      this.offContentEvents(this.content)
      document.body.removeEventListener('mouseup', this.onMouseUp)
    }
  }
</script>

<style lang="scss">
  .scale-tool {
    position: absolute;
    left: 30px;
    bottom: 20px;
    z-index: 100;
    box-shadow: 0 5px 10px 0 rgba(56,62,68,0.16);
    border-radius: 4px;
    overflow: hidden;
    .window {
      position: relative;
      background: #B6C1D2;
      transition: all .2s ease;
      user-select: none;
      .window-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      &.close {
        height: 0 !important;
        pointer-events: none;
      }
      .drag-window {
        position: absolute;
        background: rgba(255,255,255,0.24);
        border: 1px solid #e8ebf1;
        border-radius: 2px;
        z-index: 2;
        cursor: grab;
        &.dragging {
          cursor: grabbing;
        }
      }
      .target {
        &.center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .target-item {
          &:after {
            display: block;
            height: 60%;
            width: 100%;
            background: #FFFFFD;
            content: '';
          }
        }
      }
    }
    .scale-toolbar {
      display: flex;
      padding: 7px 0;
      background-color: #fff;
      .btn-fold-box {
        display: flex;
        align-items: center;
        padding: 0 16px;
        border-right: 1px solid #e1e1e1;
      }
      .btn-fold {
        width: 14px;
        height: 14px;
        text-align: center;
        line-height: 14px;
        border: 1px solid rgba(26,31,38,0.80);
        flex-shrink: 0;
        cursor: pointer;
        &:before {
          display: block;
          transform: scale(0.6) rotate(45deg);
          color: rgba(26,31,38,0.80);
          font-size: 12px;
          font-weight: bold;
          transition: all .2s ease;
        }
        &:hover {
          border-color: blue;
          &:before {
            color: blue;
          }
        }
        &.close {
          &:before {
            transform: scale(0.6) rotate(225deg);
          }
        }
      }
      .scale {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 14px;
        flex: 1;
        overflow: hidden;
        font-size: 16px;
        color: rgba(26,31,38,0.80);
        white-space: nowrap;
        .btn-minus,
        .btn-add {
          color: #666;
          cursor: pointer;
          font-size: 16px;
          color: rgba(26,31,38,0.80);
          letter-spacing: 1px;
          &:hover {
            color: blue;
          }
        }
      }
    }
  }
</style>