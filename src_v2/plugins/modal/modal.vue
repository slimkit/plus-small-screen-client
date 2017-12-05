<template>
    <div>
        <div :class='maskClasses' v-show='visible' @click='mask'></div>
        <div :class="wrapClasses" @click="handleWrapClick">
            <div :class="classes" v-show="visible">
                <div :class="[prefixCls + '-content']">
                    <a :class="[prefixCls + '-close']" v-if="closable" @click="close">
                        <slot name="close">
                            <v-icon type="base-clean"></v-icon>
                        </slot>
                    </a>
                    <div :class="[prefixCls + '-header']" v-if="showHead">
                        <slot name="header">
                            <div :class="[prefixCls + '-header-inner']">{{ title }}</div>
                        </slot>
                    </div>
                    <div :class="[prefixCls + '-body']">
                        <slot></slot>
                    </div>
                    <div :class="[prefixCls + '-footer']" v-if="!footerHide">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const prefixCls = 'v-modal'
export default {
    name: 'postMenu',
    props: {
        className: String,
        closable: {
            type: Boolean,
            default: true
        },
        maskClosable: {
            type: Boolean,
            default: true
        },
        title: {
            type: String
        },
        footerHide: {
            type: Boolean,
            default: false
        },
        showHead: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            prefixCls,
            timer: null,
            wrapShow: false,
            visible: this.value,
        }
    },
    computed: {
        maskClasses() {
            return `${prefixCls}-mask`
        },
        wrapClasses() {
            return [
                `${prefixCls}-wrap`,
                {
                    [`${prefixCls}-hidden`]: !this.wrapShow,
                    [`${this.className}`]: !!this.className
                }
            ]
        },
        classes() {
            return `${prefixCls}`;
        },
    },
    watch: {
        value(val) {
            this.visible = val;
        },
        visible(val) {
            if(val === false) {
                this.timer = setTimeout(() => {
                    this.wrapShow = false;
                }, 300);
            } else {
                if(this.timer) clearTimeout(this.timer);
                this.wrapShow = true;
            }
            this.$emit('on-visible-change', val);
        },
    },
    methods: {
        close() {
            this.visible = false;
            this.$emit('input', false);
            this.$emit('on-cancel');
        },
        mask() {
            if(this.maskClosable) {
                this.close();
            }
        },
        handleWrapClick(event) {
            const className = event.target.getAttribute('class');
            if(className && className.indexOf(`${prefixCls}-wrap`) > -1) this.mask();
        },
        EscClose(e) {
            if(this.visible && this.closable) {
                if(e.keyCode === 27) {
                    this.close();
                }
            }
        },
    },
    mounted() {
        if(this.visible) {
            this.wrapShow = true;
        }
        // ESC close
        document.addEventListener('keydown', this.EscClose);
    },
}
</script>
<style lang="less" src='./modal.less'></style>