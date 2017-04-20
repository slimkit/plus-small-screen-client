<template>
	<div class="userProfile" :class="$style.userProfile">
		<div class="commonHeader">
      <Row :gutter="16">
        <Col span="3" style="display: flex; justify-content: flex-start">
          <div @click="" @click="goTo(-1)" style="display: flex; align-items: center;">
            <BackIcon height="21" width="21" color="#999" />
          </div>
        </Col>
        <Col span="17" class="title-col">
          个人资料
        </Col>
        <Col span="4" style="display: flex; justify-content: flex-end">
          <span @click="done(canSave)" class="operate" :class="{active: canSave, disabled: !canSave}">完成</span>
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
        <input ref="avatarInput" style="position:absolute; width:100%; left:0; right:0; height:100%;opacity:0;" type="file" value="" name="image" accept="image/*"
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
          <input style="padding: 0;" type="text" v-model.trim="name" :value="name" placeholder="输入新昵称" />
        </Col>
        <Col span="3" :class="$style.rightIcon">
          <div @click="clean('name')">
            <CloseIcon height="21" width="21" color="#999" />
          </div>
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
        <div @click="handleAreaSelect(true)" style="width: 100%;">
          <Col span="4">
            城市
          </Col>
          <Col span="17">
            <span :class="{cityDefaultText: !areaAbout.city}">{{ areaText }}</span>
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
          <Input 
            :class="$style.intro" 
            v-model="intro" 
            type="textarea" 
            :autosize="{minRows: 1, maxRows: 4}" 
            placeholder="编辑简介"
          >
          </Input>
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
        <Button 
          @click="setSex(1)" 
          size="large" 
          :class="$style.sexOptions" 
          type="text" :long="true"
        >
          男
        </Button>
        <Button 
          @click="setSex(2)" 
          size="large" 
          :class="$style.sexOptions" 
          type="text" 
          :long="true"
        >
          女
        </Button>
        <Button 
          @click="setSex(3)" 
          size="large" 
          :class="$style.sexOptions" 
          type="text" 
          :long="true"
        >
          保密
        </Button>
        <Button 
          @click="hideSexPopup" 
          size="large" 
          :class="$style.sexOptions" 
          type="text" 
          :long="true"
        >
          取消
        </Button>
      </div>
    </mt-popup>
    <transition 
      name="custom-classes-transition" 
      enter-active-class="animated slideInUp" 
      leave-active-class="animated slideOutDown"
    >
      <div :class="$style.AvatarSelect" v-show="isShowCropper">
        <div class="avatarOp">
          <Row 
            :gutter="16"
            style="display: flex; align-items: center;"
          >
            <Col span="3">
              <div style="display: flex; align-items: center;" @click="handleHideAvatarSelect">
                <BackIcon height="21" width="21" color="#999" />
              </div>
            </Col>
            <Col span="17" style="font-size: 18px;">
              更换头像
            </Col>
            <Col span="4" style="display: flex; justify-content: flex-end">
              <span @click="getCropData" class="operate avatarDone">完成</span>
            </Col>
          </Row>
        </div>
        <div :class="$style.cropper">
          <vue-cropper
            :class="$style.canvasAvatar"
            ref="cropper"
            :aspect-ratio="1"
            :view-mode="2"
            :auto-crop="true"
            :min-canvas-width="100"
            :min-canvas-height="100"
            :minCropBoxWidth="100"
            :minCropBoxHeight="100"
            drag-mode="move"
            :background="true"
            :src="imgSrc"
          >
          </vue-cropper>
        </div>
      </div>
    </transition>
    <div :class="$style.areaSelect" v-show="areaAbout.showAreaSelectMask">
      <div
        v-if="areaAbout.showAreaSelectMask"
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;"
        @click="handleAreaSelect(false)"
      >
      </div>
      <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
        <mt-picker
          v-if="areaAbout.showAreaSelect"
          value-key="name" 
          :slots="soltAreas" 
          :showToolbar="true" 
          @change="onValuesChange" 
          style="width: 100%; padding: 8px; background: #fff; z-index: 1; position: fixed; bottom: 0;" 
          ref="picker"
        >
          <slot>
            <div 
              class="areaOption" 
              style="display: flex; justify-content: space-between;"
            >
              <Button 
                type="text" 
                @click="handleAreaSelect(false)"
              >
                取消
              </Button>
              <Button 
                type="text"
                @click="chooseArea"
              >
                确定
              </Button>
            </div>
          </slot>
        </mt-picker>
      </transition>
    </div>
	</div>
