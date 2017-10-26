<template>
  <div class="changePassword" v-if="nextState == 0">
    <div class="commonHeader">
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          基本信息
        </Col>
      </Row>
    </div>
    <div class="changePassword-content changePassword-bakcground-color" :class="$style.entry">
       <!-- 个人认证 -->
      <template  v-if="certification.type == 'user'">
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            真实姓名
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.name" placeholder="输入真实姓名" id="name" name="name" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showNameImputIcon" height="21" width="21" color="#999" @click.native="clearInput('name')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            身份证号
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.number" placeholder="输入正确身份证号码" id="number" name="number" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showNumberImputIcon" height="21" width="21" color="#999" @click.native="clearInput('number')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            手机号
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.phone" placeholder="输入11位手机号" id="phone" name="phone" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showPhoneImputIcon" height="21" width="21" color="#999" @click.native="clearInput('phone')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            认证描述
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.desc" placeholder="请慎重填写" id="desc" name="desc" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showDescImputIcon" height="21" width="21" color="#999" @click.native="clearInput('desc')" />
          </Col>
        </Row>
      </template>
      <!-- 企业认证 -->
      <template v-else>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            机构名称
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.org_name" placeholder="输入机构名称" id="org_name" name="org_name" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showOrgNameImputIcon" height="21" width="21" color="#999" @click.native="clearInput('org_name')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            机构地址
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.org_address" placeholder="输入机构地址" id="org_address" name="org_address" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showOrgAddressImputIcon" height="21" width="21" color="#999" @click.native="clearInput('org_address')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            负责人
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.name" placeholder="输入真实姓名" id="name" name="name" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showNameImputIcon" height="21" width="21" color="#999" @click.native="clearInput('name')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="8">
            身份证号码
          </Col>
          <Col span="13">
            <input type="text"  size="large" v-model.trim="certification.number" placeholder="输入正确身份证号码" id="number" name="number" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showNumberImputIcon" height="21" width="21" color="#999" @click.native="clearInput('number')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="8">
            负责人电话
          </Col>
          <Col span="13">
            <input type="text"  size="large" v-model.trim="certification.phone" placeholder="输入11位手机号" id="phone" name="phone" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showPhoneImputIcon" height="21" width="21" color="#999" @click.native="clearInput('phone')" />
          </Col>
        </Row>
        <Row :gutter="24" :class="$style.entryMenu">
          <Col span="6">
            认证描述
          </Col>
          <Col span="15">
            <input type="text"  size="large" v-model.trim="certification.desc" placeholder="该描述会影响审核,请慎重填写" id="desc" name="desc" />
          </Col>
          <Col span="3">
            <CloseIcon v-show="showDescImputIcon" height="21" width="21" color="#999" @click.native="clearInput('desc')" />
          </Col>
        </Row>
      </template>
    </div>
    <Row :gutter="24">
      <Col span="24">
        <p class="notice error">{{ error }}</p>
      </Col>
    </Row>
    <div :class="$style.next">
      <Col span="20" offset="2">
        <Button type="primary" size="large"  @click="handleNext" v-if="validateBasicInfo" long>下一步</Button>
        <Button size="large" v-else disabled long>下一步</Button>
      </Col>
    </div>
  </div>
  <div v-else>
    <div class="commonHeader"> 
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start" @click.native="backPreviousPage">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          上传资料
        </Col>
        <Col span="5" class="header-end-col">
          <Button type="text" :disabled="isDisabled" @click="handleSubmit">提交</Button>
        </Col>
      </Row>
    </div>
    <div>
      <Row :gutter="24">
        <Col style="color:#999;">{{ certification.type == 'org' ? '上传企业机构营业执照' : '上传身份证正反面照片' }}</Col>
      </Row> 
      <Row :gutter="24">
        <Upload
            multiple
            type="drag"
            :action="upload.url"
            :headers="upload.headers"
            style="width:100%;background:#F7F7F7;height:100px;padding:10px;"
            :format="['jpg','jpeg','png']"
            :on-format-error="handleOnFormatError"
            :show-upload-list="false"
            :on-success="handleFrontUploadSuccess">
            <div style="padding: 20px 0" v-if="!upload.front">
                <Icon type="camera" size="30"></Icon>
                <p>点击上传照片</p>
            </div>
            <div v-else>
              <img :src="upload.url+'/'+upload.front" style="width:100%;max-height:100px;">
            </div>
        </Upload>
      </Row>
      <Row :gutter="24" v-show="upload.front && certification.type=='user'">
        <Upload
            multiple
            type="drag"
            :action="upload.url"
            :headers="upload.headers"
            style="width:100%;background:#F7F7F7;height:100px;padding:10px;"
            :format="['jpg','jpeg','png']"
            :on-format-error="handleOnFormatError"
            :show-upload-list="false"
            :on-success="handleBackUploadSuccess">
            <div style="padding: 20px 0" v-if="!upload.back">
                <Icon type="camera" size="30"></Icon>
                <p>点击上传照片</p>
            </div>
            <div v-else>
              <img :src="upload.url+'/'+upload.back" style="width:100%;max-height:100px;">
            </div>
        </Upload>
      </Row>
    </div>
  </div>
