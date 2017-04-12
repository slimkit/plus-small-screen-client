<template>
	<div class="userProfile" :class="$style.userProfile">
		<div class="userProfile-header userProfile-background-color">
      <Row :gutter="16">
        <Col span="3" style="display: flex; justify-content: flex-start">
          <i @click="goTo(-1)" class="ivu-icon ivu-icon-android-arrow-back" style="width: 100%; height: 100%; display: flex; align-items: center;"></i>
        </Col>
        <Col span="18" style="font-size: 18px;">
          个人资料
        </Col>
        <Col span="3" style="display: flex;">
          <Button type="text">完成</Button>
        </Col>
      </Row>
    </div>
    <div class="userProfile-background-color" :class="$style.userProfileAvatar">
      <Row :gutter="16" :class="$style.rowCenter" style="position: relative;">
        <div style="width: 100%; display: flex; align-items: center;">
          <!-- 头像 -->
          <Col span="4" :class="$style.colCenter">
            <img v-lazy="avatar" :class="$style.avatar" alt="name">
          </Col>
          <!--昵称+简介-->
          <Col span="17">
            更换头像
          </Col>
          <Col span="3" :class="$style.rightIcon">
            <Icon type="ios-arrow-right"></Icon>
          </Col>
        </div>
        <input style="z-index: 2;position:absolute; width:100%; left:0; right:0; height:100%;opacity:0;" type="file" name="image" accept="image/*"
          @change="setImage"
        />
      </Row>
    </div>
    <div class="userProfile-background-color" :class="$style.userProfileSetting">
      <Row :gutter="16" :class="$style.rowCenter">
        <Col span="4">
          昵称
        </Col>
        <Col span="17">
          <input style="padding: 0;" type="text" v-model.trim="name" placeholder="输入新昵称" />
        </Col>
        <Col span="3" :class="$style.rightIcon">
          <i @click="clean('name')"  v-show="canClean" class="ivu-icon ivu-icon-close-circled"></i>
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.rowCenter">
        <div @click="showSexPopup" style="width: 100%;">
          <Col span="4">
            性别
          </Col>
          <Col span="17">
            <span :class="{sexDefaultText: !sex}">{{ sexText }}</span>
          </Col>
          <Col span="3" :class="$style.rightIcon">
            <Icon type="ios-arrow-right"></Icon>
          </Col>
        </div>
      </Row>
      <Row :gutter="16" :class="$style.rowCenter">
        <div @click="showSexPopup" style="width: 100%;">
          <Col span="4">
            城市
          </Col>
          <Col span="17">
            <span :class="{cityDefaultText: !city}">{{ cityText }}</span>
          </Col>
          <Col span="3" :class="$style.rightIcon">
            <Icon type="ios-arrow-right"></Icon>
          </Col>
        </div>
      </Row>
      <Row :gutter="16" :class="$style.rowCenter">
        <Col span="4">
          简介
        </Col>
        <Col span="20" :class="$style.colBottom">
          <Input :class="$style.intro" v-model="intro" type="textarea" :autosize="{minRows: 1, maxRows: 4}" placeholder="编辑简介"></Input>
        </Col>
      </Row>
    </div>
    <mt-popup
      v-model="isShowSexPopup"
      position="bottom"
      style="width: 100%;"
      :class="$style.SexPopup"
    >
      <div>
        <Button @click="setSex(1)" size="large" :class="$style.sexOptions" type="text" :long="true">男</Button>
        <Button @click="setSex(2)" size="large" :class="$style.sexOptions" type="text" :long="true">女</Button>
        <Button @click="setSex(3)" size="large" :class="$style.sexOptions" type="text" :long="true">保密</Button>
        <Button @click="hideSexPopup" size="large" :class="$style.sexOptions" type="text" :long="true">取消</Button>
      </div>
    </mt-popup>
    <vue-cropper
      style="position: fixed; left:0; right: 0; top: 0; bottom: 0; width:100%; height: 100%;"
      v-if="isShowCropper"
      ref='cropper'
      aspect-ratio="1"
      :guides="true"
      view-mode="2"
      :auto-crop="true"
      min-canvas-width="200"
      min-canvas-height="200"
      minCropBoxWidth="100"
      minCropBoxHeight="100"
      drag-mode="crop"
      :background="true"
      :src="imgSrc"
      :cropmove="cropImage">
    </vue-cropper>
	</div>
