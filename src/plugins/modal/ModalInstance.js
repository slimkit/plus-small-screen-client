import Vue from 'vue'
import Modal from './modal.vue'

const prefixCls = 'v-modal-confirm'

Modal.newInstance = properties => {
  const _props = properties || {}

  const Instance = new Vue({
    data: Object.assign({}, _props, {
      visible: false,
      width: 100,
      title: '',
      body: '',
      okText: undefined,
      cancelText: undefined,
      showOk: false,
      showCancel: false,
      loading: false,
      buttonLoading: false,
      scrollable: false
    }),
    render (h) {
      let footerVNodes = []
      if (this.showCancel || this.showOk) {
        if (this.showOk) {
          footerVNodes.push(h('button', {
            on: {
              click: this.ok
            }
          }, this.localeOkText))
        }
        if (this.showCancel) {
          footerVNodes.push(h('button', {
            on: {
              click: this.cancel
            }
          }, this.localeCancelText))
        }
      }

      // render content
      let bodyRender
      if (this.render) {
        bodyRender = h('div', {
          attrs: {
            class: `${prefixCls}-body ${prefixCls}-body-render`
          }
        }, [this.render(h)])
      } else {
        bodyRender = h('div', {
          attrs: {
            class: `${prefixCls}-body`
          }
        }, [h('div', {
          attrs: {
            class: `${prefixCls}-head`
          }
        }, [
          h('div', {
            attrs: {
              class: `${prefixCls}-head-title`
            },
            domProps: {
              innerHTML: this.title
            }
          })
        ]), h('div', {
          domProps: {
            innerHTML: this.body
          }
        })])
      }

      return h(Modal, {
        props: Object.assign({}, _props, {
          width: this.width,
          scrollable: this.scrollable
        }),
        domProps: {
          value: this.visible
        },
        on: {
          input: (status) => {
            this.visible = status
          }
        }
      }, [
        h('div', {
          attrs: {
            class: prefixCls
          }
        }, [
          bodyRender,
          h('div', {
            attrs: {
              class: `${prefixCls}-footer`
            }
          }, footerVNodes)
        ])
      ])
    },
    computed: {
      localeOkText () {
        if (this.okText) {
          return this.okText
        } else {
          return '确定'
        }
      },
      localeCancelText () {
        if (this.cancelText) {
          return this.cancelText
        } else {
          return '取消'
        }
      }
    },
    methods: {
      cancel () {
        this.$children[0].visible = false
        this.buttonLoading = false
        this.onCancel()
        this.remove()
      },
      ok () {
        if (this.loading) {
          this.buttonLoading = true
        } else {
          this.$children[0].visible = false
          this.remove()
        }
        this.onOk()
      },
      remove () {
        setTimeout(() => {
          this.destroy()
        }, 300)
      },
      destroy () {
        this.$destroy()
        document.body.removeChild(this.$el)
        this.onRemove()
      },
      onOk () {},
      onCancel () {},
      onRemove () {}
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const modal = Instance.$children[0]

  return {
    show (props) {
      modal.$parent.showOk = props.showOk
      modal.$parent.showCancel = props.showCancel

      if ('width' in props) {
        modal.$parent.width = props.width
      }

      if ('title' in props) {
        modal.$parent.title = props.title
      }

      if ('content' in props) {
        modal.$parent.body = props.content
      }

      if ('okText' in props) {
        modal.$parent.okText = props.okText
      }

      if ('cancelText' in props) {
        modal.$parent.cancelText = props.cancelText
      }

      if ('onCancel' in props) {
        modal.$parent.onCancel = props.onCancel
      }

      if ('onOk' in props) {
        modal.$parent.onOk = props.onOk
      }

      // async for ok
      if ('loading' in props) {
        modal.$parent.loading = props.loading
      }

      if ('scrollable' in props) {
        modal.$parent.scrollable = props.scrollable
      }

      // notice when component destroy
      modal.$parent.onRemove = props.onRemove

      modal.visible = true
    },
    remove () {
      modal.visible = false
      modal.$parent.remove()
    },
    component: modal
  }
}

export default Modal