</template>
<script>
  import storeLocal from 'store';
  import BackIcon from '../icons/Back';
  import CloseIcon from '../icons/Close';
  import { NOTICE } from '../stores/types';
  import { goTo, changeUrl } from '../utils/changeUrl';
  import { createAPI, addAccessToken } from '../utils/request';
  import { getUserCertification } from '../utils/user';

  const certification = {
    components: {
      BackIcon,
      CloseIcon,
    },
    data: () => ({
      error: '',
      state: '',
      nextState: 0,
      isDisabled: true,
      certification: {
        type: '',
        name: '',
        desc: '',
        number: '',
        phone: '',
        org_name: '',
        org_address: '',
        files: [],
      },
      upload: {
        url: window.TS_WEB.api + '/files',
        headers: {
          Authorization: `Bearer ${storeLocal.get('UserLoginInfo').token}`,
        },
        // 认证资料正面
        front: null,
        // 认证资料反面
        back: null,
      }
    }),
    watch: {
      'nextState' () {
        if (this.nextState == 1) {
          this.upload.back = null;
          this.upload.front = null;
        }
      },
      'upload.back' () {
        const { front, back } = this.upload;
        this.isDisabled = (front && back) ? false : true;
      },
      'upload.front' () {
        let type = this.certification.type;
        let front = this.upload.front;
        this.isDisabled = (type == 'org' && front) ? false : true;
      }
    },
    computed: {
      showNameImputIcon () {
        return this.certification.name.length > 0;
      },
      showNumberImputIcon () {
        return this.certification.number.length > 0;
      },
      showPhoneImputIcon () {
        return this.certification.phone.length > 0;
      },
      showDescImputIcon () {
        return this.certification.desc.length > 0;
      },
      showOrgNameImputIcon () {
        return this.certification.org_name.length > 0;
      },
      showOrgAddressImputIcon () {
        return this.certification.org_address.length > 0;
      },
      /**
       * 验证表单计算属性
       */
      validateBasicInfo () {
        const { name, number, phone, desc, org_name, org_address } = this.certification;
        let bool = (name.length <= 0) || (number.length <= 0) || (phone.length <= 0) || (desc.length <= 0);
        if (this.certification.type == 'org') {
          bool = bool || (org_name.length <=0) || (org_address.length <= 0);
        }
        return bool ? false : true;
      }
    },
    methods: {
      goTo,changeUrl,
      /**
       * 清除表单内容
       */
      clearInput (name) {
        this.certification[name] = '';
      },
      /**
       * 验证身份证
       */
      validateIDCard (number) {
        let isIDCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return isIDCard.test(this.certification.number);
      },
      /**
       * 验证手机
       */
      validatePhone (phone) {
        let isPhone = /^(\+?0?86\-?)?((13\d|14[57]|15[^4,\D]|17[3678]|18\d)\d{8}|170[059]\d{7})$/;
        return isPhone.test(this.certification.phone);
      },
      /**
       * 点击下一步
       */
      handleNext () {
        const { name, number, phone, desc } = this.certification;

        if (!this.validateIDCard(number)) {
          this.error = '请填写正确的身份证号码';
          return false;
        }
        if (!this.validatePhone(phone)) {
          this.error = '请填写正确的手机号';
          return false;
        }

        this.error = null;
        this.nextState = 1;
      },
      /**
       * 处理机构认证正面照上传
       */
      handleFrontUploadSuccess (res, file) {
        this.upload.front = res.id;
      },
      /**
       * 处理机构认证反面照上传
       */
      handleBackUploadSuccess (res, file) {
        this.upload.back = res.id;
      },
      handleOnFormatError (file) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            show: true,
            time: 2000,
            status: false,
            text: `不支持的图片格式，请上传:jpg，jpeg，png格式的图片`,
          });
        });
      },
      /**
       * 返回上一步
       */
      backPreviousPage () {
        this.nextState = 0;
        this.isDisabled = true;
      },
      /**
       * 提交认证信息
       */
      handleSubmit () {
        let type = this.certification.type;
        const { front, back } = this.upload;
        this.certification.files = (type == 'user') ? [front, back] : [front];
        // 提交过认证被拒绝 进行更新操作
        if (parseInt(this.state) === 1) {
          addAccessToken().patch(
            createAPI('user/certification'),
            { ...this.certification },
            { validateStatus: status => status === 201 },
          ).then(({ data: { message: [ message ] = [] } }) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                show: true,
                time: 1500,
                status: true,
                text: message,
              });
            });
            setTimeout( () => {
              this.$router.go(-1);
            }, 1500);
          }).catch(({ response: { data: { message = ['更新认证失败，请稍后再试试'] } } = {} }) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                show: true,
                time: 1500,
                status: false,
                text: message,
              });
            });
          });
        } else {
          // 未提交过认证 进行创建操作
          addAccessToken().post(
            createAPI('user/certification'),
            { ...this.certification },
            { validateStatus: status => status === 201 },
          ).then(({ data: { message: [ message ] = [] } }) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                show: true,
                time: 1500,
                status: true,
                text: message,
              });
            });
            setTimeout( () => {
              this.$router.go(-1);
            }, 1500);
          }).catch(({ response: { data: { message = ['提交认证失败，请稍后再试试'] } } = {} }) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                show: true,
                time: 1500,
                status: false,
                text: message,
              });
            });
          });
        }
      }
    },
    created () {
      const { type, state } = this.$route.query;
      this.certification.type = type;
      this.state = state;
    }
  };
  export default certification;
</script>
<style lang="scss" module>
  .entry {
    background-color: #fff;
    .entryMenu {
      height: 50px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ededed;
      &:last-child {
        border-bottom: none;
      }
      .rightIcon {
        display: flex!important;
        justify-content: flex-end!important;
      }
    }
  }
  .next {
    margin-top: 20px;
  }
</style>
