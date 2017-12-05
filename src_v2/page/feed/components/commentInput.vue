<template>
    <div @click.stop='' class="comment-input">
        <textarea :style='textareaStyles' :maxlength="maxlength" :placeholder="placeholder" ref='input' autofocus="true" :value="currentValue" @keyup.enter="handleEnter" @input="handleInput" />
        <div class="comment-input-append">
            <template v-if='len > 200'>
                <p>{{ len }}/{{maxlength}}</p>
            </template>
            <button :disabled="!(len > 0)" @click='handleDone'>发送</button>
        </div>
    </div>
</template>
<script>
import calcTextareaHeight from '../../../util/calcTextareaHeight';
export default {
    name: 'commentInput',
    props: {
        focus: Boolean,
        placeholder: {
            type: String,
            default: "随便说说~",
            requried: true
        },
        maxlength: {
            type: [Number, String],
            default: 255,
            validator(val) {
                return typeof(+val) === 'number';
            }
        }
    },
    data() {
        return {
            textareaStyles: {},
            currentValue: ''
        }
    },
    computed: {
        len() {
            return this.currentValue.length;
        }
    },
    methods: {
        handleDone() {
            if(this.currentValue) {
                this.$emit('on-ok', this.currentValue);
            }
        },
        handleInput(event) {
            let value = event.target.value;
            this.$emit('input', value);
            this.setCurrentValue(value);
            this.$emit('on-change', event);
        },
        handleChange(event) {
            this.$emit('on-input-change', event);
        },
        setCurrentValue(value) {
            if(value === this.currentValue) return;
            this.$nextTick(() => {
                this.resizeTextarea();
            });
            this.currentValue = value;
        },
        resizeTextarea() {
            this.textareaStyles = calcTextareaHeight(this.$refs.input);
        }
    },
    watch: {
        focus(val) {
            if(val) {
                this.$refs.input.focus();
            }
        }
    },
    mounted() {
        this.$refs.input.focus();
    }
}
</script>
<style lang='less'>
.v-comment-input {
    position: fixed;
    overflow: hidden;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    &-mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(55, 55, 55, 0.3);
        height: 100%;
        z-index: 1000;
    }
    &-body {
        position: relative;
        background-color: #fff;
        border: 0;
        background-clip: padding-box;
    }
}

.comment-input {
    width: 100%;
    padding: 15px 20px;
    min-height: 100px;
    background-color: #fafafa;
    display: flex;
    align-items: flex-end;
    >* {
        flex: 0 0 auto
    }
    textarea {
        flex: 1 1 auto;
        height: 26*1.5+10px;
        padding: 5px 0;
        min-height: 26*1.5+10px;
        max-height: 175px;
        line-height: 1.5;
        color: #000;
        font-size: 26px;
        background: none;
        resize: none;
        border-radius: 0;
        border-bottom: 1px solid #59b6d7;
        /*no*/
        &:focus, &:active, &:hover {
            outline: none !important;
        }
    }
    p {
        text-align: center;
        color: #999;
        margin-bottom: 15px;
        font-size: 20px;
        margin-left: 15px;
    }
    button {
        font-size: 24px;
        margin-left: 15px;
        width: 89px;
        height: 50px;
        color: #fff;
        background-color: #59b6d7;
        border-radius: 2px;
        /*no*/
        &[disabled] {
            background-color: #ccc;
        }
    }
    &-append {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
    }
}
</style>