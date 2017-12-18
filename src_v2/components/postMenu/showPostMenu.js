import Vue from 'vue';
import PostMenu from './postMenu';


const prefixCls = 'v-post-menu';
PostMenu.newInstance = properties => {
    const _props = properties || {};

    const Instance = new Vue({
        data: Object.assign({}, {
            mask: true,
            visible: false,
        }, _props),

        render(h) {
            let maskVNodes = [];
            if(this.mask) {
                maskVNodes.push(h('div', {
                    attrs: {
                        class: `${prefixCls}-mask`
                    }
                }));
            }

            let bodyVNodes = [];

            bodyVNodes.push(h('div', {
                attrs: {
                    class: `${prefixCls}-wrap`
                },
            }, [h(PostMenu, {
                on: {
                    'on-close': this.close
                }
            })]));

            return h('div', {
                directives: [{
                    name: 'show',
                    value: this.visible,
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
            },

            onClose() {}
        },
    });

    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const Menu = Instance.$children[0];

    return {
        show(options = {}) {
            Menu.$parent.visible = true;
        },
        remove() {},
        comment: Menu
    }
}

let inputInstance

function getInputInstance({ placeholder } = {}) {
    inputInstance = inputInstance || PostMenu.newInstance({});
    return inputInstance;
}

function showInput(option) {
    let instance = getInputInstance();
    instance.show(option);
}

export default {
    name: 'PostMenu',
    show(option = {}) {
        return showInput(option);
    },
    remove() {
        if(!inputInstance) {
            return false;
        }
        const instance = getInputInstance();
        instance.remove();
    }
};