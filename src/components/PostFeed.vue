<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    <div :class="$style.postRoot" v-show="show">
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
      <div :class="$style.upload" v-if="!textOnly">
        <template>
          <div :class="$style.uploadList">
            <div :class="$style.demoUploadList" v-for="(item, index) in uploadList">
              <template v-if="item.status === 'finished'">
                  <img :src="item.url" :alt="item.name">
                  <div :class="$style.demouploadListCover" @click="handleOpenImageSetting(index)" style="postion: relative">
                    <CloseIcon height="18" width="18" color="rgba(200,200,200,1)" style="position: absolute; right:3px; top:3px;" @click.stop.native="handleRemove(index)" />
                    <img v-show="setImageAmount" :src="editPic" style="width: 6vw; height: 6vw; position: absolute;top:50%; left:50%;transform: translate(-50%, -50%)"/>
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
          </div>
        </template>
        <section :class="$style.imageAmountSet">
          <Row :gutter="24" :class="$style.amountSet">
            <Col span="12">
              是否收费
            </Col>
            <Col span="12" class="header-end-col">
              <Switch v-model="setImageAmount" @on-change="imageAmountSettingChange"></Switch>
            </Col>
          </Row>
        </section>
      </div>
      <template v-if="textOnly">
        <section :class="$style.textAmountSet">
          <Row :gutter="24" :class="$style.amountSet">
            <Col span="12">
              是否收费
            </Col>
            <Col span="12" class="header-end-col">
              <Switch v-model="setTextAmount" @on-change="textAmountSettingChange"></Switch>
            </Col>
          </Row>
          <section v-if="setTextAmount">
            <Row :gutter="24">
              <Col span="24">
                <p style="color: #bfbfbf; padding: 12px 0; border-top: 1px solid #ededed;">选择文字要收取的{{goldName}}数量</p>
              </Col>
            </Row>
            <Row :gutter="24" style="padding: 4px 0 14px 0;">
              <Col span="8" :class="$style.defaultAmount">
                <Button @click.native="setTextAmountNum(trueAmount(1))" :class="[$style.amount, 'ivu-btn', 'ivu-btn-ghost', {active: showAmount(amount) == 1 && customAmount === ''}]">1.00</Button>
              </Col>
              <Col span="8" :class="$style.defaultAmount">
                <Button @click.native="setTextAmountNum(trueAmount(5))" :class="[$style.amount,'ivu-btn', 'ivu-btn-ghost', {active: showAmount(amount) == 5 && customAmount === ''}]">5.00</Button>
              </Col>
              <Col span="8" :class="$style.defaultAmount">
                <Button @click.native="setTextAmountNum(trueAmount(10))" :class="[$style.amount,'ivu-btn', 'ivu-btn-ghost', {active: showAmount(amount) == 10 && customAmount === ''}]">10.00</Button>
              </Col>
            </Row>
            <Row :gutter="24" style="padding: 12px 0; border-top: 1px solid #ededed;">
              <Col span="12">
                自定义数量
              </Col>
              <Col span="12" class="header-end-col">
                <input type="number" :min="1 / 100 / 100 * ratio" autocomplete="off" dir="rtl" :placeholder="`输入${goldName}数量`"  style="width: 100%;" v-model.number="customAmount" />
              </Col>
            </Row>
            <Row :gutter="24" style="padding: 12px 0; border-top: 1px solid #ededed;">
              <Col span="24">
                <p style="color: #bfbfbf;">注: 超过50字部分内容收费</p>
              </Col>
            </Row>
          </section>
        </section>
      </template>
      <!--图片付费设置组件-->
      <template v-if="imageSetting && !textOnly">
        <div :class="$style.imageAmountSetting">
          <header :class="['commonHeader', $style.commonHeader]">
            <Row :gutter="24">
              <Col span="5">
                <BackIcon @click.native="hideSwiper" width="21" height="21" color="#bfbfbf" />
              </Col>
              <Col offset="11" span="8" class="header-end-col" v-if="setImageAmount">
                <Button type="text" @click.native="handlePerImageSettingOpen">收费选项</Button>
              </Col>
            </Row>
          </header>
          <section :class="$style.imagesContainer">
            <swiper
              :class="[{ active: show }, $style.swiperRoot]"
              :options="options"
              ref="mySwiper"
            >
              <swiper-slide class="swiperSlide" v-for="(item, index) in uploadList" :key="index">
                <div class="swiper-zoom-container">
                  <img :data-src="`${item.url}`" class="swiper-lazy">
                  <div class="swiper-lazy-preloader"></div>
                </div>
              </swiper-slide>
            </swiper>
          </section>
          <footer style="height:40px">
            <Row :gutter="24" style="height: 40px; border-top: 1px solid #ededed;">
              <Col offset="18" span="6">
                <Button type="primary" @click="hideSwiper" size="small" style="width: 100%;">
                  完成({{images.length}}/9)
                </Button>
              </Col>
            </Row>
          </footer>
        </div>
        <Modal 
          v-model="perImageSettingOpen"
          width="80vw" 
          :mask-closable="false"
          @on-cancel="canncelSetting"
        >
          <p slot="header">设置图片收费</p>
          <div>
            <Row :gutter="24">
              <Col span="24">
                设置图片收费方式
              </Col>
            </Row>
            <Row :gutter="24" style="padding-top: 12px;">
              <Col span="12">
                <Button long @click.native="setImageAmountInfo('read', 'type')" :class="['ivu-btn', 'ivu-btn-ghost', {active: currentImageSetting.type === 'read'}]">查看收费</Button>
              </Col>
              <Col span="12">
                <Button long @click.native="setImageAmountInfo('download', 'type')" :class="['ivu-btn', 'ivu-btn-ghost', {active: currentImageSetting.type === 'download'}]">下载收费</Button>
              </Col>
            </Row>
            <Row :gutter="24" style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e9eaec;">
              <Col span="24">
                选择图片收取{{goldName}}数量
              </Col>
            </Row>
            <Row :gutter="24" style="padding-top: 12px;">
              <Col span="8">
                <Button long @click.native="setImageAmountInfo(trueAmount(1))" :class="['ivu-btn', 'ivu-btn-ghost', {active: showAmount(currentImageSetting.amount) == 1 && !currentImageSetting.customAmount}]">{{ 1.00 }} </Button>
              </Col>
              <Col span="8">
                <Button long @click.native="setImageAmountInfo(trueAmount(5))" :class="['ivu-btn', 'ivu-btn-ghost', {active: showAmount(currentImageSetting.amount) == 5 && !currentImageSetting.customAmount}]">{{ 5.00 }} </Button>
              </Col>
              <Col span="8">
                <Button long @click.native="setImageAmountInfo(trueAmount(10))" :class="['ivu-btn', 'ivu-btn-ghost', {active: showAmount(currentImageSetting.amount) == 10 && !currentImageSetting.customAmount}]">{{ 10.00 }} </Button>
              </Col>
            </Row>
            <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 12px; margin-top: 12px; font-size: 14px; border-top: 1px solid #e9eaec">
              <Col span="12" class-name="text-align-left">
                <label for="account">自定义{{ goldName }}数量</label>
              </Col>
              <Col span="12"  class-name="text-align-right">
                <input  style="width: 100%;" v-model="currentImageSetting.customAmount" type="number" autocomplete="off" dir="rtl" :placeholder="`输入${goldName}数量`" />
              </Col>
            </Row>
          </div>
          <div slot="footer">
              <Button type="ghost" @click.native="resetImageSetting">重置</Button>
              <Button type="primary" @click.native="setImageSetting" :disabled="!currentImageSetting.amount && !currentImageSetting.customAmount">确认</Button>
          </div>
        </Modal>
      </template>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import { SHOWPOST, NOTICE, ADDFOLLOWINGIDS, ADDNEWIDS, FEEDSLIST, SHOWPREPOST } from '../stores/types';
