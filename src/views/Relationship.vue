<template>
	<div class="relationship">
		<BackIcon width="21" height="21" @click.native="goTo(-1)" color="#999" style="z-index: 4; position: absolute; left: 12px; top: 12px;" />
		<Tabs v-model="type" @on-click="getData">
      <Tab-pane label="粉丝" name="followed">
        <div v-if="!nothing" class="fixed"></div>
        <mt-loadmore
          v-if="!nothing"
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="topAllLoaded"
          ref="loadmorefollowed"
          :bottomDistance="70"
          @bottom-status-change="bottomStatusChange"
        >
        	<Row :gutter="24" v-for="(user, index) in dataList" :key="index" class-name="list">
            <Col span="4" @click.native="changeUrl(`/users/feeds/${user.user_id}`)">
              <img :class="$style.diggAvatar" v-lazy="user.avatar" :alt="user.name" :title="user.name">
            </Col>
            <Col span="16">
              <h4 @click="changeUrl(`/users/feeds/${user.user_id}`)">{{ user.name }}</h4>
              <p>{{ user.intro }}</p>
            </Col>
            <Col span="4" class="header-end-col" v-if="currentUser == user_id">
              <UnFollowingIcon @click.native="doFollowing(user.user_id, index, 'followed')" v-if="!user.is_following && currentUser != user.user_id" height="21" width="21" color="#999" />
              <FollowingIcon @click.native="doUnFollowing(user.user_id, index, 'followed')" v-if="user.is_following && !user.is_followed && currentUser != user.user_id" height="21" width="21" color="#59b6d7" />
              <EachFollowingIcon @click.native="doUnFollowing(user.user_id, index, 'followed')" v-if="user.is_following && user.is_followed && currentUser != user.user_id" height="21" width="21" color="#59b6d7" />
            </Col>
          </Row>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomAllLoaded">没有更多了</span>
            <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
            <span v-show="bottomStatus === 'loading'">加载中...</span>
            <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
          </div>
        </mt-loadmore>
        <div class="nothingDefault"> 
          <img v-if="nothing" :src="nothing" />
        </div>
      </Tab-pane>
      <Tab-pane label="关注" name="following" >
        <div v-if="!nothing" class="fixed"></div>
        <mt-loadmore
          v-if="!nothing"
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="topAllLoaded"
          ref="loadmorefollowing"
          :bottomDistance="70"
          @bottom-status-change="bottomStatusChange"
        >
          <Row :gutter="24" v-for="(user, index) in dataList" :key="index" class-name="list">
            <Col span="4" @click.native="changeUrl(`/users/feeds/${user.user_id}`)">
              <img :class="$style.diggAvatar" v-lazy="user.avatar" :alt="user.name" :title="user.name">
            </Col>
            <Col span="16">
              <h4 @click="changeUrl(`/users/feeds/${user.user_id}`)">{{ user.name }}</h4>
              <p>{{ user.intro }}</p>
            </Col>
            <Col span="4" class="header-end-col" v-if="currentUser == user_id">
              <UnFollowingIcon @click.native="doFollowing(user.user_id, index, 'following')" v-if="!user.is_following && currentUser != user.user_id" height="21" width="21" color="#999" />
              <FollowingIcon @click.native="doUnFollowing(user.user_id, index, 'following')" v-if="user.is_following && !user.is_followed && currentUser != user.user_id" height="21" width="21" color="#59b6d7" />
              <EachFollowingIcon @click.native="doUnFollowing(user.user_id, index, 'following')" v-if="user.is_following && user.is_followed && currentUser != user.user_id" height="21" width="21" color="#59b6d7" />
            </Col>
          </Row>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomAllLoaded">没有更多了</span>
            <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
            <span v-show="bottomStatus === 'loading' && !bottomAllLoaded">加载中...</span>
            <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
          </div>
        </mt-loadmore>
        <div class="nothingDefault"> 
          <img v-if="nothing" :src="nothing" />
        </div>
      </Tab-pane>
    </Tabs>
	</div>
</template>

