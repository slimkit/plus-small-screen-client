<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
    <div class="post-feed" :class="$style.postRoot" v-show="show">
      <header class="commonHeader">
        <Row :gutter="24">
          <Col span="5">
            <Button :class="$style.actionBtn" type="text" @click="closePost">取消</Button>
          </Col>
          <Col span="14" class="title-col">
            发布动态
          </Col>
          <Col span="5" class="header-end-col">
            <LoadingWhiteIcon height="21" width="21" v-if="loading" />
            <span :class="{ action: !isDisabled, notAction: isDisabled}"  v-else @click="postFeed">发布</span>
          </Col>
        </Row>
      </header>
      <div :class="$style.content">
        <Row :gutter="24">
          <Col span="24">
            <Input 
              v-model="feedContent" 
              :autosize="{minRows: 6, maxRows: 12}" 
              :autofocus="true" 
              :maxlength="255" 
              type="textarea" 
              :class="$style.contentInput" 
              placeholder="输入要说的话,图文结合更精彩哦"
              v-childfocus
            />
          </Col>
        </Row>
      </div>
      <div :class="$style.upload">
        <template>
          <div :class="$style.uploadList">
            <div class="demo-upload-list" v-for="(item, index) in uploadList">
              <template v-if="item.status === 'finished'">
                  <img :src="item.url" :alt="item.name" >
                  <div class="demo-upload-list-cover">
                    <CloseIcon height="21" width="21" color="#f00" style="position: absolute; right:0; top: 0;" @click.native="handleRemove(index)" />
                    <EyeOpenIcon height="21" width="21" color="#59b6d7" @click.native="handleView(index)" />
                  </div>
              </template>
              <template v-else>
                <i-circle v-if="item.showProgress" :percent="item.percentage">
                  <span class="demo-i-circle-inner" style="font-size:24px">{{parseInt(item.percentage)}}%</span>
                </i-circle>
              </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :on-error="handleError"
              :format="format"
              :max-size="maxSize"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              :headers="headers"
              type="drag"
              :action="uploadUri"
              accept="image/*"
              :multiple="true"
              style="display: inline-block;width:22vw;height: 22vw; margin: .5vw;">
              <div :class="$style.camera">
                  <CameraIcon height="24" width="24" color="#999" />
              </div>
            </Upload>
            <Modal title="查看图片" v-model="visible">
                <img :src="ids[uploadList[imgName].name].url" v-if="visible" style="width: 100%">
            </Modal>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import { SHOWPOST, NOTICE, ADDFOLLOWINGIDS, ADDNEWIDS, FEEDSLIST } from '../stores/types';
import { createAPI, addAccessToken, createRequestURI } from '../utils/request';
import buildURL from 'axios/lib/helpers/buildURL';
import $storeLocal from 'store';
import { Base64 } from 'js-base64';
import md5 from 'js-md5';
import { createUploadTask, uploadFile, noticeTask, dataURItoBlob } from '../utils/upload';
import lodash from 'lodash';
import CameraIcon from '../icons/Camera';
import CloseIcon from '../icons/Close';
import EyeOpenIcon from '../icons/EyeOpen';
import LoadingWhiteIcon from '../icons/LoadingWhite';
import EXIF from 'exif-js';
import exifOrient from 'exif-orient';
import piexif from 'piexifjs';