import { createAPI, addAccessToken, createRequestURI } from '../utils/request';
import buildURL from 'axios/lib/helpers/buildURL';
import storeLocal from 'store';
import lodash from 'lodash';
import CameraIcon from '../icons/Camera';
import BackIcon from '../icons/Back';
import CloseIcon from '../icons/Close';
import LoadingWhiteIcon from '../icons/LoadingWhite';
import plueMessageBundle from 'plus-message-bundle';
import { trueAmount, showAmount } from '../utils/balance';
import { resolveImage } from '../utils/resource';

const editPic = resolveImage(require('../statics/images/ico_edit_pen.png'));

const UserLoginInfo = storeLocal.get('UserLoginInfo') || {};
//
const postFeed = {
  components: {
    CameraIcon,
    CloseIcon,
    LoadingWhiteIcon,
    BackIcon
  },
  data: () => ({
    editPic, // 编辑图片按钮
    goldName: window.TS_WEB.goldName,
    ratio: 100, // 比例
    setTextAmount: false,// 文字设置收费
    setImageAmount: false, // 设置图片收费
    customAmount: '', // 自定义收费数量
    amount: 0, // 动态收费金额
    feedContent: '', // 动态内容
    uploadList: [], // 本地选中的图片列表
    uploadUri: createAPI('files'), // 图片上传的接口
    headers: { Authorization: `Bearer ${UserLoginInfo.token || ''}` },
    images: [],
    format: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp'],
    maxSize: 5120,
    loading: false,
    imageSetting: false, // 图片付费设置开启
    activeIndex: -1, // 设置图片收费时走马灯的索引
    perImageSettingOpen: false, // 单张图片设置收费弹窗开关
    currentImageSetting: { // 当前被设置的图片的收费属性
      id: 0,
      type: '',
      amount: 0,
      customAmount: ''
    }
  }),
  computed: {
    ...mapState({
      show: state => state.showPost.showPost.show,
      textOnly: state => state.showPost.showPost.textOnly
    }),
    isDisabled () {
      return !(this.feedContent.length || this.images.length);
    },
    canSetPinned () {
      return this.feedContent.length > 50;
    },
    /**
     * swiper参数
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    options: function (state) {
      let _this = this;
      return {
        speed: 200,
        autoplay: 0,
        setWrapperSize :false,
        direction : 'horizontal',
        initialSlide: this.activeIndex,
        pagination : '.swiper-pagination',
        preloadImages:false,
        notNextTick: true,
        zoom : true,
        slidesPerView: 1,
        watchSlidesVisibility: true,
        lazyLoading : true,
        preventLinksPropagation: false,
        preventClicks: false,
        updateOnImagesReady: true,
        onClick(swiper){
          _this.hideSwiper(swiper);
        },
        debugger: true,
        onSlideChangeEnd(swiper) {
          _this.handleSwiperSwitch(swiper);
        },
        onDestroy () {
          setTimeout( () => {
            document.body.style.overflow = 'hidden';
          }, 800);
        }
      };
    },
    /**
     * server返回的filewithid
     * @return {[type]} [description]
     */
    fileWithId () {
      const { activeIndex, uploadList } = this;
      if (activeIndex === -1) return 0;

      let img = uploadList[activeIndex];

      const { response: { id  = 0} } = img;

      return id;
    },

    /**
     * server返回的filewith所在的数组索引
     * @return {[type]} [description]
     */
    fileWithIndex () {
      let index = lodash.findIndex(this.images, o => {
        return o.id === this.fileWithId;
      });

      return index;
    },
  },
  watch: {
    customAmount: function (a) {
      if (a !== '') {
        this.amount = 0;
      }
    }
  },
  methods: {
    trueAmount,
    showAmount,
    /**
     * 检测动态内容合法性
     * @return {[type]} [description]
     */
    checkImageAmountSetting (feed_data) {
      // 图片动态
      if (!this.textOnly) {
        if (!feed_data.feed_content.length && !this.images.length) {
          this.$Notice.warning({
            title: '内容呢?',
            desc: '文字内容和图片必须至少存在一项'
          });
          this.loading = false;

          return false;
        }

        // 检测图片收费设置是否成功
        if (this.setImageAmount) { 
          const { images } = this;
          let index = lodash.findIndex(images, image => {
            return image.amount && image.type; 
          });

          if (index === -1) {

            this.$Notice.warning({
              title: '说明',
              desc: '请至少设置一张图片的付费信息'
            });
            this.loading = false;

            return false;
          }

          feed_data.images = this.images;
        }
        else {
          if(this.images.length) {
            feed_data.images = this.images;
          }
        }

        return feed_data;
      }

      // 文字动态
      if (this.textOnly) {
        if (!this.setTextAmount) {
          if(!feed_data.feed_content.length) {
            this.$Notice.warning({
              title: '说明',
              desc: '动态内容不能为空'
            });
            this.loading = false;

            return false;
          }

          return feed_data;
        }

        if(feed_data.feed_content.length <= 50) {
          this.$Notice.warning({
            title: '说明',
            desc: '内容超出50字部分才能设置收费'
          });
          this.loading = false;

          return false;
        }

        if(this.customAmount === '' && this.amount === 0 ) {
          this.$Notice.warning({
            title: `请设置付费信息`,
            desc: `请选择或自定义需要付费的${this.goldName}数量` 
          });
          this.loading = false;

          return false;
        }

        // 自定义收费
        if (this.customAmount !== '') {
          if(parseInt(this.customAmount) < 1 || !lodash.isInteger(this.customAmount)) {
            this.$Notice.warning({
              title: `${this.goldName}设置错误`,
              desc: `${this.goldName}必须为大于0的整数` 
            });
            this.loading = false;
            return false;
          }

          feed_data.amount = trueAmount(this.customAmount);

          return feed_data;
        }

        // 选项收费
        if (this.amount !== 0) {
          if(this.amount < 1 || !lodash.isInteger(this.amount)) {
            this.$Notice.warning({
              title: `${this.goldName}设置错误`,
              desc: `${this.goldName}必须为大于0的整数` 
            });
            this.loading = false;
            return;
          }

          feed_data.amount = this.amount;

          return feed_data;
        }

      }
    },
    /**
     * 将付费信息植入需要传递的数据中
     */
    setImageSetting () {
      let currentImageSetting = this.currentImageSetting;
      if (!currentImageSetting.amount && !currentImageSetting.customAmount) {
        this.$Notice.warning({
          title: '图片付费设置不完整',
          desc: `请设置当前图片所需的${goldName}数量`
        });
        return ;
      }

      if (currentImageSetting.type !== 'download' && currentImageSetting.type !== 'read') {
        this.$Notice.warning({
          title: '图片付费类型不正确',
          desc: '请选择[下载收费]或[查看收费]'
        });
        return;
      }
      if (currentImageSetting.amount) {
        delete currentImageSetting.customAmount;
      }

      if (currentImageSetting.customAmount) {
        delete currentImageSetting.amount
      }
      
      this.images[this.fileWithIndex] = {
        ...this.images[this.fileWithIndex],
        ...currentImageSetting
      };

      this.currentImageSetting = {
        ...{
          id: 0,
          amount: 0,
          customAmount: '',
          type: ''
        }
      }
      this.perImageSettingOpen = false;
    },
    /**
     * 重置图片付费设置
     * @return {[type]} [description]
     */
    resetImageSetting () {
      this.currentImageSetting = {
        ...{
          type: '',
          amount: 0,
          customAmount: ''
        }
      }
    },
    /**
     * 关闭图片付费的modal时，延时设置body的样式,防止页面可以滚动
     * @return {[type]} [description]
     */
    canncelSetting () {
      setTimeout( () => {
        document.body.style.overflow = 'hidden';
      }, 500);
    },
    /**
     * 开启单张图片收费设置的modal
     * @return {[type]} [description]
     */
    handlePerImageSettingOpen () {
      let data = {
        type: '',
        id: '',
        amount: 0,
        customAmount: ''
      };
      if(this.images[this.fileWithIndex].type) data.type = this.images[this.fileWithIndex].type;
      if(this.images[this.fileWithIndex].amount) {
        if(this.images[this.fileWithIndex].amount === 1000 || this.images[this.fileWithIndex].amount === 500 || this.images[this.fileWithIndex].amount === 100) {
          data.amount = this.images[this.fileWithIndex].amount;
        } else {
          data.customAmount = this.images[this.fileWithIndex].amount;
        }
      }
      data.id = this.images[this.fileWithIndex].id;
      this.currentImageSetting = { ...this.currentImageSetting, ...data};
      this.perImageSettingOpen = true;
    },
    /**
     * 打开swiper
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    handleOpenImageSetting(index) {
      this.imageSetting = true;
      this.initSwiper = index;
      this.activeIndex = index;
    },

    handleSwiperSwitch (swiper) {
      this.activeIndex = swiper.activeIndex;
    },

    /**
     * 单击关闭swiper
     * @param  {[type]} swiper [description]
     * @return {[type]}        [description]
     */
    hideSwiper (swiper) {
      this.imageSetting = false;
      this.initSwiper = -1;
      this.activeIndex = -1;
      setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, 500);
    },
    /**
     * 开启图片设置付费
     * @return {[type]} [description]
     */
    openImageSetting (index) {
      this.imageSetting = index;
    },
    /**
     * 设置文字付费金额
     * @param {[type]} amount [description]
     */
    setTextAmountNum ( amount ) {
      this.amount = amount;
      this.customAmount = '';
    },

    /**
     * 设置图片付费属性
     * @param {[type]} setting [description]
     * @param {String} type    [description]
     */
    setImageAmountInfo (setting, type = 'amount' ) {
        if(type === 'amount' ) {
          this.currentImageSetting.amount = setting;
          this.currentImageSetting.customAmount = '';
        }
        if(type === 'type') this.currentImageSetting.type = setting;

        if(type === 'customAmount') {
          this.currentImageSetting.customAmount = setting;
          this.currentImageSetting.amount = 0;
        }
      
    },
    textAmountSettingChange (status) {
      if (!status) {
        this.customAmount = '';
        this.amount = 0;
      }

      this.setTextAmount = status;
    },

    /**
     * 图片付费设置切换
     * @param  {[type]} staus [description]
     * @return {[type]}       [description]
     */
    imageAmountSettingChange (staus) {
      if (!status) {
        const { images } = this;
        let newImages = [];
        images.reverse().forEach( image => {
          newImages.push(lodash.omit(image, ['amount', 'type']));
        });

        this.images = newImages;
        this.imageSetting = status;

        return;
      }

      this.setImageAmount = status;
    },

    postFeed () {
      if(this.isDisabled || this.loading) return;
      const { feedContent: feed_content, images, amount, customAmount, goldName } = this;
      this.loading = true;
      let feed_from = 2;
      let feed_mark = parseInt(window.TS_WEB.currentUserId + (new Date).getTime());

      let feed_data = {
        feed_content,
        feed_from,
        feed_mark
      };

      feed_data = this.checkImageAmountSetting(feed_data);

      if(!feed_data) {
        return ;
      }

      addAccessToken().post(
        createAPI('feeds'), 
        {
          ...feed_data
        },
        {
          validateStatus: status => status === 201
        }
      )
      .then(({data = {}}) => {
        let feed_id = data.id;

        this.closePost();

        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: plueMessageBundle(data).getMessage(),
            time: 1500,
            status: true
          });
        });

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
        .catch(({ response: { data }}) => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: plueMessageBundle(data).getMessage(),
              time: 1500,
              status: false
            });
          });
        });
      })
      .catch( ({response: { data } }) => {
        this.loading = false;
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: plueMessageBundle(data).getMessage(),
            time: 1500,
            status: false
          });
        });
      })
    },
    /**
     * 关闭发布框
     * @return {[type]} [description]
     */
    closePost () {
      this.feedContent = '';
      this.isatuser = 0;
      this.storage_task_ids = [];
      this.ids = {};
      this.uploadList = [];
      this.loading = false;
      this.setTextAmount = false;
      this.setImageAmount = false;
      this.amount = 0;
      this.customAmount = '';
      this.images = [];

      if (!this.textOnly) this.$refs.upload.clearFiles();

      // 关闭发布前置
      this.$store.dispatch(SHOWPREPOST, cb => {
        cb(false);
      });

      this.$store.dispatch(SHOWPOST, cb => {
        cb ({
          show: false,
          textOnly: false
        });
      });
    },

    handleError (error, file, fileList) {
      console.log(error);
      console.log(file);
      console.log(fileList);
    },
    handleRemove (index) {
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
    if (!this.textOnly) this.uploadList = this.$refs.upload.fileList;
  },
  mounted () {
    this.ratio = this.$storeLocal.get('ratio') || 100;
  }
};

