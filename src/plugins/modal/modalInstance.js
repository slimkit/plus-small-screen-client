import Vue from 'vue'
import Modal from './modal.vue'

Modal.newInstance = properties => {
  const _props = properties || {}
  const Instance = new Vue({
    data: Object.assign({}, {
      styles: {},
      visible: false,
      maskClosable: false
    }, _props),
    render(h) {
      const bodyVNodes = []
      if (this.render) {
        bodyVNodes.push(this.render(h))
      }
      return h(Modal, {
        on: {
          'on-cancel': this.remove,
          input: (status) => {
            this.visible = status
          }
        },
        props: {
          styles: this.styles,
          maskClosable: this.maskClosable
        }
      }, bodyVNodes)
    },
    methods: {
      remove() {
        this.$nextTick(this.destroy)
      },
      destroy() {
        this.$destroy()
        document.body.removeChild(this.$el)
        this.onRemove()
      },
      onRemove() {}
    }
  })

  const Parent = Instance.$mount()
  document.body.appendChild(Parent.$el)
  const modal = Instance.$children[0]

  return {
    show(props) {
      if ('maskClosable' in props) {
        Parent.maskClosable = props.maskClosable
      }
      modal.visible = true
      Parent.onRemove = props.onRemove
    },
    remove() {
      modal.visible = false
      Parent.remove()
    }
  }
}

export default Modal
