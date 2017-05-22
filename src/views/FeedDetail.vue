<template>
  <!-- <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight"> -->
  <div>
    <div id="spinner" v-show="showSpinner">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <div class="commonHeader" id="feed-header">
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
            <UnFollowingIcon @click.native="handleFollowingStatus" v-if="!userInfo.is_following && (userInfo.user_id != currentUser)" height="21" width="21" color="#999" />
          <!--已关注作者,但作者未关注我， 采用取消关注操作-->
            <FollowingIcon  @click.native="handleUnFollowingStatus" height="21" width="21" color="#59b6d7" v-if="userInfo.is_following && !userInfo.is_followed && (userInfo.user_id != currentUser)" />
          <!--相互关注， 采用取消关注操作-->
            <EachFollowingIcon v-if="userInfo.is_following && userInfo.is_followed && (userInfo.user_id != currentUser)" @click.native="handleUnFollowingStatus" height="21" width="21" color="#59b6d7" />
        </Col>
      </Row>
    </div>
    <div style="padding-top: 46px">
      <mt-loadmore 
        :bottom-method="loadBottom"
        :bottom-all-loaded="bottomAllLoaded"
        ref="loadmore"
        @bottom-status-change="bottomStatusChange"
        :bottomDistance="40"
      >
        <div class="feed-container">
          <div class="feed-container-content feed-background-color">
            <h3 v-if="feedData.feed.title" style="text-align: center; padding: 15px 8px 8px 8px; font-weight: 400; color: #59b6d7">{{ feedData.feed.feed_title }}</h3>
            <div>
              <div v-if="imagesList.length" class="feed-container-content-images">
                <div v-for="(item, index ) in imagesList" :key="index" :style="`height: ${item.height + 'px'}`">
                  <img v-lazy="item.url" />
                </div>
              </div>
              <div :class="{ feedContainerContentText: imagesList.length, feedContainerContentTextNoPadding: !imagesList.length }">
                {{ feedData.feed.feed_content }}
              </div>
            </div>
          </div>
          <div class="feed-container-tool feed-background-color">
            <div class="feed-container-tool-digg">
              <Row :gutter="24" style="display: flex; align-items: center;">
                <Col span="16"  @click.native="changeUrl(`/feed/${feed_id}/diggs`)">
                  <div style="display: flex; align-items: center;">
                    <div :style="`width: ${digglistWidth}`">
                      <div class="digg-digg-list" v-if="diggList.length" >
                        <img v-lazy="digg.avatar" :style="`left: ${25 * (index) + 'px'}; z-index: ${5 - (1 * index)}`" :alt="digg.name" v-for="(digg, index) in diggList" :key="index" >
                      </div>
                    </div>
                    <div class="digg_counter">
                      {{ friendNum(feedData.tool.feed_digg_count) }}人点赞
                    </div>
                  </div>
                </Col>
                <Col span="8">
                  <div class="detail-data">
                    <span>发布于<timeago :since="feedTimer" locale="zh-CN" :auto-update="60"></timeago></span>
                    <span>{{ friendNum(feedData.tool.feed_view_count) }}人浏览</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div class="feed-container-comments feed-background-color">
            <div class="noComment" v-if="!feedData.tool.feed_comment_count">
              <img :src="defaultImage" v-if="!feedData.tool.feed_comment_count" />
            </div>
            <div class="comments" v-if="feedData.tool.feed_comment_count">
              <Row :gutter="24" class="comments_count" style="height: 45px; display: -webkit-flex; display: flex; -webkit-align-items: center; align-items: center;">
                <Col span="24">
                    <span class="comments_counter">
                      {{feedData.tool.feed_comment_count}}人评论
                    </span>
                </Col>
              </Row>
              <div class="comments-content">
                <Row :gutter="24" v-for="(comment, index) in formateComments" :key="comment.id"  :class="$style.perComment">
                  <Col span="4">
                    <div class="grid-content bg-purple">
                      <img @click="changeUrl(`/users/feeds/${comment.user.user_id}`)" :src="comment.user.avatar[30]" alt="" style="width:100%; border-radius:50%">
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
                            <span v-if="comment.reply_to_user_id">回复 </span>
                            <router-link :class="$style.profileLink" :to="{ path: `/profile/${comment.reply_to_user_id}` }">{{ comment.replyToUser.name }} </router-link>
                            <span
                              v-if="comment.user_id  != currentUser"
                              @click.stop="focusInput(comment.user_id)"
                              :class="$style.commentContent"
                            > 
                             {{ comment.comment_content }}
                            </span>
                            <span
                              v-if="comment.user_id == currentUser"
                              @click.stop="showComfirm(comment.id, feed_id, index)"
                              :class="$style.commentContent"
                            > 
                             {{ comment.comment_content }}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
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
          <div v-if="!feedData.tool.is_digg_feed" @click="handleDiggFeed(feed_id)">
            <UnDiggIcon height="20" width="20" color="#999" />
            <i>喜欢</i>
          </div>
          <div v-if="feedData.tool.is_digg_feed" @click="handleUnDiggFeed(feed_id)">
            <DiggIcon height="20" width="20" color="#f4504d" />
            <i class="did">喜欢</i>
          </div>
        </Col>
        <Col span="6" class="operation">
          <div @click="focusInput(0)">
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
          <div v-if="!feedData.tool.is_collection_feed" @click="handleCollection(feed_id)">
            <ConnectionIcon height="20" width="20" color="#999" />
            <i>收藏</i>
          </div>
          <div v-if="feedData.tool.is_collection_feed" @click="handleUnCollection(feed_id)">
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
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo, followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE, SHOWFEEDDIGGSLISTS, FEEDSLIST, UPDATEFEED, CONFIRM, COMMENTINPUT, COLLECTIONIDS, ADDCOLLECTIONIDS, UNCOLLECTIONID } from '../stores/types';
  import getImg from '../utils/getImage';
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

  const noCommentImage = resolveImage(require('../statics/images/defaultNothingx2.png'));
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
      BackIcon
    },
    data: () => ({
      scroll: 0,
      feed_id: 0,
      feedData: {
        user_id: 0,
        feed: {
          feed_id: 1,
          title: "",
          content: "",
          created_at: "",
          feed_from: 2,
          storages: [],
        },
        tool: {
          feed_digg_count: 0,
          feed_view_count: 0,
          feed_comment_count: 0,
          is_digg_feed: 0,
          is_collection_feed: 0
        },
        diggs: [],
        comments: [] // 更新列表使用
      },
      comments: [],
      userInfo: {
        is_following: 0,
        is_followed: 0
      },
      defaultImage: noCommentImage,
      currentUser: 0,
      // 上拉加载更多相关
      bottomAllLoaded: false,
      max_id: 0,
      bottomStatus: '',
      showSpinner: true
    }),
    computed: {
      feedTimer () {
        return this.timers(this.feedData.feed.created_at, 8, false);
      },
      avatar () {
        const { avatar: { 30: avatar = '' } = {} } = this.userInfo;
        return avatar;
      },
      // 计算图片跳转地址
      imagesList () {
        let urlList = [];
        if(!this.feedData.feed.storages.length > 0) {
          return [];
        }
        this.feedData.feed.storages.forEach((value) => {
          urlList.push(
            {
              url: getImg(value.storage_id, 100),
              width: window.innerWidth,
              height: window.innerWidth * (value.height / value.width)
            }
          );
        });
        return urlList;
      },
      digglistWidth () {
        return this.feedData.diggs.length ? ((this.feedData.diggs.length-1)*25 + 45 + 'px') : '0px';
      },
      diggList () {
        let digg_list = this.feedData.diggs;
        let digg_users = [];
        let userLocal = {};
        let avatar = '';
        digg_list.forEach( (uid, index) => {
          userLocal = localEvent.getLocalItem(`user_${uid}`);
          if(index > 4) { return; }
          if(!lodash.keys(userLocal).length > 0) {
            getUserInfo(uid, 30).then(user => {
              digg_users.push({
                avatar: user.avatar[30],
                user_id: user.user_id,
                name: user.name
              });
            });
          } else {
            digg_users.push({
              avatar: userLocal.avatar[30],
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
      handleCollection (feed_id) {
        addAccessToken().post(createAPI(`feeds/${feed_id}/collection`), {}, {
          validateStatus: status => status === 201
        })
        .then(response => {
          let data = response.data;
          if(data.status || data.code == 0) {
            this.$store.dispatch(COLLECTIONIDS, cb => {
              cb([
                feed_id
              ])
            });
            this.feedData.tool.is_collection_feed = 1;
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 1500,
                status: false
              });
            });
          }
        })
      },
      handleUnCollection (feed_id) {
        addAccessToken().delete(createAPI(`feeds/${feed_id}/collection`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.feedData.tool.is_collection_feed = 0;
          this.$store.dispatch(UNCOLLECTIONID, cb => {
            cb(feed_id);
          })
        })
      },
      handleDiggFeed (feed_id) {
        addAccessToken().post(createAPI(`feeds/${feed_id}/digg`), {}, {
          validateStatus: status => status === 201
        })
        .then(response => {
          let data = response.data;
          if(data.status || data.code == 0) {
            this.feedData.tool.is_digg_feed = 1;
            this.feedData.diggs.push(this.currentUser);
            this.feedData.tool.feed_digg_count++;
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 1500,
                status: false
              });
            });
          }
        })
      },
      handleUnDiggFeed (feed_id) {
        addAccessToken().delete(createAPI(`feeds/${feed_id}/digg`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.feedData.tool.is_digg_feed = 0;
          this.feedData.tool.feed_digg_count--;
          this.removeByValue(this.feedData.diggs, this.currentUser);
        })
      },
      handleUnFollowingStatus () {
        unFollowingUser(this.feedData.user_id).then(() => {
          this.userInfo = { ...this.userInfo, is_following: 0 };
          localEvent.setLocalItem(`user_${this.feedData.user_id}`, this.userInfo);
        })
        .catch(error => {
        
        });
      },
      handleFollowingStatus () {
        followingUser(this.feedData.user_id).then(status => {
          if(status.status || status.code == 0) {
            this.userInfo = { ...this.userInfo, is_following: 1 };
            localEvent.setLocalItem(`user_${this.feedData.user_id}`, this.userInfo);
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: status.message,
                time: 1500,
                status: true
              });
            });
          }
        })
      },
      loadBottom() {
        let max_id = this.max_id;
        let limit = 15;
        this.bottomStatus = 'loading';
        addAccessToken().get(
          createAPI(`feeds/${this.feed_id}/comments?max_id=${max_id}&limit=${limit}`),
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
      focusInput (comment_to_uid = 0) {
        let reply_to_user_id = comment_to_uid ? comment_to_uid : 0;
        let to_user = this.userInfo;
        if(reply_to_user_id) {
          to_user = localEvent.getLocalItem(`user_${comment_to_uid}`);
        }
        let to_user_name = ''; // 回复谁 用户名
        let show = true; // 展示输入框
        let feed = this.feedData;
        if (!lodash.keys(to_user).length > 0) {
          getUserInfo(comment_to_uid, 30).then(user => {
            to_user = user;
            to_user_name = to_user.name;
          });
        } else {
          to_user_name = to_user.name;
        }
        this.$store.dispatch(COMMENTINPUT, cb => {
          cb({
            data: {
              show,
              reply_to_user_id,
              to_user_name,
              feed
            }
            // cb: this.updateComments
          });
        })
      },
      // updateComments (close, data) {
      //   if(data.user === undefined) {
      //     getUserInfo(data.user_id, 30).then(user => {
      //       data.user = { ...data.user, ...user };
      //       this.$nextTick(function () {
      //         this.comments.unshift(data);
      //       });
      //     })
      //   } else {
      //     this.$nextTick(function () {
      //       this.comments.unshift(data);
      //     });
      //   }
      // },
      // 新版删除确认提示
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
      deleteComment (close, data) {
        addAccessToken().delete(createAPI(`feeds/${data.feed_id}/comment/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          let newComments = this.comments;
          newComments.splice(data.index,1);
          this.comments = newComments;
          this.feedData.tool.feed_comment_count -- ;
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '已删除',
              time: 1500,
              status: false
            });
          });
        })
      },
      getImg,
      friendNum,
      unFollowingUser,
      followingUser,
      goBack () {
        this.$router.back();
      },
      getUser (user_id) {
        let userLocal = localEvent.getLocalItem(`user_${user_id}`);
        if (!lodash.keys(userLocal).length) {
          getUserInfo(user_id, 30).then(user => {
            this.userInfo = { ...this.userInfo, ...user };
          });
        } else {
          this.userInfo = { ...this.userInfo, ...userLocal };
        }
      },
      menu() {
        // console.log(document);
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
      let currentUser = localEvent.getLocalItem('UserLoginInfo');
      this.currentUser = currentUser.user_id;
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
      // 先获取本地动态
      // let localFeed = this.$store.getters[FEEDSLIST][feed_id];
      // if(lodash.keys(localFeed).length) {
      //   this.feedData.comments = localFeed.comments;
      // }
        // 获取动态详情
        addAccessToken().get(
          createAPI(`feeds/${feed_id}`),
          {},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({ data: { data = {} } = {} }) => {
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
          .then(({ data: { data = {} } = {} }) => {
            // 格式化评论列表
            let formatedComments = formateFeedComments(data);
            this.comments = data;
            this.feedData = { ...this.feedData, comments: data };
            if(this.comments.length < 15) {
              this.bottomAllLoaded = true;
            }
            this.$store.dispatch(UPDATEFEED, cb => {
              cb(this.feedData);
            })
            setTimeout( () => {
              this.showSpinner = false;
            }, 1200);
          });
        });
      // }
    },
    mounted () {
      window.addEventListener('scroll', this.menu);
    }
  }; 

  export default feedDetail;
</script>
<style lang="scss" scoped>
  .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
    transform: inherit!important;
  }
  .feed-container {
    background-color: #f4f5f5;
  }
  #feed-footer {
    transition: bottom .2s;
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
      padding: 20px 8px;
    }
    .feedContainerContentTextNoPadding {
      padding: 16px 8px 20px 8px;
      word-break: break-all;
    }
  }
  .digg-digg-list {
    position: relative;
    height: 40px;
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
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    span {
      font-size: 12px;
      color: #ccc
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
</style>
<style lang="scss" module>
  .commentInput{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 6;
    background-color: #fff;
    border-bottom: 1px #59b6d7 solid;
    border: none;
    padding: 10px 0;
    textarea {
      min-height: 34px!important;
    }
  }
  .followAction {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .perComment {
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
