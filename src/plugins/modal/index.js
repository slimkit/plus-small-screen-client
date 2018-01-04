import Modal from './modalInstance'
import pay from './components/pay'
import commentInpt from './components/commentInput'

let modalInstance

function getModalInstance(render = undefined) {
  modalInstance = modalInstance || Modal.newInstance({ render })
  return modalInstance
}

function showModal(options = {}) {
  const render = ('render' in options) ? options.render : undefined
  let instance = getModalInstance(render)
  options.onRemove = function () {
    modalInstance = null
  }

  instance.show(options)
}

/**
 * 显示默认弹窗
 * @author jsonleex <jsonlseex@163.com>
 */
Modal.show = (options) => {
  return showModal(options)
}

/**
 * 移除当前弹窗
 * @author jsonleex <jsonlseex@163.com>
 */
Modal.remove = () => {
  if (!modalInstance) {
    return false
  }
  const instance = getModalInstance()
  instance.remove()
}

/**
 * 提示弹窗
 */
Modal.info = () => {
  return showModal({
    maskClosable: true
  })
}

/**
 * 支付弹窗
 * @author jsonleex <jsonlseex@163.com>
 */
Modal.pay = (options = {}) => {
  return showModal({
    render(h) {
      return h(pay, {
        on: {
          'on-close': Modal.remove
        }
      })
    }
  })
}

Modal.commentInpt = (options = {}) => {
  let onOk = () => {}
  if ('onOk' in options) {
    onOk = options.onOk
  }
  const _props = {
    maskClosable: true,
    render(h) {
      return h(commentInpt, {
        on: {
          'on-ok': onOk
        },
        props: options
      })
    }
  }
  return showModal(_props)
}

export default {
  install(vue) {
    if (this.installed) return
    vue.prototype.$Modal = Modal
    vue.prototype.$pay = Modal.pay
    vue.prototype.$ShowCommentInput = Modal.commentInpt
  }
}
