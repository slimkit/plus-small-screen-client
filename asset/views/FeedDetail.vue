<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    <div>
      <mt-loadmore 
        :bottom-method="loadBottom"
        :bottom-all-loaded="bottomAllLoaded"
        ref="loadmore"
        bottomPullText="上拉加载更多评论"
        bottomDropText="释放加载更多评论"
        :bottomDistance="70"
      >
        <div class="feed-container">
          <div class="feed-container-header feed-background-color">
            <Row :gutter="16">
              <Col span="3" style="display: flex; justify-content: flex-start">
                <i class="ivu-icon ivu-icon-android-arrow-back" @click="goBack" style="width: 100%; height: 100%; display: flex; align-items: center;"></i>
              </Col>
              <Col span="18">
                <div>
                  <router-link :to="`/profile/${userInfo.user_id}`" class="avatar">
                    <div class="avatar-content">
                      <img class="avatar" v-lazy="avatar" alt="">
                    </div>
                    <span style="font-size: 18px; padding: 0 5px">{{userInfo.name}}</span>
                  </router-link>
                </div>
              </Col>
              <Col span="3" style="display: flex;">
                <i @click="handleFollowingStatus" v-if="!userInfo.following && (userInfo.user_id != currentUser)" class="ivu-icon ivu-icon-android-person-add" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-end"></i>
                <i class="ivu-icon ivu-icon-person" @click="handleUnFollowingStatus" v-if="userInfo.following && (userInfo.user_id != currentUser)" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-end"></i>
              </Col>
            </Row>
          </div>
          <div class="feed-container-content feed-background-color">
            <h3 v-if="feedData.feed.title" style="text-align: center; padding: 15px 8px 8px 8px; font-weight: 400; color: #59b6d7">{{ feedData.feed.title }}</h3>
            <div>
              <div v-if="imagesList.length" class="feed-container-content-images">
                <div v-for="(item, index ) in imagesList" :key="index" :style="`height: ${item.height + 'px'}`">
                  <img v-lazy="item.url" />
                </div>
              </div>
              <div :class="{ feedContainerContentText: imagesList.length, feedContainerContentTextNoPadding: !imagesList.length }">
                {{ feedData.feed.content }}
              </div>
            </div>
          </div>
          <div class="feed-container-tool feed-background-color">
            <div class="feed-container-tool-digg">
              <Row :gutter="16" style="display: flex; align-items: center;">
                <Col span="17">
                  <div style="display: flex; align-items: center;" @click="handleShowDiggList">
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
                <Col span="7">
                  <div class="detail-data">
                    <span>发布于<timeago :since="timer"></timeago></span>
                    <span>{{ friendNum(feedData.tool.feed_view_count) }}人浏览</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div class="feed-container-comments feed-background-color">
            <div class="noComment" v-if="!feedData.tool.feed_comment_count">
              <img :src="`http://localhost:8080${defaultImage}`" v-if="!feedData.tool.feed_comment_count" />
            </div>
            <div class="comments" v-if="feedData.tool.feed_comment_count">
              <Row :gutter="16" class="comments_count" style="height: 45px; display: -webkit-flex; display: flex; -webkit-align-items: center; align-items: center;">
                <Col span="24">
                    <span class="comments_counter">
                      {{feedData.tool.feed_comment_count}}人评论
                    </span>
                </Col>
              </Row>
              <div class="comments-content">
                <Row :gutter="16" v-for="(comment, index) in comments" :key="comment.id"  :class="$style.perComment">
                  <Col span="4">
                    <div class="grid-content bg-purple">
                      <img :src="selfAvatar" alt="" style="width:100%; border-radius:50%">
                    </div>
                  </Col>
                  <Col span="20">
                    <div class="grid-content bg-purple">
                      <Row style="padding-bottom: 5px">
                        <Col span="17">
                          <router-link :class="$style.profileLink" :to="{ path: `/profile/${comment.user.user_id}` }">{{ comment.user.name }}</router-link>
                        </Col>
                        <Col span="7" style="display: flex; justify-content: flex-end;">
                          <timeago :since="comment.created_at" style="color: #ccc;"></timeago>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="24">
                          <div style="color: #ccc;">
                            <span v-if="comment.reply_to_user_id">回复 </span>
                            <router-link :class="$style.profileLink" :to="{ path: `/profile/${comment.reply_to_user_id}` }">{{ comment.replyToUser.name }} </router-link>
                            <span
                              v-if="comment.user_id  != currentUser"
                              @click.stop="focusInput(comment.id, comment.user_id, feed_id)"
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
        <div v-show="bottomAllLoaded && bottomStatus !== 'loading' && comments.length > 15" style="display: flex; justify-content: center; align-items: center; padding: 10px 0; margin-bottom: 50px">
          <span>没有更多了</span>
        </div>
      </mt-loadmore>
      <div class="feed-container-tool-operation feed-background-color">
        <Row :gutter="16" style="display: flex; justify-content: center; align-items: center; height: 100%;">
          <Col span="6" :class="$style.operation">
            <div v-if="!feedData.tool.is_digg_feed" @click="handleDiggFeed(feed_id)">
              <i class="ivu-icon ivu-icon-android-favorite"></i>
              <i>喜欢</i>
            </div>
            <div v-if="feedData.tool.is_digg_feed" @click="handleUnDiggFeed(feed_id)">
              <i class="ivu-icon ivu-icon-android-favorite did"></i>
              <i class="did">喜欢</i>
            </div>
          </Col>
          <Col span="6" :class="$style.operation">
            <div @click="handleCommentForFeed(feed_id)">
              <i class="iconfont icon-comment"></i>
              <i>评论</i>
            </div>
          </Col>
          <Col span="6" :class="$style.operation">
            <i class="ivu-icon ivu-icon-share"></i>
            <i>分享</i>
          </Col>
          <Col span="6" :class="$style.operation">
            <div v-if="!feedData.tool.is_collection_feed" @click="handleCollection(feed_id)">
              <i class="ivu-icon ivu-icon-android-star"></i>
              <i>收藏</i>
            </div>
            <div v-if="feedData.tool.is_collection_feed" @click="handleUnCollection(feed_id)">
              <i class="ivu-icon ivu-icon-android-star did"></i>
              <i class="did">收藏</i>
            </div>
          </Col>
        </Row>
      </div>
      <!-- 评论输入框 -->
      <div v-if="commentComponent.CanInput" :class="$style.commentInput">
        <Row :gutter="16" type="flex" align="bottom" style="margin-left: 0; margin-right: 0;">
          <Col span="20">
            <Input
              type="textarea"
              class="commentInput"
              v-if="commentComponent.CanInput"
              :placeholder="commentComponent.placeholder"
              :autosize="{ minRows: 1, maxRows: 4 }" 
              :minlength="1"
              :maxlength="255"
              v-model="commentComponent.userComment"
            >
            </Input>
          </Col>
          <Col span="4">
            <Row v-if="commentCount > 200" :class="$style.commentCount">
              <Col span="24" ><span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255</Col>
            </Row>
            <Row>
              <Col span="24">
                <Button 
                  :long="true" 
                  type="primary" 
                  :class="$style.sendComment" 
                  :disabled="commentCount == 0" 
                  size="small" 
                  @click.native="sendComment()"
                  html-type="button"
                >
                  发送
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <!-- 删除评论确认框 -->
      <Comfirm v-if="commentComponent.isShowComfirm" @cannel="cannel" @increment="deleteComment" :data="commentComponent.deleteData" comfirm-content="删除这条评论"></Comfirm>
      <!--wrapper-->
      <div @click.stop="closeInput" :class="$style.wrapper" v-show="commentComponent.CanInput"></div>
    </div>
  </transition>