</template>
<script>
  import { changeUrl, goTo } from '../utils/changeUrl';
  import { createAPI, addAccessToken } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';
  import VueCropper from 'vue-cropperjs';
  import { NOTICE } from '../stores/types';
  import md5 from 'js-md5';
  import { createUploadTask, uploadFile, noticeTask } from '../utils/upload';
  import { Base64 } from 'js-base64';
  import getImage from '../utils/getImage';
  import contains from '../utils/contains';
  import BackIcon from '../icons/Back';
  import CloseIcon from '../icons/Close';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  // 昵称验证规则
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
  const UserSetting = {
    components: {
      VueCropper,
      BackIcon,
      CloseIcon
    },
    data: () => ({
      currentUser: currentUser.user_id, // 当前登录用户id
      userInfo: {},
      name: '', // nickname
      sex: 0, // sex
      location: '', // 地区显示字符串
      province: 0, // 省份
      city: 0, // 城市
      storage_task_id: 0, // storage_tast_id for avatar
      isShowSexPopup: false, // is show sex select
      intro: '', // intro
      isShowCropper: false, // is show avatar cropper
      imgSrc: '', // source image for cropper
      areaAbout: { // datas for area
        areas: [],
        province: 0,
        city: 0,
        location: '',
        provinceText: "",
        cityText: "",
        formateAreas: {},
        formateProvince: [],
        showAreaSelect: false,
        showAreaSelectMask: false,
        preSelectedProvince: 0,
        preSelectedCity: 0,
        provincesObject: {},
        citysObjects: {}
      }
    }),
    methods: {
      changeUrl,
      goTo,
      handleAreaSelect (status) {
        this.areaAbout.showAreaSelect = !!status;
        if(status) {
          this.areaAbout.showAreaSelectMask = true;
        } else {
          setTimeout(() => {
            this.areaAbout.showAreaSelectMask = false;
          }, 300);
        }
      },
      done (status) {
        status && this.save();
      },
      cleanSetting () {
        this.areaAbout.province = 0;
        this.areaAbout.city = 0;
        this.areaAbout.location = 0;
        this.storage_task_id = 0;
        this.imgSrc = '';
      },
      save () {
        // 新数据
        let newName = this.name;
        let newSex = this.sex;
        let newIntro = this.intro;
        let newProvince = this.areaAbout.province;
        let newCity = this.areaAbout.city;
        let newLocation = this.areaAbout.location;
        let storage_task_id = this.storage_task_id;

        // 旧数据
        let oldName = this.userInfo.name;
        let oldProvince = this.province;
        let oldCity = this.city;
        let oldLocation = this.location;
        const { datas: { sex = 0 } = {} } = this.userInfo;
        let oldSex = sex;
        const { datas: { intro = '' } = {} } = this.userInfo;
        let oldIntro =  intro;

        let saveData = {};

        if(newName != oldName) {
          saveData.name = newName;
        }
        if(newProvince != oldProvince && newProvince != 0) {
          saveData.province = newProvince;
        }

        if(newLocation != oldLocation && newLocation != '')
        {
          saveData.location = newLocation;
        }

        if(newCity != oldCity && newCity != 0) {
          saveData.city = newCity;
        }

        if(newIntro != oldIntro) {
          saveData.intro = newIntro;
        }
        if(oldSex != newSex) {
          saveData.sex = newSex;
        }
        if(storage_task_id != 0) {
          saveData.storage_task_id = storage_task_id;
        }
        addAccessToken().patch(
          createAPI('users'),
          {
            ...saveData
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          getUserInfo(this.currentUser, 30, user => {
            this.userInfo = { ...this.userInfo, ...user };
          });
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '资料修改成功',
              time: 1500,
              status: true
            });
          });
          this.cleanSetting();
        })
        .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {

          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: message,
              time: 1500,
              status: true
            });
          });
        })
      },
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
      // 获取裁剪后的图片信息
      getCropData () {
        let reg = /data:(.*?);/;
        let base64Reg = /^data:(.*?);base64,/;
        let fileUpload = {};
        let fileName = this.$refs.avatarInput.value;
        // 获取本地文件名
        fileUpload.origin_filename = fileName.replace('C:\\fakepath\\', '');
        let fileData = this.$refs.cropper.getData();
        // 截取高度
        fileUpload.height = parseInt(fileData.height);
        // 截取宽度
        fileUpload.width = parseInt(fileData.width);
        let fileStreamData = this.$refs.cropper.getCroppedCanvas().toDataURL();
        let fileSource = Base64.decode(fileStreamData.replace(base64Reg, ''));

        // 截取文件的mime_type
        fileUpload.mime_type = fileStreamData.match(reg)[1];
        // 被截取部分的hash
        fileUpload.hash = md5(fileSource);
        // create storage task
        createUploadTask(fileUpload, data => {
          if(data.hasOwnProperty('storage_id') && data.hasOwnProperty('storage_task_id')){
            this.handleHideAvatarSelect();
            this.storage_task_id = data.storage_task_id;
            this.userInfo.avatar[30] = getImage(data.storage_id, 30);
            this.$set(this.userInfo.avatar, '50', getImage(data.storage_id, 50));
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: 'success',
                time: 1500,
                status: true
              });
            });
            return;
          }
          // upload file
          uploadFile(data, fileStreamData, uploadInfo => {
            // notice server with uploaded-info
            noticeTask(data.storage_task_id, uploadInfo, noticeInfo => {
              this.handleHideAvatarSelect();
              this.userInfo.avatar[30] = fileStreamData;
              this.storage_task_id = data.storage_task_id;
              this.$store.dispatch(NOTICE, cb => {
                cb({
                  text: 'success',
                  time: 1500,
                  status: true
                });
              });
            });
          })
        });
      },
      handleHideAvatarSelect () {
        this.isShowCropper = false;
        this.imgSrc = '';
        this.$refs.avatarInput.value = '';
      },
      showCropper () {
        this.isShowCropper = true;
      },
      formateCitysArray (data, pid) {
        let newCitys = [];
        data.forEach((area) => {
            if(area.pid == pid) {
              newCitys.push({
                name: area.name,
                id: area.id
              });
            }
        });
        return newCitys;
      },
      formateCitysObject (data, pid) {
        let newCitys = {};
        data.forEach((area) => {
            if(area.pid == pid) {
              newCitys[area.name] = {
                name: area.name,
                id: area.id
              };
            }
        });
        return newCitys;
      },
      onValuesChange(picker) {
        let areas = this.areaAbout.formateAreas;
        let provinces = this.areaAbout.provincesObject;
        // 当前选中数据
        let slot = picker.getValues();
        if(slot[0] instanceof Object) {
          if(contains(Object.keys(provinces), slot[0].name)) {
            picker.setSlotValues(1, areas[slot[0].name] ? areas[slot[0].name] : areas[北京市]);
            this.areaAbout.provinceText = slot[0].name;
            this.areaAbout.preSelectedProvince = slot[0].id;
          } else {
            this.areaAbout.cityText = slot[0].name;
            this.areaAbout.preSelectedCity = slot[0].id;
          }
        }
      },
      chooseArea() {
        this.areaAbout.province  = this.areaAbout.preSelectedProvince;
        this.areaAbout.city = this.areaAbout.preSelectedCity;
        this.areaAbout.location = this.areaAbout.provinceText + ' ' + this.areaAbout.cityText;

      }
    },
    computed: {
      avatar () {
        const { avatar: { 30: avatar = '' } = {} } = this.userInfo;

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
      },
      areaText () {
        let text = this.location ? this.location : '选择居住地';
        if(this.areaAbout.location) {
          text = this.areaAbout.location;
        }
        this.handleAreaSelect(false);
        return text;
      },

      soltAreas () {
        let areas = this.areaAbout.formateAreas;
        let provinces = this.areaAbout.formateProvince;
        if(provinces.length == 0) {
          provinces = [{name: '', id: 0}];
        }
        let citys = [];
        if(this.areaAbout.provinceText == "") {
          citys = ['北京'];
        } else {
          citys = areas[this.areaAbout.provinceText];
        }
        return [
          {
            flex: 1,
            values: provinces,
            className: 'slot1',
            textAlign: 'center'
          }, {
            flex: 1,
            values: citys,
            className: 'slot3',
            textAlign: 'center'
          }
        ]
      },
      canSave () {
        let newName = this.name;
        let newSex = this.sex;
        let newIntro = this.intro;
        let newProvince = this.areaAbout.province;
        let newCity = this.areaAbout.city;
        let newLocation = this.areaAbout.location;

        let oldProvince = this.province;
        let oldCity = this.city;
        let oldLocation = this.location;
        let oldName = this.userInfo.name;
        const { datas: { sex: { value: sex = 0 } = {} } = {} } = this.userInfo;
        let oldSex = sex;
        const { datas: { intro: { value:  intro = '' } = {} } = {} } = this.userInfo;
        let oldIntro =  intro;
        let changeName = (newName != oldName) && usernameReg.test(newName) && newName.length > 2 && newName.length < 13;
        let changeSex = newSex != oldSex && newSex != 0;
        let changeIntro = newIntro != oldIntro && newIntro != '';
        let changeAvatar = this.storage_task_id != 0;
        let changeProvince = newProvince != oldProvince && newProvince != 0;
        let changeCity = newCity != oldCity && newCity != 0;
        let changeLocation = newLocation != oldLocation && newLocation != '';
        return (changeName || changeSex || changeIntro || changeAvatar || changeProvince || changeCity || changeLocation);
      }
    },
    mounted () {
      getUserInfo(this.currentUser, 30, user => {
        this.userInfo = { ...this.userInfo, ...user };
        this.name = user.name;
        const { datas: { 
                sex: { value: sex = 0 } = {} , 
                intro: { value: intro = '' } = {},
                province: { value: province = 0 } = {},
                city: { value: city = 0 } = {},
                location: { value: location = '' } = {}
              } = {} } = this.userInfo;
        this.sex = sex;
        this.intro = intro;
        this.province = province;
        this.city = city;
        this.location = location;

      });
      // 获取地区列表
      addAccessToken().get(createAPI('areas'), {}, {
        validateStatus: status => status === 200
      })
      .then(response => {
        // 格式化的地区省份 用于select展示
        let provincesArray = [];
        // 格式化的市级数据，用于select展示
        let areasObject = {};
        // 格式化的省份对象，用于数据获取
        let provincesObject = {};
        // 格式化的市级对象，用于数据获取
        let citysObjects = {};
        response.data.data.forEach((area) => {
          if(area.pid == 1) {
            // 格式化的地区省份 用于select展示
            provincesArray.push({
              name: area.name,
              id: area.id
            });
            // 格式化的省份对象
            provincesObject[area.name] = {
              name: area.name,
              id: area.id
            };
            // 格式化的市级数据，用于select展示
            areasObject[area.name] = this.formateCitysArray(response.data.data, area.id);
            citysObjects[area.name] = this.formateCitysObject(response.data.data, area.id);
          }
          
        });
        // this.areaAbout.areas = response.data.data;
        this.areaAbout.formateProvince = provincesArray;
        this.areaAbout.formateAreas = { ...this.foramteAreas, ...areasObject };
        this.areaAbout.provincesObject = { ...this.provincesObject, ...provincesObject };
        this.areaAbout.citysObjects = { ...this.citysObjects, ...citysObjects };
      })
      .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: message,
            time: 1500,
            status: true
          });
        });
      });
    }
  };

  export default UserSetting;
</script>
<style lang="scss" module>
  .areaSelect {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: hidden;
    margin: 0;
    background: rgba(0, 0, 0, .3);
    display: flex;
    align-items: flex-end;
  }
  .avatar {
    border-radius: 50%;
    width: 100%;
  },
  .AvatarSelect {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    margin: 0;
    height: 100%;
    width: 100%;
    .avatarOp {
      height: 55px;
      border-bottom: 1px solid #e2e3e3;
    },
    .cropper {
      height: 100%;
      width: 100%;
    }
    .canvasAvatar {
      height: 100%;
      width: 100%;
    }
  }
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
        padding-left: 0;
        padding-right: 0;
        &:hover, &:focus {
          border: none;
          box-shadow: none;
        }
      }
    }
  }
  
</style>
<style scope lang="scss">
  .avatarOp {
    height: 55px;
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
    }
  }
  .avatarOp {
    background: #fff;
  }
  span.operate {
    font-size: 14px;
  }
  span.operate.avatarDone{
    color: #59b6d7;
  }
  span.active {
    color: #59b6d7;
  }
  span.disabled {
    color: #999;
  }
  .userProfile-background-color {
    background-color: #fff;
  }
  .sexDefaultText {
    color: #999;
  }
</style>