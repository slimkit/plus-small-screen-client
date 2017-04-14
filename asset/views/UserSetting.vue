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
          <input style="padding: 0;" type="text" v-model.trim="name" :value="name" placeholder="输入新昵称" />
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
    <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <div :class="$style.AvatarSelect" v-show="isShowCropper">
        <div class="avatarOp">
          <Row :gutter="16" style="display: flex; align-items: center;">
            <Col span="3">
              <i class="ivu-icon ivu-icon-android-arrow-back" style="width: 100%; height: 100%; display: flex; align-items: center;" @click="handleHideAvatarSelect"></i>
            </Col>
            <Col span="18" style="font-size: 18px;">
              更换头像
            </Col>
            <Col span="3">
              <Button type="text" @click="getCropData">完成</Button>
            </Col>
          </Row>
        </div>
        <div :class="$style.cropper">
          <vue-cropper
            :class="$style.canvasAvatar"
            ref='cropper'
            aspect-ratio="1"
            :view-mode="2"
            :auto-crop="true"
            :min-canvas-width="200"
            :min-canvas-height="200"
            :minCropBoxWidth="100"
            :minCropBoxHeight="100"
            drag-mode="move"
            :background="true"
            :src="imgSrc"
            :cropmove="cropImage">
          </vue-cropper>
        </div>
      </div>
    </transition>
    <div :class="$style.areaSelect" v-show="areaAbout.showAreaSelectMask">
      <div
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;"
        @click="handleAreaSelect(false)"
      >
      </div>
      <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
        <mt-picker v-show="areaAbout.showAreaSelect" value-key="name" :slots="areaAbout.soltAreas" :showToolbar="true" @change="onValuesChange" style="width: 100%; padding: 8px; background: #fff; z-index: 1; position: fixed; bottom: 0;" ref="picker">
          <slot>
            <div class="areaOption" style="display: flex; justify-content: space-between;">
              <Button type="text" @click="handleAreaSelect(false)">取消</Button>
              <Button type="text" @click="chooseArea">确定</Button>
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

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  // 昵称验证规则
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
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
      cropImg: '',
      areaAbout: {
        areas: [],
        province: 0,
        city: 0,
        provinceText: "",
        cityText: "",
        formateAreas: {},
        formateProvince: [],
        showAreaSelect: false,
        showAreaSelectMask: false,
        preSelectedProvince: 0,
        preSelectedCity: 0
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
            this.showAreaSelectMask = false;
          }, 300);
        }
      },
      done (status) {
        status && this.save();
      },
      save () {
        let data
        let newName = this.name;
        let newSex = this.sex;
        let newIntro = this.intro;
        let oldName = this.userInfo.name;
        const { datas: { sex = 0 } = {} } = this.userInfo;
        let oldSex = sex;
        const { datas: { intro = '' } = {} } = this.userInfo;
        let oldIntro =  intro;
        let saveData = {};
        if(newName != oldName) {
          saveData.name = newName;
        }
        if(newIntro != oldIntro) {
          saveData.intro = newIntro;
        }
        if(oldSex != newSex) {
          saveData.sex = newSex;
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
          getUserInfo(this.currentUser, user => {
            this.userInfo = { ...this.userInfo, ...user };
          });
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '资料修改成功',
              time: 1500,
              status: true
            });
          });
        })
        .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {

          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: message,
              time: 3000,
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
      cropImage () {
        // get image data for post processing, e.g. upload or setting image src
        // this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      },
      // 获取裁剪后的图片信息
      getCropData () {
        console.log(this.$refs.cropper.getCroppedCanvas().toDataURL());
      },
      handleHideAvatarSelect () {
        this.isShowCropper = false;
        this.imgSrc = '';
      },
      showCropper () {
        this.isShowCropper = true;
      },
      formate (data, pid) {
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
      onValuesChange(picker, values) {
        let areas = this.areaAbout.formateAreas;
        let provinces = this.areaAbout.formateProvince;
        let slot = picker.getValues();
        if(this.contains(Object.keys(provinces), values[0].name)) {
          picker.setSlotValues(1, areas[values[0].name]);
          this.areaAbout.provinceText = values[0].name;
          this.areaAbout.preSelectedProvince = slot[0].id;
        } else {
          this.areaAbout.cityText = values[0].name;
          this.areaAbout.preSelectedCity = slot[0].id;
        }
      },

      // 计算元素是否在数组内
      contains (arr, obj) {  
        var i = arr.length;  
        while (i--) {  
          if (arr[i] === obj) {  
            return true;  
          }  
        }  
        return false;  
      },
      chooseArea() {
        this.areaAbout.province = this.areaAbout.preSelectedProvince;
        this.areaAbout.city = this.areaAbout.preSelectedCity;
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
      },
      areaText () {
        let text = '选择居住地';
        const { [this.areaAbout.province]: { value: province = '' } = {}, [this.city]: { value: city = ''} = {} } = this.areaAbout.areas;
        if(!this.areaAbout.province && !this.city) {
          return text;
        }
        return (province + ' ' + city);
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
        let oldName = this.userInfo.name;
        const { datas: { sex: { value: sex = 0 } = {} } = {} } = this.userInfo;
        let oldSex = sex;
        const { datas: { intro: { value:  intro = '' } = {} } = {} } = this.userInfo;
        let oldIntro =  intro;
        let changeName = (newName != oldName) && usernameReg.test(newName) && newName.length > 2 && newName.length < 13;
        let changeSex = newSex != oldSex;
        let changeIntro = newIntro != oldIntro;
        return (changeName || changeSex || changeIntro);
      }
    },
    mounted () {
      getUserInfo(this.currentUser, user => {
        this.userInfo = { ...this.userInfo, ...user };
        this.name = user.name;
        const { datas: { 
                sex: { value: sex = 0 } = {} , 
                intro: { value: intro = '' } = {},
                province: { value: province = 0 } = {},
                city: { value: city = 0 } = {},
              } = {} } = this.userInfo;
        this.sex = sex;
        this.intro = intro;
        this.areaAbout.province = province;
        this.areaAbout.city = city;

      });
      // 获取地区列表
      addAccessToken().get(createAPI('areas'), {}, {
        validateStatus: status => status === 200
      })
      .then(response => {
        let provinces = [];
        let areasObject = {};
        response.data.data.forEach((area) => {
          if(area.pid == 1) {
            provinces[area.name] = {
              name: area.name,
              id: area.id
            };
            provinces.push({
              name: area.name,
              id: area.id
            })
            areasObject[area.name] = this.formate(response.data.data, area.id);
          }
          
        });
        this.areaAbout.areas = response.data.data;
        this.areaAbout.formateProvince = provinces;
        this.areaAbout.formateAreas = { ...this.foramteAreas, ...areasObject };
      })
      .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {
        console.log(message);
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
      height: 45px;
      border-bottom: 1px solid #e2e3e3;
    },
    .cropper {
      height: calc(100% - 46px);
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
  .userProfile-header, .avatarOp {
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
    }
  }
  .avatarOp {
    background: #fff;
  }
  span.operate {
    font-size: 12px;
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