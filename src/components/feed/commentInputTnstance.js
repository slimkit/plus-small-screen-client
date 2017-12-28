import Vue from 'vue'
import CommentInput from './components/commentInput'

const prefixCls = 'v-comment-input'

CommentInput.newInstance = properties => {
  const _props = properties || {}

  const Instance = new Vue({
    data: Object.assign({}, {
      visible: true,
      loading: false,
      placeholder: '随便说说~'
    }, _props),

    render(h) {
      let maskVNodes = []
      maskVNodes.push(h('div', {
        attrs: {
          class: `${prefixCls}-mask`
        },
        on: {
          'click': this.maskClick
        }
      }))

      let bodyVNodes = []

      bodyVNodes.push(h('div', {
        attrs: {
          class: `${prefixCls}-wrap`
        }
      }, [h(CommentInput, {
        class: `${prefixCls}`,
        props: {
          loading: this.loading,
          focus: this.visible,
          placeholder: this.placeholder
        },
        on: {
          'on-ok': this.ok
        }
      })]))

      return h('div', {
        directives: [{
          name: 'show',
          value: this.visible
        }]
      }, [maskVNodes, bodyVNodes])
    },
    computed: {},
    methods: {
      maskClick() {
        this.visible = !this.visible
      },
      cancel() {
        this.onCancel()
        this.remove()
      },
      ok(txt) {
        this.loading = true
        this.onOk(txt, () => {
          this.loading = false
          this.cancel()
        })
      },
      remove() {
        this.$nextTick(() => {
          this.destroy()
        })
      },
      destroy() {
        this.$destroy()
        document.body.removeChild(this.$el)
        this.onRemove()
      },
      onOk() {},
      onCancel() {},
      onRemove() {}
    }
  })

  const Parent = Instance.$mount()
  document.body.appendChild(Parent.$el)
  const Input = Instance.$children[0]

  return {
    show(props) {
      if ('onOk' in props) {
        Parent.onOk = props.onOk
      }
      if ('placeholder' in props) {
        Parent.placeholder = props.placeholder
      }
      Parent.onRemove = props.onRemove
      Parent.visible = true
    },
    remove() {
      Parent.remove()
    },
    components: Input
  }
}

export default CommentInput
