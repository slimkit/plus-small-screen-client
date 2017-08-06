<template>
  <div>
    <div id="spinner" v-show="showSpinner">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <header class="commonHeader" id="feed-header" v-if="!isWeixin">
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start">
          <BackIcon @click.native="goBack()" height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          <div>
            <span :class="$style.newsTitle" style="font-size: 18px; padding: 0 5px">资讯详情</span>
          </div>
        </Col>
      </Row>
    </header>
    <div :class="{headerPadding: !isWeixin, headerNoPadding: isWeixin}">
      <mt-loadmore 
        :bottom-method="loadBottom"
        :bottom-all-loaded="bottomAllLoaded"
        ref="loadmore"
        @bottom-status-change="bottomStatusChange"
        :bottomDistance="40"
      >
        <div class="feed-container">
          <div class="feed-container-content feed-background-color">
            <h3 v-if="detail.title" style="text-align: center; padding: 15px 8px 8px 8px; font-weight: 400; color: #59b6d7">{{ detail.title }}</h3>
            <div>
              <section 
                class="feedContainerContentTextNoPadding"
                v-html="detail.content"
              >
              </section>
            </div>
          </div>
          <div class="feed-container-comments feed-background-color">
           <!--input box start-->
            <ul :class="$style.comment" v-if="commentFeed" ref="commentFeedInput">
              <li>
                <Input 
                  type="textarea" 
                  ref="commentInput"
                  class="commentInput"
                  :autosize="{ minRows: 1, maxRows: 4 }" 
                  :minlength='1' 
                  :maxlength='255'
                  :autofocus="true"
                  v-model="commentBody"
                  :placeholder="placeholder"
                  v-childfocus
                />
              </li>
              <li :class="$style.commentOperations">
                <p :class="$style.commentOperation" v-show="commentCount > 100">
                  <span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255
                </p>
                <Button :class="$style.commentOperation" type="text" class="sendButton" size="small" @click.native="handleCommentInput(false)">取消</Button>
                <Button 
                  :class="$style.commentOperation" 
                  type="primary" 
                  class="sendButton" 
                  :disabled="!commentCount" 
                  size="small" 
                  @click.native="sendComment()"
                >
                  发送
                </Button>
              </li>
            </ul>
            <!-- end input box -->
            <div class="noComment" v-if="!comments.length">
              <img :src="defaultImage" />
            </div>
            <div class="comments" v-else>
              <Row :gutter="24" class="comments_count" style="height: 45px; display: -webkit-flex; display: flex; -webkit-align-items: center; align-items: center;">
                <Col span="24">
                    <span class="comments_counter">
                      {{detail.comment_count}}人评论
                    </span>
                </Col>
              </Row>
              <div class="comments-content">
                <section v-for="(comment, index) in formateComments" :key="comment.id" >
                  <Row :gutter="24" :class="$style.perComment">
                    <Col span="4">
                      <div class="grid-content bg-purple">
                        <img @click="changeUrl(`/users/feeds/${comment.user.user_id}`)" :src="comment.user.avatar" alt="" style="width:100%; border-radius:50%">
                      </div>
                    </Col>
                    <Col span="20">
                      <div class="grid-content bg-purple">
                        <Row style="padding-bottom: 5px">
                          <Col span="17">
                            <router-link :class="$style.profileLink" :to="{ path: `/users/feeds/${comment.user.user_id}` }">{{ comment.user.name }}</router-link>
                          </Col>
                          <Col span="7" style="display: flex; justify-content: flex-end;">
                            <timeago style="color: #ccc; font-size: 12px;" :since="timers(comment.created_at, 8, false)" locale="zh-CN" :auto-update="60"></timeago>
                          </Col>
                        </Row>
                        <Row>
                          <Col span="24">
                            <div style="color: #ccc;">
                              <span v-if="comment.reply_user">回复 </span>
                              <router-link :class="$style.profileLink" :to="{ path: `/profile/${comment.reply_user}` }">{{ comment.replyToUser.name }} </router-link>
                              <span
                                v-if="comment.user_id  != currentUser"
                                @click.stop="focusInput(comment.user_id, index)"
                                :class="$style.commentContent"
                              > 
                               {{ comment.body }}
                              </span>
                              <span
                                v-if="comment.user_id == currentUser"
                                @click.stop="showComfirm(comment.id, detail.id, index)"
                                :class="$style.commentContent"
                              > 
                               {{ comment.body }}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <ul :class="$style.comment" v-if="index === commentIndex" ref="commentFeedInput">
                    <li>
                      <Input 
                        type="textarea" 
                        ref="commentUserInput"
                        class="commentInput"
                        :autosize="{ minRows: 1, maxRows: 4 }" 
                        :minlength='1' 
                        :maxlength='255'
                        :autofocus="true"
                        v-model="commentBody"
                        :placeholder="placeholder"
                      />
                    </li>
                    <li :class="$style.commentOperations">
                      <p :class="$style.commentOperation" v-show="commentCount > 100">
                        <span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255
                      </p>
                      <Button :class="$style.commentOperation" type="text" class="sendButton" size="small" @click.native="handleCommentInput(false)">取消</Button>
                      <Button 
                        :class="$style.commentOperation" 
                        type="primary" 
                        class="sendButton" 
                        :disabled="!commentCount" 
                        size="small" 
                        @click.native="sendComment()"
                      >
                        发送
                      </Button>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div slot="bottom" style="display: flex; justify-content: center; align-items: center; padding: 10px 0;">
          <span v-show="bottomAllLoaded && bottomStatus !== 'loading' && comments.length > 15">没有更多了</span>
          <span v-show="bottomStatus === 'loading'">加载中...</span>
          <span v-show="bottomStatus === 'pull' && !bottomAllLoaded">上拉加载更多评论</span>
          <span v-show="bottomStatus === 'drop'">释放加载更多评论</span>
        </div>
      </mt-loadmore>
    </div>
    <div id="feed-footer" class="feed-container-tool-operation feed-background-color">
      <Row :gutter="24" style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <Col span="6" class="operation">
          <div v-if="!detail.has_like" @click="handleDiggFeed(detail.id)">
            <UnDiggIcon height="20" width="20" color="#999" />
            <i>喜欢</i>
          </div>
          <div v-else @click="handleUnDiggFeed(detail.id)">
            <DiggIcon height="20" width="20" color="#f4504d" />
            <i class="did">喜欢</i>
          </div>
        </Col>
        <Col span="6" class="operation" @click.native="focusInput()">
          <div>
            <CommentIcon height="20" width="20" color="#999" />
            <i>评论</i>
          </div>
        </Col>
        <Col span="6" class="operation">
          <div>
            <ShareIcon height="20" width="20" color="#999" />
            <i>分享</i>
          </div>
        </Col>
        <Col span="6" class="operation">
          <div v-if="!detail.has_collect" @click="handleCollection(detail.id)">
            <ConnectionIcon height="20" width="20" color="#999" />
            <i>收藏</i>
          </div>
          <div v-else @click="handleUnCollection(detail.id)">
            <ConnectionIcon height="20" width="20" color="#f4504d" />
            <i class="did">收藏</i>
          </div>
        </Col>
      </Row>
    </div>
  </div>
  <!-- </transition> -->
