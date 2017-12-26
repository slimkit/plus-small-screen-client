import Vue from 'vue';
import PostMenu from './postMenu';

const defaultMenuList = {

}, prefixCls = 'v-post-menu';

PostMenu.newInstance = properties => {
  const _props = properties || {};

  const Instance = new Vue({
    data: Object.assign({}, {
      mask: true,
      visible: false
    }, _props),

    render(h) {
      const maskVNodes = [];
      if (this.mask) {
        maskVNodes.push(h('div', {
          attrs: {
            class: `${prefixCls}-mask`
          }
        }));
      }

      const bodyVNodes = [];

      bodyVNodes.push(h('div', {
        attrs: {
          class: `${prefixCls}-wrap`
        }
      }, [h(PostMenu, {
        on: {
          'on-close': this.close
        }
      })]));

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
      close() {
        this.visible = false;
        this.onClose();
      }
    }
  });

  const component = Instance.$mount();
  document.body.appendChild(component.$el);
  const Menu = Instance.$children[0];

  return {
    show() {
      Menu.$parent.visible = true;
    },
    comment: Menu
  }
}

let inputInstance

function getInputInstance() {
  inputInstance = inputInstance || PostMenu.newInstance({});
  return inputInstance;
}

function showInput(option) {
  const instance = getInputInstance();
  instance.show(option);
}

export default {
  name: 'PostMenu',
  show(option = {}) {
    return showInput(option);
  },
  remove() {
    if (!inputInstance) {
      return false;
    }
    const instance = getInputInstance();
    instance.remove();
  }
};