<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
    <div class="post-feed" :class="$style.prePostRoot" v-show="show">
      <section :class="$style.container">
        <Row :gutter="24" :class="$style.entryRow">
          <Col span="8" :class="$style.entryCol" @click.native="checkin" v-show="config.checkin.status">
            <img :src="checkInPic" alt="签到">
            <span>签到</span>
          </Col>
          <Col span="8" :class="$style.entryCol" @click.native="addNews">
            <img :src="NewsPic" alt="资讯投稿">
            <span>投稿</span>
          </Col>
          <Col span="8" :class="$style.entryCol" @click.native="postImageFeed">
            <img :src="imageFeecPic" alt="图片动态">
            <span>图片</span>
          </Col>
        </Row>
        <Row :gutter="24" :class="[$style.entryRow, $style.lastEntryRow]">
          <Col span="8" offset="4" :class="$style.entryCol" @click.native="postQuestion">
            <img :src="questionPic" alt="提问">
            <span>提问</span>
          </Col>
          <Col span="8" :class="$style.entryCol" @click.native="postTextFeed">
            <img :src="textFeecPic" alt="文字动态">
            <span>文字</span>
          </Col>
        </Row>
        <Button :class="$style.closeButton" size="large" long @click="close">
          <Icon type="ios-close-empty" color="#59b6d7" size="42"></Icon>
        </Button>
      </section>
    </div>
  </transition>
</template>
<style lang="less" module>
  .prePostRoot {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    background: rgba(255, 255, 255, .9);
    z-index: 9;
    display: block;
    height: 100vh;
    width: 100vw;
    .container {
      position: fixed;
      bottom: 0;
      width: 100vw;
      .entryRow {
        padding-top: 24px;
        &.lastEntryRow {
          padding-bottom: 24px;
        }
        .entryCol {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          img {
            width: 60%;
          }
          span {
            margin-top: 8px;
            font-size: 14px;
            color: #333;
          }
        }
      }
      .closeButton {
        height: 55px;
        background-color: #fff;
        border-radius: 0;
        border: none;
        border-top: 1px solid #ededed;
      }
    }
  }
</style>
<script>
  import { mapState } from 'vuex';
  import { SHOWPREPOST, SHOWPOST, NOTICE, SHOWQUESTIONPOST, SHOWCHECKIN } from '../stores/types';
  import { resolveImage } from '../utils/resource';

  const checkInPic = resolveImage(require('../statics/images/ico_attendance.png'));
  const NewsPic = resolveImage(require('../statics/images/ico_contribute.png'));
  const imageFeecPic = resolveImage(require('../statics/images/ico_potoablum.png'));
  const questionPic = resolveImage(require('../statics/images/ico_question.png'));
  const textFeecPic = resolveImage(require('../statics/images/ico_words.png'));
  const livePic = resolveImage(require('../statics/images/ico_zhibo.png'));

  const PrePost = {
    data: () => ({
      checkInPic,
      NewsPic,
      imageFeecPic,
      questionPic,
      textFeecPic,
      livePic
    }),
    props: ['config'],
    methods: {
      /**
       * 关闭prepost
       * @return {[type]} [description]
       */
      close () {
        this.$store.dispatch(SHOWPREPOST, cb => {
          cb(false)
        });
      },
      /**
       * 打开文字动态发布
       * @return {[type]} [description]
       */
      postTextFeed () {
        this.$store.dispatch(SHOWPOST, cb => {
          cb ({
            show: true,
            textOnly: true
          });
        });
        setTimeout( () => {
          this.close();
        }, 300)
      },
      /**
       * 打开图片动态发布
       * @return {[type]} [description]
       */
      postImageFeed () {
        this.$store.dispatch(SHOWPOST, cb => {
          cb ({
            show: true
          });
        });
        setTimeout( () => {
          this.close();
        }, 300)
        
      },

      /**
       * 打开问题发布框
       * @return {[type]} [description]
       */
      postQuestion () {
        this.$store.dispatch(SHOWQUESTIONPOST, cb => {
          cb({
            show: true,
            id: 0
          });;
        });
        setTimeout( () => {
          this.close();
        }, 300)
      },
      /**
       * 打开签到框
       * @return {[type]} [description]
       */
      checkin () {
        this.$store.dispatch(SHOWCHECKIN, cb => {
          cb(true);
        });
        setTimeout( () => {
          this.close();
        }, 300)
      },
    },
    computed: {
      ...mapState({
        show: state => state.prePost.prePost.show
      }),
    },
  };

  export default PrePost;
</script>