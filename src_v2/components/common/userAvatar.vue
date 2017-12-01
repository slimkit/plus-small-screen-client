<template>
    <span :class="classes">
        <img :src="imgSrc" v-if="imgSrc" ref='img'>
        <v-icon :type="icon" width='100%' height='100%' v-else-if="icon" class='avatar_icon'></v-icon>
        <span ref="children" :class="[prefixCls + '-string']" :style="childrenStyle" v-else>
            <slot></slot>
        </span>
        <v-icon :type="badeg" v-if="badeg" class='avatar_badeg'></v-icon>
    </span>
</template>
<script>
import { oneOf } from '../../util/';
const prefixCls = 'v-avatar';
export default {
    name: 'vAvatar',
    props: {
        shape: {
            validator(value) {
                return oneOf(value, ['circle', 'square']);
            },
            default: 'circle'
        },
        size: {
            validator(value) {
                return oneOf(value, ['small', 'large', 'default']);
            },
            default: 'default'
        },
        src: {
            type: String
        },
        badeg: {
            type: [String]
        },
        sex: {
            type: [String, Number]
        }
    },
    data() {
        return {
            prefixCls: prefixCls,
            scale: 1,
            isSlotShow: false,
            imgSrc: this.src
        };
    },
    computed: {
        icon() {
            switch(+this.sex) {
                case 0:
                    return 'avatar-secret';
                case 1:
                    return 'avatar-man';
                case 2:
                    return 'avatar-woman';
                default:
                    return 'avatar-secret';
            }
        },
        classes() {
            return [
                `${prefixCls}`,
                `${prefixCls}-${this.shape}`,
                `${prefixCls}-${this.size}`,
                {
                    [`${prefixCls}-image`]: !!this.src,
                    [`${prefixCls}-icon`]: !!this.icon
                }
            ];
        },
        childrenStyle() {
            let style = {};
            if(this.isSlotShow) {
                style = {
                    msTransform: `scale(${this.scale})`,
                    WebkitTransform: `scale(${this.scale})`,
                    transform: `scale(${this.scale})`,
                    position: 'absolute',
                    display: 'inline-block',
                    left: `calc(50% - ${Math.round(this.$refs.children.offsetWidth / 2)}px)`
                };
            }
            return style;
        }
    },
    methods: {
        setScale() {
            this.isSlotShow = !this.src && !this.icon;
            if(this.$refs.children) {
                const childrenWidth = this.$refs.children.offsetWidth;
                const avatarWidth = this.$el.getBoundingClientRect().width;
                // add 4px gap for each side to get better performance
                if(avatarWidth - 8 < childrenWidth) {
                    this.scale = (avatarWidth - 8) / childrenWidth;
                } else {
                    this.scale = 1;
                }
            }
        }
    },
    mounted() {
        this.setScale();
        if(this.src) {
            this.$refs.img.onerror = () => {
                this.imgSrc = '';
            };
        }
    },
    updated() {
        this.setScale();
    }
};
</script>