const base64Reg = /^data:(.*?);base64,/;
let reg = /data:(.*?);/;
const UserLoginInfo = $storeLocal.get('UserLoginInfo');
//
const postFeed = {
  components: {
    CameraIcon,
    CloseIcon,
    EyeOpenIcon,
    LoadingWhiteIcon
  },
  data: () => ({
    feedContent: '',
    uploadList: [],
    visible: false,
    uploadUri: createAPI('files'),
    headers: { Authorization: `Bearer ${UserLoginInfo.token}` },
    images: [],
    format: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp'],
    maxSize: 5120,
    loading: false,
    listCount: 0
  }),
  computed: {
    ...mapState({
      show: state => state.showPost.showPost.show
    }),
    isDisabled () {
      return !(this.feedContent.length || this.images.length);
    }
  },
  methods: {
    postFeed () {
      if(this.isDisabled || this.loading) return;
      this.loading = true;
      let feed_content = this.feedContent;
      let feed_from = 2;
      let feed_mark = parseInt(window.TS_WEB.currentUserId + (new Date).getTime());

      let feed_data = {
        feed_content,
        feed_from,
        feed_mark
      };

      if( this.images.length ) {
        feed_data.images = this.images;
      }

      addAccessToken().post(createAPI('feeds'), feed_data,
        {
          validateStatus: status => status === 201
        }
      )
      .then(({data = {}}) => {
        let feed_id = data.id;
        this.closePost();
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: data.message[0],
            time: 1500,
            status: true
          });
        });

        this.uploadList =[];
        this.$refs.upload.clearFiles();
        this.loading = false;
        this.images = [];

        addAccessToken().get(
          createAPI(`feeds/${feed_id}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data = {} }) => {
          data.comments = [];
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
          });
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .catch( ({ data: { message = [] } = {} }) => {
        let msg = message[0] ? message[0] : '发送失败';
        this.loading = false;
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: msg,
            time: 1500,
            status: false
          });
        });
      })
    },
    closePost () {
      this.feedContent = '';
      this.isatuser = 0;
      this.storage_task_ids = [];
      this.$refs.upload.clearFiles();
      this.ids = {};
      this.uploadList = [];
      this.loading = false;
      this.$store.dispatch(SHOWPOST, cb => {
        cb ({
          show: false,
          channelId: 0
        });
      });
    },
    
    handleView (index) {
        this.imgName = index;
        this.visible = true;
    },

    handleError (error, file, fileList) {
      console.log(error);
      console.log(file);
      console.log(fileList);
    },
    handleRemove (index) {
      // 从 upload 实例删除数据
      let fileName = this.$refs.upload.fileList[index].name;
      this.$refs.upload.fileList.splice(index, 1);
      this.images.splice(index, 1);
    },

    handleSuccess (res, file, fileList) {
      file.url = buildURL(createAPI(`files/${res.id}`), {
        w: 200,
        h: 200
      });

      this.images.push({
        id: res.id
      });
    },

    handleFormatError (name) {
      this.$store.dispatch(NOTICE, cb => {
        cb({
          show: true,
          status: false,
          time: 2500,
          text: '图片' + name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        })
      })
    },
    handleMaxSize (name) {
      this.$store.dispatch(NOTICE, cb => {
        cb({
          show: true,
          status: false,
          time: 1500,
          text: '图片 ' + name + ' 太大，不能超过 5M。'
        });
      })
    },
    // 检验上传图片数量
    handleMaxItems ( ) {
      this.$store.dispatch(NOTICE, cb => {
        cb({
          show: true,
          status: false,
          time: 1500,
          text: '不能超过9张图片'
        });
      })
    },
    // 上传前置操作
    handleBeforeUpload (file) {
      const check = this.uploadList.length < 9;
      if (!check) {
          this.$Notice.warning({
              title: '最多只能上传 9 张图片。'
          });
      }
      return check;
    },
  },
  updated () {
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
    .uploadList {
      padding: 0 4vw;
      display: flex;
      flex-wrap: wrap;
    }
    .contentInput {
      padding: 6px 0;
      input, textarea {
        border: none;
        padding: 4px 8px;
        transition: none;
        font-size: 14px;
        &:focus, &:hover{
          border: none;
          outline: 0;
          box-shadow: none;
        }
      }
    }
    .actionBtn {
      font-size: 16px;
      display: flex;
      justify-content: flex-start;
      padding: 6px 0;
    }
    .sendAction {
      display: flex;
      justify-content: flex-end;
    }
    .camera {
      width: 22vw;
      height: 22vw; 
      line-height: 22vw;
      display: flex;
      justify-content: center;
      align-items: center;
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
      font-size: 16px;
    }
    .notAction {
      color: #999;
      font-size: 16px;
    }
  }
  .demo-upload-list{
    width: 22vw;
    height: 22vw;
    text-align: center;
    line-height: 22vw;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin:.5vw;
  }
  .ivu-upload-drag {
    border-radius: 0;
    border: 1px #ededed solid;
    &:hover {
      border: 1px #ededed solid;
    }
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
