<template>
  <!-- <transition-group name="fade" tag="div" :class="$style.postRoot"  v-show="show" enter-active-class="zoomInLeft" leave-active-class="zoomOutRight"> -->
  <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
    <div class="post-feed" :class="$style.postRoot" v-if="show">
      <div :class="$style.postFeedNav">
        <Row :gutter="16" type="flex" :class="$style.navRow" justify="center" align="middle">
          <Col :span="4">
            <Button :class="$style.actionBtn" type="text" @click="closePost">取消</Button>
          </Col>
          <Col :span="15">
            <h4 style="font-weight: 400; font-size: 18px; text-align: center;">发布动态</h4>
          </Col>
          <Col :span="5">
            <Button :class="$style.actionBtn" :disabled="isDisabled" type="text" @click="postFeed">发布</Button>
          </Col>
        </Row>
      </div>
      <div :class="$style.content">
        <Row :gutter="16">
          <Col :span="24">
            <Input v-model="feedTitle" placeholder="有标题更吸引人" :class="$style.contentInput"></Input>
            <Input v-model="feedContent" :autosize="{minRows: 6, maxRows: 12}" type="textarea" :class="$style.contentInput" placeholder="输入要说的话,图文结合更精彩哦"></Input>
          </Col>
        </Row>
      </div>
      <div :class="$style.upload">
        <template>
          <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <div style="padding: 0 15px;">
            <Upload
              v-if="show"
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png', 'gif']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              type="drag"
              multiple
              action="//jsonplaceholder.typicode.com/posts/"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="查看图片" v-model="visible">
              <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
            </Modal>
          </div>
        </template>
      </div>
    </div>
  <!-- </transition-group> -->
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import { SHOWPOST, NOTICE } from '../stores/types';
import { createAPI, addAccessToken } from '../utils/request';
import localEvent from '../stores/localStorage';
// import FileUpload from 'vue-upload-component';

const postFeed = {
  data: () => ({
    feedTitle: '',
    feedContent: '',
    isatuser: 0,
    uploadList: [],
    defaultList: [],
    imgName: '',
    visible: false,
  }),
  computed: {
    ...mapState({
      show: state => state.showPost.showPost.show
    }),
    isDisabled () {
      return !this.feedContent.length;
    }
  },
  methods: {
    getTaskInfo () {

    },
    postFeed () {
      let feed_content = this.feedContent;
      let feed_title = this.feedTitle;
      let feed_from = 2;
      let isatuser = this.isatuser;
      addAccessToken().post(createAPI('feeds'),{
          feed_content,
          feed_title,
          feed_from,
          isatuser,
        },
        {
          validateStatus: status => status === 201
        }
      )
      .then(response => {
        this.closePost();
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '已发送',
            time: 3000,
            status: true
          });
        });
      })
      .catch(({ response: { data = {} } = {} } ) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: data.message,
            time: 2000,
            status: false
          });
        });
      });
    },
    closePost () {
      this.feedTitle = '';
      this.feedContent = '';
      this.isatuser = 0;
      this.$store.dispatch(SHOWPOST, cb => {
        cb ({
          show: false
        });
      });
    },
    handleView (name) {
        this.imgName = name;
        this.visible = true;
    },
    handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
        // 因为上传过程为实例，这里模拟添加 url
        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
        file.name = '7eb99afb9d5f317c912f08b5212fd69a';
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '文件格式不正确',
            desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
    },
    handleMaxSize (file) {
        this.$Notice.warning({
            title: '超出文件大小限制',
            desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        });
    },
    handleBeforeUpload () {
      console.log(this.uploadList);
      return false;
      // addAccessToken().post(createAPI('storages/task'), {} {

      // });
      const check = this.uploadList.length < 9;
      if (!check) {
          this.$Notice.warning({
              title: '最多只能上传 9 张图片。'
          });
      }
      return check;
    }
  },
  updated () {
    if( this.show )
    this.uploadList = this.$refs.upload.fileList;
  }
};

export default postFeed;
</script>

<style lang="scss" module>
  .postRoot {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    background: #fff;
    z-index: 10;
    display: block;
    height: 100%;
    width: 100%;
  }
  .contentInput {
    padding: 6px 15px;
    input, textarea {
      border: none;
      padding: 5px 0;
      transition: none;
      &:focus {
        border: none;
        outline: 0;
      }
      &:hover {
        border: none;
        outline: 0;
      }
    }
  }
  .postFeedNav {
    height: 45px;
    .actionBtn {
      font-size: 14px;
    }
    .navRow {
      height: 100%;
    }
  }
</style>
<style lang="scss">
  .post-feed {
    .vux-header h1 {
      color: #000;
      height: 44px;
    }
    .weui-cells:after {
      height: 0;
      content: ""!important;
    }
    .weui-cell:before {
      right: 15px;
    }
    .vux-no-group-title {
      margin-top: 0;
    }
    .vux-header .vux-header-left a.vux-header-back{
      color: #59b6d7;
      padding-left: 0;
    }
    .left-arrow {
      display: none;
    }
  }
  .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
