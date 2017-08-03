<template>
  <div>
    <div id="spinner" v-show="showSpinner">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <header class="commonHeader" id="feed-header">
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start">
          <BackIcon @click.native="goBack" height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          <div>
            <router-link :to="`/users/feeds/${userInfo.user_id}`" class="avatar">
              <div class="avatar-content">
                <img class="avatar" v-lazy="avatar" alt="">
              </div>
              <span style="font-size: 18px; padding: 0 5px">{{userInfo.name}}</span>
            </router-link>
          </div>
        </Col>
        <Col span="5" class="header-end-col">
          <!--未关注作者, 采用关注操作-->
            <UnFollowingIcon @click.native="handleFollowingStatus" v-if="!userInfo.follower && (userInfo.user_id != currentUser)" height="21" width="21" color="#999" />
          <!--已关注作者,但作者未关注我， 采用取消关注操作-->
            <FollowingIcon  @click.native="handleUnFollowingStatus" height="21" width="21" color="#59b6d7" v-if="userInfo.follower && !userInfo.following && (userInfo.user_id != currentUser)" />
          <!--相互关注， 采用取消关注操作-->
            <EachFollowingIcon v-if="userInfo.follower && userInfo.following && (userInfo.user_id != currentUser)" @click.native="handleUnFollowingStatus" height="21" width="21" color="#59b6d7" />
        </Col>
      </Row>
    </header>
    <div class="feed-container">
        <div class="feed-container-content feed-background-color">
          <div>
            <div v-if="imagesList.length" class="feed-container-content-images">
              <div v-for="(item, index ) in imagesList" :key="index" :style="`height: ${item.height + 'px'}`">
                <img v-if="item.paid" v-lazy="item.url" />
                <LockedImageForSwiper v-else />
              </div>
            </div>
            <p 
              :class="{ feedContainerContentText: imagesList.length, feedContainerContentTextNoPadding: !imagesList.length }"
              v-html="feedData.feed_content ? feedData.feed_content.replace(/\n/g,'<br/>') : feedData.feed_content"
            >
            </p>
          </div>
        </div>
        <div class="feed-container-tool feed-background-color">
          <div class="feed-container-tool-digg">
            <Row :gutter="24" style="display: flex; align-items: center;">
              <Col span="15"  @click.native="changeUrl(`/feed/${feed_id}/diggs`)">
                <div style="display: flex; align-items: center;">
                  <div :style="`width: ${digglistWidth}`">
                    <div class="digg-digg-list" v-if="diggList.length" >
                      <img v-lazy="digg.avatar" :style="`left: ${20 * (index) + 'px'}; z-index: ${5 - (1 * index)}`" :alt="digg.name" v-for="(digg, index) in diggList" :key="index" >
                    </div>
                  </div>
                  <div class="digg_counter">
                    {{ friendNum(feedData.like_count) }}人点赞
                  </div>
                </div>
              </Col>
              <Col span="9">
                <div class="detail-data">
                  <p>发布于<timeago :since="feedTimer" locale="zh-CN" :auto-update="60"></timeago></p>
                  <p>{{ friendNum(feedData.feed_view_count) }}人浏览</p>
                </div>
              </Col>
            </Row>
          </div>
      </div>
    </div>
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
          v-model="commentContent"
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
    <div id="comments" class="noComment" v-if="!feedData.feed_comment_count">
      <img v-lazy="defaultImage" />
    </div>
    <div id="comments" v-else>
      <mt-loadmore 
        :bottom-method="loadBottom"
        :bottom-all-loaded="bottomAllLoaded"
        ref="loadmore"
        @bottom-status-change="bottomStatusChange"
        :bottomDistance="40"
      >
        <div class="feed-container-comments feed-background-color">
          <div class="comments">
            <Row :gutter="24" class="comments_count" style="height: 45px; display: -webkit-flex; display: flex; -webkit-align-items: center; align-items: center;">
              <Col span="24">
                  <span class="comments_counter">
                    {{feedData.feed_comment_count}}人评论
                  </span>
              </Col>
            </Row>
            <div class="comments-content">
              <section v-for="(comment, index) in formateComments" :key="comment.id"  >
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
                            <router-link :class="$style.profileLink" :to="{ path: `/profile/${comment.reply_to_user_id}` }">{{ comment.replyToUser.name }} </router-link>
                            <span
                              v-if="comment.user_id  != currentUser"
                              @click.stop="focusInput(comment.user_id, index)"
                              :class="$style.commentContent"
                            > 
                             {{ comment.body }}
                            </span>
                            <span
                              v-if="comment.user_id == currentUser"
                              @click.stop="showComfirm(comment.id, feed_id, index)"
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
                      v-model="commentContent"
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
              </section>
            </div>
          </div>
        </div>
        <div slot="bottom" style="display: flex; justify-content: center; align-items: center; padding: 10px 0;">
          <span v-if="bottomAllLoaded">没有更多了</span>
          <section v-else>
            <span v-show="bottomStatus === 'loading'">加载中...</span>
            <span v-show="bottomStatus === 'pull' && !bottomAllLoaded">上拉加载更多评论</span>
            <span v-show="bottomStatus === 'drop'">释放加载更多评论</span>
          </section>
        </div>
      </mt-loadmore>
    </div>
    <div id="feed-footer" class="feed-container-tool-operation feed-background-color">
      <Row :gutter="24" style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <Col span="6" class="operation">
          <div v-if="!feedData.has_like" @click="handleDiggFeed(feed_id)">
            <UnDiggIcon height="20" width="20" color="#999" />
            <i>喜欢</i>
          </div>
          <div v-else @click="handleUnDiggFeed(feed_id)">
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
          <div v-if="!feedData.has_collect" @click="handleCollection(feed_id)">
            <ConnectionIcon height="20" width="20" color="#999" />
            <i>收藏</i>
          </div>
          <div v-else @click="handleUnCollection(feed_id)">
            <ConnectionIcon height="20" width="20" color="#f4504d" />
            <i class="did">收藏</i>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  import { createAPI, addAccessToken, } from '../utils/request';
  import buildURL from 'axios/lib/helpers/buildURL';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo, followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE, SHOWFEEDDIGGSLISTS, FEEDSLIST, UPDATEFEED, CONFIRM, COMMENTINPUT, COLLECTIONFEEDSIDS, ADDCOLLECTIONFEEDSIDS, UNCOLLECTIONFEEDSID } from '../stores/types';
  import { friendNum } from '../utils/friendNum';
  import Comfirm from '../utils/Comfirm';
  import formateFeedComments from '../utils/formateFeedComments';
  import UnFollowingIcon from '../icons/UnFollowing';
  import FollowingIcon from '../icons/Following';
  import EachFollowingIcon from '../icons/EachFollowing';
  import DiggIcon from '../icons/Digg';
  import UnDiggIcon from '../icons/UnDigg';
  import CommentIcon from '../icons/Comment';
  import ShareIcon from '../icons/Share';
  import ConnectionIcon from '../icons/Connection';
  import BackIcon from '../icons/Back';
  import timers from '../utils/timer';
  import lodash from 'lodash';
  import { resolveImage } from '../utils/resource';
  import { changeUrl } from '../utils/changeUrl';
  import getLocalTime from '../utils/getLocalTime';
  import LockedImageForSwiper from '../components/LockedImageForSwiper';
  import storeLocal from 'store';

  const noCommentImage = resolveImage(require('../statics/images/defaultNothingx2.png'));
  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

  const feedDetail = {
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
      BackIcon,
      LockedImageForSwiper
    },
    data: () => ({
      scroll: 0,
      feed_id: 0,
      feedData: {},
      comments: [],
      likes: [],
      userInfo: {},
      // 上拉加载更多相关
      bottomAllLoaded: false,
      max_id: 0,
      bottomStatus: '',
      showSpinner: true,
      currentUser: TS_WEB.currentUserId,
      // 输入框有关
      commentFeed: false,
      commentToUserId: 0,
      placeholder: '',
      commentContent: '',
      loading: false,
      commentedUser: {},
      commentIndex: -1
    }),
    computed: {
      defaultImage () {
        return noCommentImage;
      },
      commentCount () {
        return this.commentContent.length;
      },
      feedTimer () {
        const { created_at = '' } = this.feedData;
        return this.timers(created_at, 8, false);
      },
      avatar () {
        const { avatar = defaultAvatar } = this.userInfo;
        return avatar;
      },
      // 计算图片跳转地址
      imagesList () {
        let urlList = [];
        const { images = [] } = this.feedData;
        if(!images.length > 0) {
          return [];
        }
        images.forEach((value) => {
          let size = value.size.split('x');
          urlList.push(
            {
              url: buildURL(createAPI(`files/${value.file}`)),
              width: window.innerWidth,
              height: window.innerWidth * (size[1] / size[0]),
              paid: (value.paid_node && !value.paid) ? false : true
            }
          );
        });
        return urlList;
      },
      digglistWidth () {
        const { likes = [] } = this.feedData;
        return likes.length ? ((likes.length-1)*20 + 30 + 'px') : '0px';
      },
      diggList () {
        const { likes = [] } = this.feedData;
        let digg_users = [];
        let userLocal = {};
        let avatar = '';
        likes.forEach( (digg, index) => {
          let userLocal = storeLocal.get(`user_${digg.user_id}`);
          if(index > 4) { return; }
          if(!lodash.keys(userLocal).length > 0) {
            getUserInfo(digg.user_id).then(user => {
              digg_users.push({
                avatar: user.avatar,
                user_id: user.user_id,
                name: user.name
              });
            });
          } else {
            userLocal.avatar = userLocal.avatar || defaultAvatar;
            digg_users.push({
              avatar: userLocal.avatar,
              user_id: userLocal.user_id,
              name: userLocal.name
            });
          }
          userLocal = {};
        });
        return digg_users;
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
        this.commentContent = '';
      },
      // 检测底部loading的状态变化
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      /**
       * [removeByValue remove a element if in an array]
       * @param  {[type]} arr   [description]
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      removeByValue (arr, value) {
        for(let i=0; i<arr.length; i++) {
          if(arr[i] == value) {
            arr.splice(i, 1);
            break;
          }
        }
      },
      handleCollection (feed_id) {
        addAccessToken().post(createAPI(`feeds/${feed_id}/collections`), {}, {
          validateStatus: status => status === 201
        })
        .then(response => {
          this.$store.dispatch(COLLECTIONFEEDSIDS, cb => {
            cb([
              feed_id
            ])
          });
          this.feedData.has_collect = true;
        })
        .catch( error => {
          if(error.response.status === 401) {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '请先登录',
                time: 1500,
                status: false
              });
            });
            setTimeout( () => {
              this.$router.push('/login');
            }, 1500);
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '系统错误',
                time: 1500,
                status: false
              });
            });
          }
        })
      },
      handleUnCollection (feed_id) {
        addAccessToken().delete(createAPI(`feeds/${feed_id}/uncollect`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.feedData.has_collect = false;
          this.$store.dispatch(UNCOLLECTIONFEEDSID, cb => {
            cb(feed_id);
          })
        })
        .catch( error => {
          if(error.response.status === 401) {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '请先登录',
                time: 1500,
                status: false
              });
            });
            setTimeout( () => {
              this.$router.push('/login');
            }, 1500);
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '系统错误',
                time: 1500,
                status: false
              });
            });
          }
        })
      },

      handleDiggFeed (feed_id) {
        addAccessToken().post(createAPI(`feeds/${feed_id}/like`), {}, {
          validateStatus: status => status === 201
        })
        .then(response => {
          this.feedData.has_like = true;
          this.feedData.likes.push({ user_id: TS_WEB.currentUserId });
          this.feedData.like_count++;
          this.$store.dispatch(UPDATEFEED, cb => {
            cb(this.feedData);
          })
        })
        .catch(error => {
          if(error.response.status === 401) {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '请先登录',
                time: 1500,
                status: false
              });
            });
            setTimeout( () => {
              this.$router.push('/login');
            }, 1500);
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '系统错误',
                time: 1500,
                status: false
              });
            });
          }
        })
      },

      handleUnDiggFeed (feed_id) {
        addAccessToken().delete(createAPI(`feeds/${feed_id}/unlike`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.feedData.has_like = false;
          this.feedData.likes.splice(
            this.feedData.likes.findIndex( value => {
              value = TS_WEB.currentUserId
            }),
          1);

          this.feedData.like_count--;
          this.$store.dispatch(UPDATEFEED, cb => {
            cb(this.feedData);
          })
        })
      },
      /**
       * 关注作者
       * @return {[type]} [description]
       */
      handleUnFollowingStatus () {
        unFollowingUser(this.feedData.user_id).then((status) => {
          if(status) {
            this.userInfo.follower = false;
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '操作错误',
                time: 1500,
                status: false
              });
            });
          }
        })
      },
      handleFollowingStatus () {
        followingUser(this.feedData.user_id).then(status => {
          if(status) {
            this.userInfo.follower = true;
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '操作错误',
                time: 1500,
                status: false
              });
            });
          }
        })
      },
      loadBottom() {
        if( !this.max_id > 1 ) {
          setTimeout(() => {
            // 若数据已全部获取完毕
            this.bottomStatus = '';
            this.bottomAllLoaded = true;
            this.$refs.loadmore.onBottomLoaded();
          }, 500);
        }
        let limit = 15;
        this.bottomStatus = 'loading';
        addAccessToken().get(
          createAPI(`feeds/${this.feed_id}/comments?after=${this.max_id}&limit=${limit}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then(response => {
          let data = response.data.data;
          let addComments = [];
          let formatedAddComments = [];
          let bottomAllLoaded = false;
          if(data.length < 15) {
            bottomAllLoaded = true;
          }
          data.forEach((comment) => {
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
       * 发表评论
       * @return {[type]} [description]
       */
      sendComment () {
        if(!this.commentContent.length && this.loading) return;
        this.loading = true;
        let comment_data = {
          body: this.commentContent
        };

        if(this.commentToUserId) {
          comment_data.reply_user = this.commentToUserId
        }
        addAccessToken().post(createAPI(`feeds/${this.feed_id}/comments`), 
          comment_data,
          {
            validateStatus: status => status === 201
          }
        )
        .then( ({data = {}}) => {
          let comment = data.comment;
          this.feedData.feed_comment_count += 1;
          let feed = this.feedData;
          
          let newComment = {
            body: comment.body,
            created_at: comment.created_at,
            id: comment.id,
            reply_user: comment.reply_user,
            user_id: comment.user_id,
            reply_to_user: {}
          };
          // current logged user
          let currentUser = storeLocal.get(`user_${TS_WEB.currentUserId}`);
            // don't find local db user
            if(!currentUser) {
              getUserInfo(window.TS_WEB.currentUserId).then( user => {
                newComment.user = { ...user };
                // commented user
                if(this.commentToUserId) {
                  newComment.reply_to_user = { ...this.commentedUser };
                  this.$store.getters[FEEDSLIST][this.feed_id].comments.unshift(newComment);
                } else {
                  this.$store.getters[FEEDSLIST][this.feed_id].comments.unshift(newComment);
                }
              });
            } else { // find local db user
              newComment.user = { ...currentUser };

              // commented user
              if(this.commentToUserId) {
                newComment.reply_to_user = { ...this.commentedUser };
                this.$store.getters[FEEDSLIST][this.feed_id].comments.unshift(newComment);
                this.$store.getters[FEEDSLIST][this.feed_id].feed_comment_count += 1;
              } else {
                this.$store.getters[FEEDSLIST][this.feed_id].comments.unshift(newComment);
                this.$store.getters[FEEDSLIST][this.feed_id].feed_comment_count += 1;
              }
            }
          
          // 本地数据更新
          // this.feedData.tool.feed_comment_count += 1;
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
          let reply_user = storeLocal.get(`user_${reply_to_user_id}`);
          if(reply_user === undefined) {
            getUserInfo( reply_to_user_id, 30 ).then( user => {
              this.placeholder = `回复： ${user.name}`;
              this.commentedUser = { ...user };
            })
          } else {
            this.placeholder = `回复: ${reply_user.name}`;
            this.commentedUser = { ...reply_user };
          }
        } else {
          this.placeholder = '随便说说';
          this.commentFeed = true;
        }
      },
      
      /**
       * [showComfirm delete comment of current user]
       * @param  {[type]} commentId [commentId from server]
       * @param  {[type]} feedId    [feedId]
       * @param  {[type]} index     [index]
       * @return {[type]}           [none]
       */
      showComfirm (commentId, feedId, index) {
        this.$store.dispatch(CONFIRM, cb => {
          cb({
            show: true,
            confirmContent: '删除动态',
            data: {
              comment_id: commentId,
              feed_id: feedId,
              index: index
            },
            confirm: this.deleteComment
          })
        })
      },
      /**
       * [deleteComment do delete comment]
       * @param  {[type]} close [description]
       * @param  {[type]} data  [description]
       * @return {[type]}       [description]
       */
      deleteComment (close, data) {
        addAccessToken().delete(createAPI(`feeds/${data.feed_id}/comments/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.feedData.feed_comment_count -= 1;
          this.$store.getters[FEEDSLIST][this.feed_id].comments.splice(data.index, 1);
          this.$store.getters[FEEDSLIST][this.feed_id].feed_comment_count -= 1;
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
      unFollowingUser,
      followingUser,
      goBack () {
        if(window.history.length < 2) {
          this.$router.push('/feeds');
          return;
        }
        this.$router.back();
      },
      // 获取当前动态用户的用户信息
      getUser (user_id) {
        getUserInfo(user_id).then(user => {
          this.userInfo = { ...user };
        });
      },
      menu() {
        let header = document.getElementById('feed-header');
        let footer = document.getElementById('feed-footer');
        if(header && footer) {
          if(this.scroll > 55) {
            if(this.scroll > window.pageYOffset) {
              header.style.top = 0;
              footer.style.bottom = 0;
            } else {
              header.style.top = '-55px';
              footer.style.bottom = '-55px';
            }
          }
          this.scroll = window.pageYOffset;
        }
      }
    },
    created () {
      let serviceFeed = {};
      let feed_id = parseInt(this.$route.params.feed_id);
      if ( !feed_id ) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        setTimeout(() => {
          this.goBack();
        }, 1500);
        return;
      }
      // 获取动态详情
      addAccessToken().get(
        createAPI(`feeds/${feed_id}`),
        {},
        {
          validateStatus: status => status === 200
        }
      )
      .then(({ data = {} }) => {
        this.getUser(data.user_id);
        this.feed_id = feed_id;
        this.feedData = { ...this.feedData, ...data };
        // 获取动态评论 前15条
        addAccessToken().get(
          createAPI(`feeds/${feed_id}/comments`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data = {} }) => {
          // 格式化评论列表
          let formatedComments = formateFeedComments(data.comments);
          this.comments = data.comments;
          this.feedData = { ...this.feedData, comments: data.comments };
          if(this.comments.length < 15) {
            this.bottomAllLoaded = true;
          }
          this.$store.dispatch(UPDATEFEED, cb => {
            cb(this.feedData);
          })
          setTimeout( () => {
            this.showSpinner = false;
          }, 800);
        });

        // 获取点赞的用户
        addAccessToken().get(createAPI(`feeds/${feed_id}/likes`), {}, {
          validateStatus: status => status === 200
        })
        .then( ({ data = {} }) => {
          this.$set(this.feedData, 'likes', data);
        });
      });
    },
    mounted () {
      window.addEventListener('scroll', this.menu);
    }
  }; 

  export default feedDetail;
</script>
<style lang="less" scoped>
  .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
    transform: inherit!important;
  }
  .feed-container {
    background-color: #f4f5f5;
    padding-top: 46px;
  }
  #feed-footer {
    transition: bottom .2s;
    border-top: 1px solid #e2e3e3;
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
      &>div {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
        width: 100%;
        height: 100%;
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
    }
    .feedContainerContentTextNoPadding {
      padding: 16px 12px 20px 12px;
      word-break: break-all;
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
  .feed-container-tool {
    .feed-container-tool-digg {
      padding-bottom: 2vh;
      .digg_counter {
        color: #59b6d7;
      }
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
      width: 70%;
    }
  }
  .feed-container-comments {
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
    padding: 0 12px 12px 12px;
    background-color: #fff;
    li {
      margin-top: 8px;
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
  .followAction {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .perComment {
    align-items: flex-start!important;
    padding: 10px 0;
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