<script>
	import { NOTICE } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';
	import BackIcon from '../icons/Back';
  import FollowingIcon from '../icons/Following';
  import UnFollowingIcon from '../icons/UnFollowing';
  import EachFollowingIcon from '../icons/EachFollowing';
	import { goTo, changeUrl } from '../utils/changeUrl';
	import oneOf  from '../utils/contains';
  import localEvent from '../stores/localStorage';
  import lodash from 'lodash';
  import { resolveImage } from '../utils/resource';
  import { getUserInfo, followingUser, unFollowingUser } from '../utils/user';

  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));
  const defaultNoBody = resolveImage(require('../statics/images/img_default_nobody@2x.png'));

	const relationship = {
		components: {
			BackIcon,
      FollowingIcon,
      UnFollowingIcon,
      EachFollowingIcon
		},
		data: () => ({
			type: '',
			user_id: 0,
			following: {},
			followed: {},
      dataList: {},
      currentUser: 0,
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      isShowComfirm: false,
      topStatus: '',
      max_id: 0
		}),
		methods: {
			goTo,
			changeUrl,
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      // 加载更多
      loadBottom () {
        setTimeout(() => {
          this.$refs[`loadmore${this.type}`].onBottomLoaded();
        }, 100);
      },
      loadTop () {
        let uri = '';
        let key = '';
        let lists = [];
        if(this.type == 'followed') {
          uri = `follows/followeds/${this.user_id}`;
          key = 'followeds';
        } else {
          uri = `follows/follows/${this.user_id}`;
          key = 'follows';
        }
        addAccessToken().get(createAPI(`${uri}?limit=15`), {}, {
          validateStatus: status => status === 200
        })
        .then( response => {
          let datas = response.data.data[key];
          if(!datas.length > 0) {
            this.bottomAllLoaded = true;
            setTimeout(() => {
              this.$refs[`loadmore${this.type}`].onTopLoaded();
            }, 100);
            return;
          }
          if(datas.length < 15) {
            this.bottomAllLoaded = true;
          }
          this.dataList = [];
          datas.forEach( (data, index) => {
            let userInfo = localEvent.getLocalItem(`user_${data.user_id}`);
            let targetUser = {};
            if(!lodash.keys(userInfo).length > 0) {
              getUserInfo(data.user_id, 30).then(user => {
                const { datas: { intro: { value: intro = '这家伙很懒,什么都没有留下' } = {} } = {} } = user;
                const { avatar: { 30: avatar = defaultAvatar } = {} } = user;
                lists = { ...lists, [user.user_id]: {
                  is_following: user.is_following,
                  is_followed: user.is_followed,
                  user_id: user.user_id,
                  avatar: avatar,
                  name: user.name,
                  intro: intro
                } };
                this.dataList = lists;
              })
            } else {
              const { datas: { intro: { value: intro = '这家伙很懒,什么都没有留下' } = {} } = {} } = userInfo;
              const { avatar: { 30: avatar = defaultAvatar } = {} } = userInfo;
              lists = { ...lists, [userInfo.user_id]: {
                is_following: userInfo.is_following,
                is_followed: userInfo.is_followed,
                user_id: userInfo.user_id,
                avatar: avatar,
                name: userInfo.name,
                intro: intro
              } };
              this.dataList = this[name] = lists;
            }
          });
          this.max_id = datas[datas.length -1].id;
          // loadmore重新洗牌
          if(this.$refs[`loadmore${this.type}`]) {
            setTimeout(() => {
              this.$refs[`loadmore${this.type}`].onTopLoaded();
            }, 900);
          }
        });
      },
      // 关注用户
      doFollowing (user, index, type) {
        followingUser(user)
        .then(status => {
          if(status.status || status.code == 0) {
            let localUser = localEvent.getLocalItem(`user_${user}`);
            let localCurrentUser = localEvent.getLocalItem(`user_${this.currentUser}`);
            let lists = this[type];
            let dataList = this.dataList;
            localUser.is_following = 1;
            localEvent.setLocalItem(`user_${user}`, localUser);
            localCurrentUser.counts.following_count += 1;
            localEvent.setLocalItem(`user_${this.currentUser}`, localCurrentUser);
            // if(type == 'following') {
              lists[index].is_following = 1;
              dataList = this.dataList;
            // }
            this[type] = lists;
            // this[this.type][index].is_following = 1;
            // this.dataList[index].is_following = 1;
            this.dataList = dataList;
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

      // 取消关注用户
      doUnFollowing (user, index, type) {
        unFollowingUser(user)
        .then(() => {
          let localUser = localEvent.getLocalItem(`user_${user}`);
          let localCurrentUser = localEvent.getLocalItem(`user_${this.currentUser}`);
          let lists = this[type];
          let dataList = this.dataList;
          localUser.is_following = 0;
          localCurrentUser.counts.following_count -= 1;
          localEvent.setLocalItem(`user_${this.currentUser}`, localCurrentUser);
          localEvent.setLocalItem(`user_${user}`, localUser);
          if(type == 'following') {
            lists.splice(index, 1);
            dataList.splice(index, 1);
          } else {
            lists[index].is_following = 0;
            dataList[index].is_following = 0;
          }
          this[type] = lists;
          this.dataList = dataList;
        });
      },
      // 设置需要展示的数据
      getData (name) {
        let uri = '';
        let key = '';
        let lists = [];
        if(name == 'followed') {
          uri = `follows/followeds/${this.user_id}`;
          key = 'followeds';
        } else {
          uri = `follows/follows/${this.user_id}`;
          key = 'follows';
        }
        addAccessToken().get(createAPI(`${uri}?limit=15`), {}, {
          validateStatus: status => status === 200
        })
        .then( response => {
          let datas = response.data.data[key];
          if(!datas.length > 0) {
            this.bottomAllLoaded = true;
            if(this.$refs[`loadmore${name}`]) {
              this.$refs[`loadmore${name}`].onBottomLoaded();
            }
            return [];
          }
          if(datas.length < 15) {
            this.bottomAllLoaded = true;
            if(this.$refs[`loadmore${name}`]) {
              this.$refs[`loadmore${name}`].onBottomLoaded();
            }
          }
          this.dataList = [];
          datas.forEach( (data, index) => {
            let userInfo = localEvent.getLocalItem(`user_${data.user_id}`);
            let targetUser = {};
            if(!lodash.keys(userInfo).length > 0) {
              getUserInfo(data.user_id, 30).then(user => {
                const { datas: { intro: { value: intro = '这家伙很懒,什么都没有留下' } = {} } = {} } = user;
                const { avatar: { 30: avatar = defaultAvatar } = {} } = user;
                lists = { ...lists, [user.user_id]: {
                  is_following: user.is_following,
                  is_followed: user.is_followed,
                  user_id: user.user_id,
                  avatar: avatar,
                  name: user.name,
                  intro: intro
                } };
                this.dataList = lists;
              })
            } else {
              const { datas: { intro: { value: intro = '这家伙很懒,什么都没有留下' } = {} } = {} } = userInfo;
              const { avatar: { 30: avatar = defaultAvatar } = {} } = userInfo;
              lists = { ...lists, [userInfo.user_id]: {
                is_following: userInfo.is_following,
                is_followed: userInfo.is_followed,
                user_id: userInfo.user_id,
                avatar: avatar,
                name: userInfo.name,
                intro: intro
              } };
              this.dataList = this[name] = lists;
            }
          });
          this.max_id = datas[datas.length -1].id;
          if(this.$refs[`loadmore${name}`]) {
            this.$refs[`loadmore${name}`].onTopLoaded();
          }
        });
      }
		},
    computed: {
      nothing () {
        return lodash.keys(this.dataList).length > 0 ? 0 : defaultNoBody;
      }
    },
		created () {
			let status = this.$route.params.status;
			let user_id = this.$route.params.user_id;
			if(!user_id || !oneOf(['followed', 'following'], status)) {
				this.$store.dispatch(NOTICE, cb => {
					cb({
						show: true,
						status: false,
						text: '参数错误',
						time: 1500
					});
				})
				setTimeout( () => {
					goTo(-1);
				}, 1500);
			}
			this.type = status;
			this.user_id = user_id;
      let localUser = localEvent.getLocalItem('UserLoginInfo');
      this.currentUser = localUser.user_id;
      this.getData(status);
		}
	};

	export default relationship;
</script>

<style lang="scss">
	.relationship {
    .ivu-tabs {
      overflow-y: visible;
      overflow-x: hidden;
      .ivu-tabs-tabpane {
        min-height: calc(100vh - 46px);
      }
    }
		position: relative;
    .ivu-tabs-bar {
      margin-bottom: 0;
      background: #fff;
      border-bottom: 1px #e2e3e3 solid;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 3;
    }
    .nothingDefault {
      position: relative;
      top: 24vh;
    }
		.ivu-tabs-nav-scroll {
			display: flex;
			justify-content: center;
			height: 46px;
			line-height: 45px;
			.ivu-tabs-nav {
				height: 100%;
			}
			.ivu-tabs-tab {
				line-height: 2;
				font-size: 16px;
				&:hover {
					color: #333;
				}
			}
			.ivu-tabs-tab-active {
				color: #333;
			}
		}
    .list {
      padding: 8px 0;
      background: #fff;
    }
    .mint-loadmore {
      padding-bottom: 50px;
      overflow: initial;
    }
    .noFixed {
      height: 46px;
      display: none;
    }
    .fixed {
      height: 46px;
      display: block;
    }
	}
</style>

<style lang="scss" module>
  .diggAvatar {
    width: 100%;
    border-radius: 50%;
  }
</style>
