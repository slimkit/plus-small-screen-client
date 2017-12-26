import PostMenu from './postMenu'

const
  menus = [{
    label: '文字',
    icon: 'wenzi',
    cls: 'wenzi',
    path: '/post/wenzi'
  }, {
    label: '图片',
    icon: 'pic',
    cls: 'pic',
    path: '/post/pic'
  }, {
    label: '投稿',
    icon: 'tougao',
    cls: 'tougao',
    path: '/post/release'
  }, {
    label: '签到',
    icon: 'check-in',
    cls: 'check-in',
    path: '/post/checkin'
  }, {
    label: '提问',
    icon: 'check-in',
    cls: 'check-in',
    path: '/post/checkin'
  }, {
    label: '发帖',
    icon: 'check-in',
    cls: 'check-in',
    path: '/post/checkin'
  }],
  prefixCls = 'v-post-menu'

PostMenu.newInstance = properties => {
  const _props = properties || {}

  const Instance = new Vue({
    data: Object.assign({}, {
      mask: true,
      visible: false
    }, { menus }, _props),

    render (h) {
      const menusVNodes = []
      menus.forEach(menu => {
        menusVNodes.push(h('div', {
          class: `${prefixCls}-item _${menu.cls}`
        }, [h('div')]))
      })

      const maskVNodes = []
      if (this.mask) {
        maskVNodes.push(h('div', {
          attrs: {
            class: `${prefixCls}-mask`
          }
        }))
      }

      const bodyVNodes = []

      bodyVNodes.push(h('div', {
        attrs: {
          class: `${prefixCls}-wrap`
        }
      }, [h(PostMenu, {
        on: {
          'on-close': this.close
        }
      })]))

      return h('div', {
        directives: [{
          name: 'show',
          value: this.visible
        }],
        attrs: {
          class: `${prefixCls}-modal`
        }
      }, [maskVNodes, bodyVNodes])
    },
    computed: {},
    methods: {
      close () {
        this.visible = false
        this.onClose()
      }
    },
    onClose () {}
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const Menu = Instance.$children[0]

  return {
    show () {
      Menu.$parent.visible = true
    },
    comment: Menu
  }
}

export default PostMenu