</template>
<script>
  import { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo, followingUser, unFollowingUser } from '../utils/user';
  import { NOTICE } from '../stores/types';
  import getImg from '../utils/getImage';
  import { friendNum } from '../utils/friendNum';
  import noCommentImage from '../statics/images/img_default_nothing@3x.png';
  import Comfirm from '../utils/Comfirm';
  import formateFeedComments from '../utils/formateFeedComments';
  import { SHOWFEEDDIGGSLISTS } from '../stores/types';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const feedDetail = {
    components: {
      Comfirm
    },
    data: () => ({
      feed_id: 0,
      feedData: {
        user_id: 0,
        feed: {
          id: 1,
          title: "",
          content: "",
          created_at: "",
          feed_from: 2,
          feed_storages: [],
        },
        tool: {
          feed_digg_count: 0,
          feed_view_count: 0,
          feed_comment_count: 0,
          is_digg_feed: 0,
          is_collection_feed: 0
        },
        diggs: []
      },
      comments: [],
      userInfo: {},
      defaultImage: noCommentImage,
      commentComponent: { // 评论相关
        CanInput: false, // 输入框显示
        isShowComfirm: false, // 是否显弹框
        deleteData: {}, // 删除评论时传递的数据对象
        sending: false, // 是否发送中
        placeholder: '', // 占位文字
        userComment: '', // 用户评论内容
        replyToUserId: 0, // 回复谁
      },
      currentUser: currentUser.user_id,
      // 上拉加载更多相关
      bottomAllLoaded: false,
      max_id: 0,
      bottomStatus: ''
    }),
    computed: {
      avatar () {
        const { avatar: { 30: avatar = '' } = {} } = this.userInfo;
        return avatar;
      },
      selfAvatar () {
        const { avatar: { 30: avatar = '' } = {} } = localEvent.getLocalItem(`user_${this.currentUser}`);
        return avatar;
      },
      // 计算图片跳转地址
      imagesList () {
        let urlList = [];
        if(!this.feedData.feed.feed_storages.length > 0) {
          return [];
        }
        this.feedData.feed.feed_storages.forEach((value) => {
          console.log(value);
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
      // 检测用户输入的评论长度
      commentCount () {
        return this.commentComponent.userComment.length;
      },
      timer () {
        let newDate = new Date();
        newDate.setTime(this.feedData.feed.created_at * 1000);
        return newDate;
      },
      diggList () {
        let digg_list = this.feedData.diggs;
        let digg_users = [];
        let userLocal = {};
        let avatar = '';
        for(let index in digg_list ){
          userLocal = localEvent.getLocalItem(`user_${digg_list[index]}`);
          if(index > 4) { break; }
          if(Object.keys(userLocal).length == 0) {
            getUserInfo(digg_list[index], 30, user => {
              // userLocal = user;
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
        };
        return digg_users;
      },
    },
    methods: {
      handleShowDiggList () {
        let digg_list = this.feedData.diggs;
        let digg_users = {};
        let userLocal = {};
        let avatar = '';
        digg_list.forEach((digg) => {
          userLocal = localEvent.getLocalItem(`user_${digg}`);
          if(Object.keys(userLocal).length == 0) {
            getUserInfo(digg, 30, user => {
              userLocal = user;
            });
          }
          let intro = '';
          if(userLocal.hasOwnProperty('datas')) {
            if(userLocal.datas.hasOwnProperty('intro')) {
              intro = userLocal.datas.intro.value
            }
          }
          let diggFormate = { 
            [digg] : {
              is_following: userLocal.is_following,
              is_followed: userLocal.is_followed,
              user_id: digg,
              avatar: userLocal.avatar[30],
              name: userLocal.name,
              intro: intro
            }
          }
          digg_users = { ...digg_users, ...diggFormate };
        });
          
        // };
        this.$store.dispatch(SHOWFEEDDIGGSLISTS, cb => {
          cb({
            show: true,
            diggs: digg_users
          })
        })
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
            this.feedData.tool.is_collection_feed = 1;
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          }
        })
        .catch(error => {

        })
      },
      handleUnCollection (feed_id) {
        addAccessToken().delete(createAPI(`feeds/${feed_id}/collection`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          this.feedData.tool.is_collection_feed = 0;
        })
        .catch(error => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: error.response.data.message,
              time: 2000,
              status: false
            });
          });
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
                time: 2000,
                status: false
              });
            });
          }
        })
        .catch(error => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: error.response.data.message,
              time: 2000,
              status: false
            });
          });
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
        .catch(error => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: error.response.data.message ? error.response.data.message : '发生了一些错误',
              time: 2000,
              status: false
            });
          });
        })
      },
      handleUnFollowingStatus () {
        unFollowingUser(this.feedData.user_id, status => {
          if(status.status || status.code == 0) {
            this.userInfo.is_following = 0;
            localEvent.setLocalItem(`user_${this.feedData.user_id}`, this.userInfo);
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: status.message,
                time: 2000,
                status: true
              });
            });
          }
        })
      },
      handleFollowingStatus () {
        followingUser(this.feedData.user_id, status => {
          if(status.status || status.code == 0) {
            this.userInfo.is_following = 1;
            localEvent.setLocalItem(`user_${this.feedData.user_id}`, this.userInfo);
          } else {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: status.message,
                time: 2000,
                status: true
              });
            });
          }
        })
      },
      loadMore () {
        console.log('loadMore');
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
          formatedAddComments = formateFeedComments(data);
          formatedAddComments.comments.forEach((comment) => {
            this.comments.push(comment);
          });
          setTimeout(() => {
            // 若数据已全部获取完毕
            this.bottomStatus = '';
            this.bottomAllLoaded = bottomAllLoaded;
            this.$refs.loadmore.onBottomLoaded();
          }, 500);
        })
        .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: message,
              time: 1500,
              status: false
            });
          });
        });
      },
      handleCommentForFeed(feed_id) {
        this.commentComponent.placeholder = `回复: ${this.userInfo.name}`;
        this.commentComponent.userComment = '';
        this.commentComponent.CanInput = true;
        this.commentComponent.replyToUserId = 0;
      },
      focusInput (comment_id, comment_to_uid, feed_id) {
        this.commentComponent.userComment = '';
        let to_user = localEvent.getLocalItem(`user_${comment_to_uid}`);
        if (!to_user.length) {
          getUserInfo(comment_to_uid, 30, user => {
            to_user = user;
            this.commentComponent.placeholder = `回复: ${to_user.name}`;
          });
        } else {
          this.commentComponent.placeholder = `回复: ${to_user.name}`;
        }
        this.commentComponent.CanInput = true;
        this.commentComponent.replyToUserId = comment_to_uid;

      },
      // comfirm显示
      cannel () {
        this.commentComponent.isShowComfirm = false;
        this.commentComponent.deleteData = {};
      },
      showComfirm (commentId, feedId, index) {
        this.commentComponent.isShowComfirm = true;
        this.commentComponent.deleteData = {
          comment_id: commentId,
          feed_id: feedId,
          index: index
        };
      },
      closeInput () {
        this.commentComponent.placeholder = '';
        this.commentComponent.CanInput = false;
        this.commentComponent.userComment = '';
        this.commentComponent.replyToUserId = 0;
      },
      deleteComment (data) {
        addAccessToken().delete(createAPI(`feeds/${data.feed_id}/comment/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          let newComments = this.comments;
          this.commentComponent.isShowComfirm = false;
          this.commentComponent.deleteData = {};
          newComments.splice(data.index,1);
          this.comments = newComments;
          this.feedData.tool.feed_comment_count -- ;
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '已删除',
              time: 2000,
              status: false
            });
          });
        })
        .catch(error => {
          console.log(error)
        })
      },
      sendComment () {
        let comment_content = this.commentComponent.userComment;
        let reply_to_user_id = this.commentComponent.replyToUserId;
        let user_id = this.currentUser;
        let oldCommentInfo = this.comments;
        let newCommentInfo = [];
        addAccessToken().post(createAPI(`feeds/${this.feed_id}/comment`), {
            comment_content,
            reply_to_user_id
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          if(response.data.code === 0 || response.data.status) {
            let newComment = {
              comment_content: comment_content,
              comment_mark: null,
              created_at:  parseInt(new Date().getTime()),
              id: response.data.data,
              reply_to_user_id: reply_to_user_id,
              user_id: user_id,
              replyToUser: localEvent.getLocalItem(`user_${reply_to_user_id}`),
              user: localEvent.getLocalItem(`user_${this.currentUser}`)
            };
            this.commentComponent.placeholder = '';
            this.commentComponent.CanInput = false;
            this.commentComponent.userComment = '';
            this.commentComponent.replyToUserId = 0;
            oldCommentInfo.unshift(newComment);
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '已发送',
                time: 2000,
                status: true
              });
            });
            this.$nextTick(function () {
              this.feedData.tool.feed_comment_count ++ ;
              this.comments = oldCommentInfo;
            });
          }
        })
        .catch(({ response: { data = {} } = {} } ) => {
          const { code = 'xxxx' } = data;
        })
      },
      // 获取动态作者信息
      getUser (user_id) {
        let userLocal = localEvent.getLocalItem(`user_${user_id}`);
        if (Object.keys(userLocal).lenght == 0) {
          getUserInfo(user_id, 30, user => {
            this.userInfo = Object.assign({}, this.userInfo, user);
          });
        } else {
          this.userInfo = Object.assign({}, this.userInfo, userLocal);
        }
      },
      getImg,
      friendNum,
      unFollowingUser,
      followingUser,
      goBack () {
        this.$router.back();
      }
    },
    created () {
      let feed_id = parseInt(this.$route.params.feed_id);
      if ( !feed_id ) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        this.goBack();
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
      .then(({ data: { data = {} } = {} }) => {
        this.getUser(data.user_id);
        this.feed_id = feed_id;
        this.feedData = Object.assign({}, this.feedData, data);
      })
      .catch(({ data: { data = {} } = {} }) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: data.message,
            time: 1500,
            status: false
          });
          this.goBack();
        });
      });
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
        this.$nextTick(function () {
          this.max_id = formatedComments.max_id;
          this.comments = formatedComments.comments;
          if(this.comments.length < 15) {
            this.bottomAllLoaded = true;
          }
        })
      })
      .catch(({ data: { data = {} } = {} }) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: data.message,
            time: 1500,
            status: false
          });
          this.goBack();
        });
      });
    }
  }; 

  export default feedDetail;
</script>
<style lang="scss">
  .mint-loadmore-content-parent-no-trans .mint-loadmore-content {
    transform: inherit!important;
  }
  .feed-container {
    background-color: #f4f5f5;
  }
  .feed-background-color {
    background-color: #fff;
  }
  .avatar {
    object-fit: cover;
    color: #333;
  }
  i.did {
    color: #f4504d;
  }
  .feed-container-header {
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
        .avatar-content {
          height: 100%;
          display: flex;
          border-radius: 50%;
          overflow: hidden;
          align-items: center;
          img {
            height: 100%;
            object-fit: cover;
          }
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
          width: auto;
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
    }
  }
  .feed-container-tool-operation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    // display: none;
    z-index: 6;
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
  .perComment {
    padding: 10px 0;
    .profileLink {
      color: #333;
    }
  }
  .commentCount {
    margin-bottom: .5em;
    font-size: 12px;
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