</template>
<script>
  import { createAPI, addAccessToken, createOldAPI } from '../../utils/request';
  import errorCodes from '../../stores/errorCodes';
  import localEvent from '../../stores/localStorage';
  import { getUserInfo } from '../../utils/user';
  import { NOTICE, CONFIRM } from '../../stores/types';
  import { friendNum } from '../../utils/friendNum';
  import Comfirm from '../../utils/Comfirm';
  import formateFeedComments from '../../utils/formateFeedComments';
  import UnFollowingIcon from '../../icons/UnFollowing';
  import FollowingIcon from '../../icons/Following';
  import EachFollowingIcon from '../../icons/EachFollowing';
  import DiggIcon from '../../icons/Digg';
  import UnDiggIcon from '../../icons/UnDigg';
  import CommentIcon from '../../icons/Comment';
  import ShareIcon from '../../icons/Share';
  import ConnectionIcon from '../../icons/Connection';
  import BackIcon from '../../icons/Back';
  import timers from '../../utils/timer';
  import lodash from 'lodash';
  import { resolveImage } from '../../utils/resource';
  import { changeUrl, goTo } from '../../utils/changeUrl';
  import getLocalTime from '../../utils/getLocalTime';

  const noCommentImage = resolveImage(require('../../statics/images/defaultNothingx2.png'));
  const newsDetail = {
    components: {
      Comfirm,
      UnFollowingIcon,
      FollowingIcon,
      EachFollowingIcon,
      DiggIcon,
      UnDiggIcon,
      CommentIcon,
      ShareIcon,
      ConnectionIcon,
      BackIcon
    },
    data: () => ({
      isWeixin: window.TS_WEB.isWeiXin,
      scroll: 0,
      detail: {
        comment_count: 0,
        content: '',
        created_at: '',
        digg_count: 0,
        from: '',
        hits: 0,
        id: 0,
        is_recommend: 0,
        storage: {
          id: 0,
          image_height: 0,
          image_width: 0
        },
        title: ''
      },
      comments: [],
      defaultImage: noCommentImage,
      currentUser: window.TS_WEB.currentUserId,
      // 上拉加载更多相关
      bottomAllLoaded: false,
      max_comment_id: 0,
      bottomStatus: '',
      showSpinner: true,
      // 输入框有关
      commentFeed: false,
      commentToUserId: 0,
      placeholder: '',
      loading: false,
      commentedUser: {},
      commentIndex: -1,
      commentBody: ''
    }),
    computed: {
      commentCount () {
        return this.commentBody.length;
      },
      newsTimer () {
        return this.timers(this.detail.created_at, 8, false);
      },
      formateComments () {
        let formated = formateFeedComments(this.comments);
        this.max_id = formated.max_id;
        return formated.comments;
      }
    },
    methods: {
      changeUrl,
      timers,
      // 检测底部loading的状态变化
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      removeByValue (arr, value) {
        for(let i=0; i<arr.length; i++) {
          if(arr[i] == value) {
            arr.splice(i, 1);
            break;
          }
        }
      },
      handleCollection (news_id) {
        addAccessToken().post(createAPI(`news/${news_id}/collection`), {}, {
          validateStatus: status => status === 201
        })
        .then(response => {
          let data = response.data;
          this.detail.has_collect = true;
        })
      },
      handleUnCollection (news_id) {
        addAccessToken().delete(createAPI(`news/${news_id}/collection`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.detail.has_collect = false;
        })
      },
      handleDiggFeed (news_id) {
        addAccessToken().post(createAPI(`news/${news_id}/like`), {}, {
          validateStatus: status => status === 201
        })
        .then( () => {
          this.detail.has_like = true;
        })
      },
      handleUnDiggFeed (news_id) {
        addAccessToken().delete(createAPI(`news/${news_id}/like`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.detail.has_like = false;
        })
      },
      loadBottom() {
        let max_id = this.max_id;
        let limit = 15;
        this.bottomStatus = 'loading';
        addAccessToken().get(
          createAPI(`news/${this.detail.id}/comments?after=${max_id}&limit=${limit}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then( ({ data = {} }) => {
          let comments = data.comments;
          let addComments = [];
          let formatedAddComments = [];
          let bottomAllLoaded = false;
          if(comments.length < 15) {
            bottomAllLoaded = true;
          }
          comments.forEach((comment) => {
            this.comments.push(comment);
          });
          setTimeout(() => {
            // 若数据已全部获取完毕
            this.bottomStatus = '';
            this.bottomAllLoaded = bottomAllLoaded;
            this.$refs.loadmore.onBottomLoaded();
          }, 500);
        })
      },
      /**
       * [handleCommentInput reset comment input]
       * @return {[type]} [description]
       */
      handleCommentInput () {
        this.commentFeed = false;
        this.commentToUserId = 0;
        this.placeholder = '';
        this.commentIndex = -1;
        this.commentedUser = {};
        this.commentBody = '';
      },
      /**
       * 发表评论
       * @return {[type]} [description]
       */
      sendComment () {
        if(!this.commentBody.length && this.loading) return;
        this.loading = true;
        addAccessToken().post(createAPI(`news/${this.detail.id}/comments`), {
            body: this.commentBody,
            reply_user: this.commentToUserId
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then( ({ data = {}}) => {
          // let feed = this.feedData;
          // console.log(data);return;
          // let newComment = {
          //   body: this.commentBody,
          //   comment_mark: null,
          //   created_at: getLocalTime(),
          //   id: response.data.data,
          //   reply_user: this.commentToUserId,
          //   user_id: window.TS_WEB.currentUserId,
          //   reply_to_user: {},
          //   user: {}
          // };
          let newComment = { ...data.comment };
          // current logged user
          
          let item = this.$storeLocal.get(window.TS_WEB.currentUserId);

            // don't find local db user
          if(item === undefined) {
            getUserInfo(window.TS_WEB.currentUserId).then( user => {
              newComment.user = { ...user };
              // commented user
              if(this.commentToUserId) {
                newComment.reply_to_user = { ...this.commentedUser };
                this.comments.unshift(newComment);
              } else {
                this.comments.unshift(newComment);
              }
            });
          } else { // find local db user
            newComment.user = { ...item };

            // commented user
            if(this.commentToUserId) {
              newComment.reply_to_user = { ...this.commentedUser };
              this.comments.unshift(newComment);
            } else {
              this.comments.unshift(newComment);
            }
          }
          
          // 本地数据更新
          this.detail.comment_count += 1;
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '已发送',
              time: 1500,
              status: true
            });
          });
          // reset comment input
          this.handleCommentInput();

          this.loading = false;
        });
      },
      /**
       * 打开评论输入框
       * @param  {Number} comment_to_uid [回复某个用户ID]
       * @param  {Number} index          [被回复的评论在数组中的index]
       * @return {[type]}                [description]
       */
      focusInput (comment_to_uid = 0, index = -1) {
        // 对评论进行评论
        let reply_to_user_id = this.commentToUserId = comment_to_uid;
        if(reply_to_user_id) {
          this.commentIndex = index;
          this.commentToUserId = reply_to_user_id;
          
          let item = this.$storeLocal.get(reply_to_user_id);
          if(item === undefined) {
            getUserInfo( reply_to_user_id ).then( user => {
              this.placeholder = `回复： ${user.name}`;
              this.commentedUser = { ...user };
            })
          } else {
            this.placeholder = `回复: ${item.name}`;
            this.commentedUser = { ...item };
          }
        } else {
          this.placeholder = '随便说说';
          this.commentFeed = true;
        }
      },
      // 新版删除确认提示
      showComfirm (commentId, newsId, index) {
        this.$store.dispatch(CONFIRM, cb => {
          cb({
            show: true,
            confirmContent: '删除动态',
            data: {
              comment_id: commentId,
              news_id: newsId,
              index: index
            },
            confirm: this.deleteComment
          })
        })
      },
      deleteComment (close, data) {
        addAccessToken().delete(createAPI(`news/${data.news_id}/comments/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          let newComments = this.comments;
          newComments.splice(data.index,1);
          this.comments = newComments;
          this.detail.comment_count -- ;
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '已删除',
              time: 1500,
              status: false
            });
          });
        })
      },
      friendNum,
      goBack() {
        if(window.history.length < 2) {
          this.$router.push('/news');
          return;
        }
        this.$router.back();
      },
      menu() {
        let header = document.getElementById('feed-header');
        let footer = document.getElementById('feed-footer');
        if(header || footer) {
          if(this.scroll > 55) {
            if(this.scroll > window.pageYOffset) {
              if(header) header.style.top = 0;
              if(footer) footer.style.bottom = 0;
            } else {
              if(header) header.style.top = '-55px';
              if(footer) footer.style.bottom = '-55px';
            }
          }
          this.scroll = window.pageYOffset;
        }
      }
    },
    created () {
      let serviceFeed = {};
      let news_id = parseInt(this.$route.params.news_id);
      if ( !news_id ) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        setTimeout(() => {
          goTo(-1);
        }, 1500);
        return;
      }
        // 获取动态详情
        addAccessToken().get(
          createAPI(`news/${news_id}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data = {}}) => {
          this.detail = { ... data };
          // 获取动态评论 前15条
          addAccessToken().get(
            createAPI(`news/${news_id}/comments`),
            {},
            {
              validateStatus: status => status === 200
            }
          )
          .then(({ data = {} }) => {
            // 格式化评论列表
            this.comments = data.comments;
            if(this.comments.length < 15) {
              this.bottomAllLoaded = true;
            }
            setTimeout( () => {
              if(this.$refs.loadmore) {
                this.$refs.loadmore.onTopLoaded();
              }
              this.showSpinner = false;
            }, 800);
          });
        });
      // }
    },
    mounted () {
      window.addEventListener('scroll', this.menu);
    }
  }; 

  export default newsDetail;
</script>
<style>
  .feedContainerContentTextNoPadding p, feedContainerContentText p {
    margin: 10px 0;
  }
  .feedContainerContentTextNoPadding img, feedContainerContentText img {
    width: 100%!important;
    height: auto!important;
  }
</style>
<style lang="less" scoped>
  .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
    transform: inherit!important;
  }
  .feed-container {
    background-color: #f4f5f5;
  }
  #feed-footer {
    transition: bottom .2s;
  }
  .headerNoPadding {
    padding-top: 0;
  }
  .headerPadding {
    padding-top: 46px;
  }
  .commonHeader{
    position: fixed!important;
    top: 0;
    left: 0;
    right: 0;
    transition: top .2s;
    div {
      height: 100%;
      display: flex;
      align-items: center;
    }
    a {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
      padding: 5px 0;
      .avatar-content {
        height: 100%;
        display: flex;
        border-radius: 50%;
        overflow: hidden;
        align-items: center;
        img.avatar {
          object-fit: cover;
          color: #333;
          width: auto;
          height: 100%;
        }
      }
    }
  } 
  .feed-container-content { 
    .feed-container-content-images {
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
        width: 100%;
        img[lazy='loading'] 
        {
          width: 100%
        }
        img[lazy='loaded'] 
        {
          width: 100%;
        }
      }
    }
    .feedContainerContentText {
      padding: 20px 12px;
      p {
        margin: 8px 0;
      }
    }
    .feedContainerContentTextNoPadding {
      padding: 0 12px 20px 12px;
      word-break: break-all;
      p {
        margin: 8px 0;
      }
    }
  }
  .digg-digg-list {
    position: relative;
    height: 30px;
    img {
      position: absolute;
      height: 100%;
      border: 2px #fff solid;
      border-radius: 50%;
      &[lazy="loading"] {
        height: 100%;
        width: auto;
      }
    }
  }
  .detail-data {
    p {
      font-size: 12px;
      color: #ccc;
      text-align: right;
    }
  }
  .feed-container-tool-operation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 55px;
    z-index: 6;
    .operation {
      div { 
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        svg {
          width: 100%;
        }
        i {
          font-style: normal;
          color: #999;
        }
        i.did {
          color: #f4504d;
        }
      }
    }
  }
  .feed-container-comments {
    .noComment {
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      -webkit-justify-content: center;
      align-items: center;
      -webkit-align-items: center;
      background-color: #f4f5f5;
      img {
        padding: 5vh 0;
        width: 50%;
      }
    }
    .comments {
      .comments_counter {
        padding: 11px 5px;
        border-bottom: 3px #59b6d7 solid;
      }
    }
  }
  .feed-background-color {
    background-color: #fff;
  }
  .commentInput{
    padding: 8px 0px;
    width: 100%;
    z-index: 6;
    background-color: #fff;
    border-bottom: 1px #59b6d7 solid;
    border: none;
    textarea {
      min-height: 34px!important;
    }
  }
</style>
<style lang="less" module>
  .comment {
      padding: 0 12px;
      li {
        margin-top: 8px;
        &:last-child {
          margin-top: 0;
          margin-bottom: 8px;
        }
      }
      .commentOperations {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .commentOperation {
          margin: 0 8px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  .newsTitle {
    text-align: initial;
    overflow: hidden;
    text-overflow: ellipsis;  
    display: -webkit-box;  
    -webkit-line-clamp: 1;  
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .followAction {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .perComment {
    padding: 10px 0;
    align-items: flex-start!important;
    .profileLink {
      color: #333;
    }
  }
  .wrapper{
    background-color: rgba(0, 0, 0, .3);
    z-index: 5;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: fixed;
    overflow: auto;
    margin: 0;
  }
  .sendComment {
    font-size: 14px;
    padding: 3px!important;
    background-color: #59b6d7;
    &[disabled] {
      background-color: #ccc!important;
      color: #fff!important;
    }
  }
  .commentContent{
    font-size: 14px;
    color: #999;
  }
  .operation {
    i {
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      justify-content: center;
      align-items: center;
      font-style: normal;
    }
  }
</style>
