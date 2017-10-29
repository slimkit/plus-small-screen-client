<template>
    <div class="group-post-feed" @click="showPrePost">
        <icon-plus fill="#fff"></icon-plus>
    </div>
</template>
<script>
import PlusIcon from '../../icons/Plus';
import axios, { createAPI, addAccessToken } from '../../utils/request';
import { SHOWPREPOST } from '../../stores/types';
export default {
    name: 'group-post-feed',
    components: {
        'icon-plus': PlusIcon,
    },
    data() {
        return({
            showEditor: false,
            content: '',
            images: [],
        })
    },
    computed: {
        canSave() {
            return !(this.content.length > 0 || this.images.length > 0)
        }
    },
    methods: {
        showPrePost() {
          console.log(123456);
            this.$store.dispatch(SHOWPREPOST, cb => {
                cb(true)
            });
        },
        closePost() {
            this.images = [];
            this.content = '';
            this.showEditor = false;
        },

        postFeed() {
            return !this.canSave ? (() => {
                axios.post(createAPI(`groups/${this.$route.params.id}/posts`), {
                    title: this.title,
                    content: this.content,
                    group_post_mark: `${new Date().getTime()}`
                }, {
                    validateStatus: status => status === 201
                }).then(({ data: { message = "发布成功", id } }) => {
                    this.$Message.success(message);
                    this.closePost();
                }).catch(({ response: { data = { message: "发布失败!" } } }) => {
                    const msg = this.$MessageBundle(data).getMessage();
                    this.$Message.error(msg);
                });
            })() : false
        }
    }
}
</script>
<style lang="scss">
.group-post-feed {
    width: 40px;
    height: 40px;
    border: 1px solid #fff;
    border-radius: 100%;
    background-color: #59b6d7;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 25px;
    left: 50%;
    margin-left: -20px;
    z-index: 8;
    .editPage {
        z-index: 8;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background: #fff;
        .post-content {
            padding: 0 15px;
            input,
            textarea {
                width: 100%;
                border: 0;
                outline: 0;
                padding: 10px 6px;
                transition: none;
                font-size: 14px;
                line-height: 18px;
                resize: none;
                &:placeholder {
                    color: #ccc;
                }
                &:focus,
                &:hover {
                    outline: 0;
                    box-shadow: none;
                }
            }
            input {
                height: auto;
                border-bottom: 1px solid #ededed;
            }
            textarea {
                height: 270px;
            }
        }
    }
}
</style>