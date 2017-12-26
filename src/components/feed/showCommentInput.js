import Vue from 'vue'
import CommentInput from './components/commentInput'

const prefixCls = 'v-comment-input'
CommentInput.newInstance = properties => {
  const _props = properties || {}

  const Instance = new Vue({
    data: Object.assign({}, {
      mask: true,
      visible: true,
      placeholder: '随便说说~'
    }, _props),

    render (h) {
      let maskVNodes = []
      if (this.mask) {
        maskVNodes.push(h('div', {
          attrs: {
            class: `${prefixCls}-mask`
          },
          on: {
            'click': this.maskClick
          }
        }))
      }

      let bodyVNodes = []

      bodyVNodes.push(h('div', {
        attrs: {
          class: `${prefixCls}-wrap`
        }
      }, [h('div', {
        attrs: {
          class: `${prefixCls}`
        }
      }, [h(CommentInput, {
        props: {
          focus: this.visible,
          placeholder: this.placeholder
        },
        on: {
          'on-ok': this.ok
        }
      })])]))

      return h('div', {
        directives: [{
          name: 'show',
          value: this.visible
        }]
      }, [maskVNodes, bodyVNodes])
    },
    computed: {},
    methods: {
      maskClick () {
        this.visible = !this.visible
      },
      cancel () {
        this.$children[0].visible = false
        this.onCancel()
        this.remove()
      },
      ok (txt) {
        this.onOk(txt)
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
  const Input = Instance.$children[0]

  return {
    show (options = {}) {
      if ('onOk' in options) {
        Input.$parent.onOk = options.onOk
      }
      if ('placeholder' in options) {
        Input.$parent.placeholder = options.placeholder
      }
      Input.$parent.visible = true
    },
    remove () {
      Input.visible = false
      Input.$parent.remove()
    },
    comment: Input
  }
}

let inputInstance

function getInputInstance ({ placeholder } = {}) {
  inputInstance = inputInstance || CommentInput.newInstance({
    placeholder
  })
  return inputInstance
}

function showInput (option) {
  let instance = getInputInstance()
  instance.show(option)
}

export default {
  name: 'CommentInput',
  show (option = {}) {
    option.placeholder = option.placeholder || '随便说说~'
    return showInput(option)
  },
  remove () {
    if (!inputInstance) {
      return false
    }
    const instance = getInputInstance()
    instance.remove()
  }
}
