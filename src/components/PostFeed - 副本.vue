<template>
  <!-- <transition-group name="fade" tag="div" :class="$style.postRoot"  v-show="show" enter-active-class="zoomInLeft" leave-active-class="zoomOutRight"> -->
  <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
    <div class="post-feed" :class="$style.postRoot" v-if="show">
      <div class="commonHeader">
        <Row :gutter="16">
          <Col span="4">
            <Button :class="$style.actionBtn" type="text" @click="closePost">取消</Button>
          </Col>
          <Col span="15" class="title-col">
            发布动态
          </Col>
          <Col span="5" class="header-end-col">
            <span :class="{ action: !isDisabled, notAction: isDisabled}" @click="postFeed">发布</span>
          </Col>
        </Row>
      </div>
      <div :class="$style.content">
        <Row :gutter="16">
          <Col span="24" style="padding-left: 8px; padding-right: 8px;">
            <Input style="border-bottom: 1px #e2e3e3 solid;" v-model="feedTitle" placeholder="有标题更吸引人" :class="$style.contentInput"></Input>
            <Input v-model="feedContent" :autosize="{minRows: 6, maxRows: 12}" type="textarea" :class="$style.contentInput" placeholder="输入要说的话,图文结合更精彩哦"></Input>
          </Col>
        </Row>
      </div>
      <div :class="$style.upload">
        <template>
          <div style="padding: 0 4vw">
            <div class="demo-upload-list" v-for="(item, index) in defaultList" :key="index">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                </div>
            </div>
          </div>
          <div style="padding: 0 4vw">
            <Upload
              v-if="show"
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="10240"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              :data="uploadData"
              type="drag"
              :action="uploadUri"
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
import { SHOWPOST, NOTICE, ADDFOLLOWINGIDS, ADDNEWIDS, FEEDSLIST } from '../stores/types';
import { createAPI, addAccessToken } from '../utils/request';
import localEvent from '../stores/localStorage';
import { Base64 } from 'js-base64';
import md5 from 'js-md5';
import { createUploadTask, uploadFile, noticeTask } from '../utils/upload';

const base64Reg = /^data:(.*?);base64,/;
let reg = /data:(.*?);/;
const postFeed = {
  data: () => ({
    feedTitle: '',
    feedContent: '',
    isatuser: 0,
    uploadList: [],
    defaultList: [],
    imgName: '',
    visible: false,
    uploadUri: 'xxx',
    uploadData: {},
    uploadHeaders: {},
    storage_task_ids: [],
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
      let storage_task_ids = this.storage_task_ids;
      addAccessToken().post(createAPI('feeds'),{
          feed_content,
          feed_title,
          feed_from,
          isatuser,
          storage_task_ids
        },
        {
          validateStatus: status => status === 201
        }
      )
      .then(response => {
        let feed_id = response.data.data;
        this.closePost();
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '已发送',
            time: 1500,
            status: true
          });
        });
        this.storage_task_ids = [];
        addAccessToken().get(
          createAPI(`feeds/${response.data.data}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data: { data = {} } = {} }) => {
          this.$store.dispatch(FEEDSLIST, cb => {
            cb({
              [feed_id]: data
            });
          });
          // 添加本地最新数据
          this.$store.dispatch(ADDNEWIDS, cb => {
            cb([
              feed_id
            ]);
          });
          // 添加本地关注数据
          this.$store.dispatch(ADDFOLLOWINGIDS, cb => {
            cb([
              feed_id
            ]);
          })
        })
      })
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
    // 改造为删除defaultList的内容
    handleRemove (index) {
      this.defaultList.splice(index, 1);
    },
    handleSuccess (res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
    },
    handleFormatError (file) {
      if()
      this.$store.dispatch(NOTICE, cb => {
        cb({
          show: true,
          status: false,
          text: '文件 ' + file.name + ' 格式不正确，请上传 jpg,png 格式的图片',
          time: 1500
        });
      });
      return;
    },
    handleMaxSize (file) {
      this.$store.dispatch(NOTICE, cb => {
        cb({
          show: true,
          status: false,
          text: '文件 ' + file.name + ' 太大，不能超过 10M',
          time: 1500
        });
      })
      // this.$Notice.warning({
      //   title: '超出文件大小限制',
      //   desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      // });
    },
    getSize (dataUrl) {
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        return [
          img.width,
          img.height
        ];
      };
    },
    handleBeforeUpload (file) {
      this.handleFormatError (file);
      this.handleMaxSize (file);
      let fileDataURL = '';
      let fileBinaryString = '';
      if(file.type.indexOf('image') !== -1) {
        let reader = new FileReader();
        let fileUpload = {};
        fileUpload.origin_filename = file.name;
        let sizes = [];
        reader.onload = (e) => {
          // 获取图片dataurl
          let fileDataURL = reader.result;
          // dataurl解码
          let fileDecode = Base64.decode(fileDataURL.replace(base64Reg, ''));
          // dataurl 获取文件hash
          fileUpload.hash = md5(fileDecode);
          // 截取文件的mime_type
          fileUpload.mime_type = fileDataURL.match(reg)[1];
          fileUpload.height = 100;
          fileUpload.width = 100;

          createUploadTask(fileUpload, data => {
            if(data.hasOwnProperty('storage_id') && data.hasOwnProperty('storage_task_id')){
              this.defaultList.push({
                name: file.name,
                url: fileDataURL
              });
              this.storage_task_ids.push(data.storage_task_id);
              return false;
            }
            uploadFile(data, fileDataURL, uploadInfo => {
              noticeTask(data.storage_task_id, uploadInfo, noticeInfo => {
                this.defaultList.push({
                  name: file.name,
                  url: fileDataURL
                });
                this.storage_task_ids.push(data.storage_task_id);
              });
            })
          });
        }
        reader.readAsDataURL(file);
        return false;
      }
      return false;
    }
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
    padding: 6px 0;
    input, textarea {
      border: none;
      padding: 5px 8px;
      transition: none;
      &:focus, &:hover{
        border: none;
        outline: 0;
        box-shadow: none;
      }
    }
  }
  .postFeedNav {
    height: 45px;
    border-bottom: 1px #e2e3e3 solid;
    .navRow {
      height: 100%;
      margin-left: 0!important;
      margin-right: 0!important;
      .actionBtn {
        font-size: 14px;
        display: flex;
        justify-content: flex-start;
        padding: 6px 0;
      }
      .sendAction {
        display: flex;
        justify-content: flex-end;
      }
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
    .action {
      color: #59b6d7;
      font-size: 14px;
    }
    .notAction {
      color: #999;
      font-size: 14px;
    }
  }
  .demo-upload-list{
        display: inline-block;
        width: 22vw;
        height: 22vw;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin: 0 .5vw;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
        object-fit: cover;
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
