import autosize from 'autosize'
import { getStyle, getScrollTop, getScrollEventTarget } from '@/util/'
export default {
  txtautosize: {
    inserted(el) {
      autosize(el)
    },
    unbind(el) {
      autosize.destroy(el)
    }
  },
  'load-more': {
    bind: (el, binding) => {
      let windowHeight = window.screen.height
      let height
      let setTop
      let paddingBottom
      let marginBottom
      let requestFram
      let oldScrollTop
      let scrollEl
      let heightEl
      let scrollType = el.attributes.type && el.attributes.type.value
      let scrollReduce = 2
      if (scrollType === 2) {
        scrollEl = el
        heightEl = el.children[0]
      } else {
        scrollEl = getScrollEventTarget(el)
        heightEl = el
      }

      console.log(scrollEl)

      el.addEventListener('touchstart', () => {
        height = heightEl.clientHeight
        if (scrollType === 2) {
          // height = height
        }
        setTop = el.offsetTop
        paddingBottom = getStyle(el, 'paddingBottom')
        marginBottom = getStyle(el, 'marginBottom')
      }, false)

      el.addEventListener('touchmove', () => {
        loadMore()
      }, false)

      el.addEventListener('touchend', () => {
        oldScrollTop = getScrollTop(scrollEl)
        moveEnd()
      }, false)

      const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
          if (getScrollTop(scrollEl) !== oldScrollTop) {
            oldScrollTop = getScrollTop(scrollEl)
            moveEnd()
          } else {
            cancelAnimationFrame(requestFram)
            height = heightEl.clientHeight
            loadMore()
          }
        })
      }

      const loadMore = () => {
        console.log('-------------')
        console.log('sTop:', getScrollTop(scrollEl))
        console.log('Wh', windowHeight)
        console.log('-------------')
        console.log('h', height)
        console.log('setT', setTop)
        console.log('pB:', paddingBottom)
        console.log('mB:', marginBottom)
        console.log('sr:', scrollReduce)
        if (getScrollTop(scrollEl) + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
          console.log('done')
          binding.value()
        }
      }
    }
  }
}
