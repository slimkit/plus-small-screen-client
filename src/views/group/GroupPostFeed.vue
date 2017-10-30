<template>
<div class="group-post-feed">
  <icon-plus fill="#fff"
             @click.native="showPost"></icon-plus>
  <transition name="custom-classes-transition"
              enter-active-class="animated slideInUp"
              leave-active-class="animated slideOutDown">
    <div class="editPage"
         v-show="showEditor">
      <header class="commonHeader">
        <Row :gutter="24">
          <Col span="5">
          <Button type="text"
                  @click="closePost">取消</Button>
          </Col>
          <Col span="14"
               class="title-col"> 发布动态
          </Col>
          <Col span="5"
               class="header-end-col">
          <Button type="text"
                  @click="postFeed"
                  :disabled="canSave">发布</Button>
          </Col>
        </Row>
      </header>
      <div class="post-content">
        <textarea name="feed-content"
                  id="feed-content"
                  maxlength="255"
                  placeholder="输入要说的话"
                  v-model="content"></textarea>
        <p class="content-tips"
           v-show="content.length > 250"
           style="text-align: right">
          <span :style="{'color':  'red'}">{{content.length}}</span>/255
        </p>
      </div>
    </div>
  </transition>
</div>

</template>

<script>
import PlusIcon from '../../icons/Plus';
import axios, { createAPI, addAccessToken } from '../../utils/request';
// import imagesMange from './imgUpload';
export default {
  name: 'group-post-feed',
  components: {
    'icon-plus': PlusIcon,
    // 'image-upload': imagesMange,
  },
  data() {
    return ({
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
    showPost() {
      this.showEditor = true
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
        },{
            validateStatus: status => status === 201
        }).then(({data: {message = "发布成功", id}})=>{
            this.$Message.success(message);
            this.closePost();
        }).catch(({response: { data = {message: "发布失败!"}}})=>{
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
  z-index: 10;
  .editPage {
    z-index: 11;
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
