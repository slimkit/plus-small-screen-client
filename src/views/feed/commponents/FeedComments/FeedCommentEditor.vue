<template>
    <div class="feed-comment-editor" v-if='value'>
        <Input v-model="txt" type="textarea" :maxlength='maxlength' :autosize="{minRows: 1, maxRows: 4}" :placeholder="placeholder"></Input>
        <div class="feed-comment-action">
            <p class="feed-comment-count-tips" v-if='len > maxlength*4/5'>
                <span>{{ len }}</span>/{{maxlength}}
            </p>
            <Button type="ghost" size="small" @click="handleCommentInput">取消</Button>
            <Button type="primary" size="small" :disabled='disabled' @click.stop='sendComment'>发送</Button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'feed-comment-editor',
    props: {
        value: Boolean,
        placeholder: String,
        maxlength: Number
    },
    data() {
        return({
            txt: '',
            disabled: true
        });
    },
    computed: {
        len() {
            return this.txt.length;
        }
    },
    watch:{
        len(val){
            this.disabled  = !(val > 0);
        }
    },
    methods: {
        handleCommentInput() {
            this.txt = '';
            this.$emit('handleCommentInput');
        },
        sendComment(){
            console.log(this.txt);
            if(this.len > 0){
                this.disabled = true;
                this.$emit('handleCommentFeed', this.txt, ()=>{
                    this.handleCommentInput();
                });
            }else{
                this.$Message.error('评论内容不能为空')
                return false;
            }
        }
    }
}
</script>
<style lang='less'>
.feed-comment-editor {
    padding-top: 10px;
    .feed-comment-action {
        padding-top: 10px;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        >*+* {
            margin-left: 10px;
        }
        .feed-comment-count-tips {
            span {
                color: red;
            }
        }
    }
}
</style>