</template>
<script>
  import { changeUrl, goTo } from '../utils/changeUrl';
  import { createAPI, addAccessToken } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';
  import VueCropper from 'vue-cropperjs';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const UserSetting = {
    components: {
      VueCropper
    },
    data: () => ({
      currentUser: currentUser.user_id,
      userInfo: {},
      name: '',
      sex: 0,
      isShowSexPopup: false,
      intro: '',
      isShowCropper: false,
      imgSrc: '',
      cropImg: ''
    }),
    methods: {
      changeUrl,
      goTo,
      clean (param) {
        this[param] = '';
      },
      showSexPopup () {
        this.isShowSexPopup = true;
      },
      hideSexPopup () {
        this.isShowSexPopup = false;
      },
      setSex(sex) {
        this.sex = sex;
        this.hideSexPopup();
      },
      setImage (e) {
        const file = e.target.files[0];
        console.log('l');
        if (!file.type.includes('image/')) {
          alert('Please select an image file');
          return;
        }

        if (typeof FileReader === 'function') {
          const reader = new FileReader();

          reader.onload = (event) => {
            this.imgSrc = event.target.result;
            // rebuild cropperjs with the updated source
            this.$refs.cropper.replace(event.target.result);
          };
          this.showCropper();
          reader.readAsDataURL(file);
        } else {
          alert('Sorry, FileReader API not supported');
        }
      },
      cropImage () {
        // get image data for post processing, e.g. upload or setting image src
        this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        // console.log(this.$refs.cropper.getData());
      },
      rotate () {
        // guess what this does :)
        this.$refs.cropper.rotate(90);
      },
      showCropper () {
        this.isShowCropper = true;
      }
    },
    computed: {
      avatar () {
        const { avatar: { 20: avatar = '' } = {} } = this.userInfo;
        return avatar;
      },
      canClean () {
        return this.name.length > 0;
      },
      sexText () {
        let sexObj = {
          1: '男',
          2: '女',
          3: '保密'
        };
        return this.sex ? sexObj[this.sex] : '选择性别';
      }
    },
    created () {
      getUserInfo(this.currentUser, user => {
        this.userInfo = { ...this.userInfo, ...user };
        console.log(this.userInfo);
        this.name = user.name;
      })
    }
  };

  export default UserSetting;
</script>
<style lang="scss" module>
  .userProfile {
    .userProfileAvatar {
      padding: 15px 0;
      border-bottom: 1px #e2e3e3 solid;
      .rowCenter {
        min-height: 50px;
        display: flex;
        align-items: center;
        .colCenter {
          display: flex;
          align-items: center;
        }
        .rightIcon {
          display: flex;
          justify-content: flex-end;
        }
    }
    
    }
    .userProfileSetting {
      .rowCenter {
        min-height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px #e2e3e3 solid;
        &:last-child {
          border: none;
        }
        .colCenter {
          display: flex;
          align-items: center;
        }
        .rightIcon {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    .SexPopup {
      width: 100%;
      background: rgba(0, 0, 0, 0);
      .sexOptions {
        border-bottom: 1px solid #e2e3e3;
        color: #333;
        border-radius: 0;
        font-size: 16px;
        &:last-child {
          margin-top: 5px;
        }
      }
    }
    .intro {
      padding-top: 5px;
      padding-bottom: 5px;
      textarea {
        border: none;
        &:hover {
          border: none;
        }
        &:focus {
          border: none;
        }
      }
    }
  }
  
</style>
<style scope lang="scss">
  .userProfile-header {
    height: 45px;
    border-bottom: 1px #ddd solid;
    .ivu-row {
      width: 100%;
    }
    .ivu-row, .ivu-col {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        height: 100%;
      }
      a {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
      }
    }
  }
  .userProfile-background-color {
    background-color: #fff;
  }
  .sexDefaultText {
    color: #999;
  }
</style>