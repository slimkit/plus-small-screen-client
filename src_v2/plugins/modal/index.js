import Vue from 'vue';
import Modal from './modal';

const prefixCls = 'v-post-menu';

Modal.newInstance = (properties) => {
    const _props = properties || {};
    const Instance = new Vue({
        data: Object.assign({}, _props, {
            visible: false
        }),
        render(h) {
            return h(Modal, {
                props: Object.assign({}, _props, {}),
                domProps: {
                    value: this.visible
                },
                on: {
                    input: (status) => {
                        this.visible = status;
                    }
                }
            });
        },
        methods: {
            cancel() {
                this.$children[0].visible = false;
                this.onCancel();
                this.remove();
            },
            remove() {
                setTimeout(() => {
                    this.destroy();
                }, 300);
            },
            destroy() {
                this.$destroy();
                document.body.removeChild(this.$el);
                this.onRemove();
            },
            onOk() {},
            onCancel() {},
            onRemove() {}
        },
        mounted(){
            console.log(this);
            console.log(this.$props);
        }
    });
    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const modal = Instance.$children[0];
    return {
        show(props) {
            // notice when component destroy
            modal.$parent.onRemove = props.onRemove;

            modal.visible = true;
        },
        remove() {
            modal.visible = false;
            modal.$parent.remove();
        }
    }
}

export default Modal