export default postFeed;
</script>

<style lang="less" module>
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
    .action {
      color: #59b6d7;
      font-size: 16px;
    }
    .notAction {
      color: #999;
      font-size: 16px;
    }
    .demoUploadList {
      width: 22vw;
      height: 22vw;
      text-align: center;
      line-height: 22vw;
      overflow: hidden;
      background: #fff;
      position: relative;
      margin:.5vw;
      .i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
      }
      .demouploadListCover {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
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
    .imageAmountSet {
      .amountSet {
        padding: 12px 0;
        margin-top: 12px;
        border-top: 1px solid #ededed;
      }
    }
    .textAmountSet {
      .amountSet {
        padding: 12px 0;
        border-top: 1px solid #ededed;
      }
      .defaultAmount {
        text-align: center;
        .amount {
          width: 100%;
        }
      }
    }
  }
  .imageAmountSetting {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    background: #fff;
    z-index: 11;
    display: block;
    height: 100%;
    width: 100%;
    .commonHeader {
      z-index: 11;
    }
    .imagesContainer {
      height: calc(~"100% - 86px");
    }
    .swiperRoot {
      overflow: auto;
      position: fixed!important;
      top: 46px;
      left: 0;
      right: 0;
      bottom: 40px;
      z-index: 9!important;
      margin: auto;
      background-color: #fff;
      transition: transform .9s;
      transform:scale(1);
      .swiperSlide {
        display: flex!important;
        justify-content: center;
        align-items: center;
      }
      .swiper-pagination-bullets {
        top: 15px;
        bottom: initial!important;
        .swiper-pagination-bullet {
          background-color: #aaa;
        }
        .swiper-pagination-bullet.swiper-pagination-bullet-active {
          background-color: #fff;
        }
      }
    }
    .swiper-lazy-loaded {
      width: 100%!important;
    }
  }
</style>
<style lang="less">
  .ivu-chart-circle {
    width: 100%!important;
    height: 100%!important;
  }
  .ivu-upload-drag {
    border-radius: 0;
    border: 1px #ededed solid;
    &:hover {
      border: 1px #ededed solid;
    }
  }
</style>
