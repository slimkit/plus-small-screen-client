<template>
	<div class="relationship">
		<BackIcon width="21" height="21" @click.native="goTo(-1)" color="#999" style="z-index: 4; position: fixed; left: 12px; top: 12px;" />
		<Tabs v-model="type" @on-click="getData">
      <Tab-pane label="粉丝" name="followers">
        <mt-loadmore
          v-if="!nothing && type === 'followers'"
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="topAllLoaded"
          ref="loadmorefollowed"
          :bottomDistance="70"
          @bottom-status-change="bottomStatusChange"
        >
        	<Row :gutter="24" v-for="(user, index) in formateList" :key="index" class-name="list">
            <Col span="4" @click.native="changeUrl(`/users/feeds/${user.id}`)">
              <img :class="$style.diggAvatar" v-lazy="user.avatar" :alt="user.name" :title="user.name">
            </Col>
            <Col span="16">
              <h4 @click="changeUrl(`/users/feeds/${user.id}`)">{{ user.name }}</h4>
              <p>{{ user.bio }}</p>
            </Col>
            <Col span="4" class="header-end-col" v-if="currentUser == user_id">
              <UnFollowingIcon @click.native="doFollowing(user.id, index, 'followings')" v-if="!user.follower && currentUser != user.id" height="21" width="21" color="#999" />
              <FollowingIcon @click.native="doUnFollowing(user.id, index, 'followings')" v-if="!user.following && user.follower && currentUser != user.id" height="21" width="21" color="#59b6d7" />
              <EachFollowingIcon @click.native="doUnFollowing(user.id, index, 'followings')" v-if="user.following && user.follower && currentUser != user.id" height="21" width="21" color="#59b6d7" />
            </Col>
          </Row>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomAllLoaded">没有更多了</span>
            <section v-else>
              <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
              <span v-show="bottomStatus === 'loading'">加载中...</span>
              <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
            </section>
          </div>
        </mt-loadmore>
        <div class="nothingDefault"> 
          <img v-if="nothing" :src="nothing" />
        </div>
      </Tab-pane>
      <Tab-pane label="关注" name="followings" >
        <mt-loadmore
          v-if="!nothing && type === 'followings'"
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="topAllLoaded"
          ref="loadmorefollowing"
          :bottomDistance="70"
          @bottom-status-change="bottomStatusChange"
        >
          <Row :gutter="24" v-for="(user, index) in formateList" :key="index" class-name="list">
            <Col span="4" @click.native="changeUrl(`/users/feeds/${user.id}`)">
              <img :class="$style.diggAvatar" v-lazy="user.avatar" :alt="user.name" :title="user.name">
            </Col>
            <Col span="16">
              <h4 @click="changeUrl(`/users/feeds/${user.id}`)">{{ user.name }}</h4>
              <p>{{ user.bio }}</p>
            </Col>
            <Col span="4" class="header-end-col" v-if="currentUser == user_id">
              <UnFollowingIcon @click.native="doFollowing(user.id, index, 'followers')" v-if="!user.follower && currentUser != user.id" height="21" width="21" color="#999" />

              <FollowingIcon @click.native="doUnFollowing(user.id, index, 'followers')" v-if="!user.following && user.follower && currentUser != user.id" height="21" width="21" color="#59b6d7" />

              <EachFollowingIcon @click.native="doUnFollowing(user.id, index, 'followers')" v-if="user.following && user.follower && currentUser != user.id" height="21" width="21" color="#59b6d7" />

            </Col>
          </Row>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomAllLoaded">没有更多了</span>
            <section v-else>
              <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
              <span v-show="bottomStatus === 'loading' && !bottomAllLoaded">加载中...</span>
              <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
            </section>
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
  import { createAPI, createOldAPI, addAccessToken } from '../utils/request';
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
			followings: [],
			followers: [],
      dataList: [],
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
        console.log(status);
        this.bottomStatus = status;
      },
      // 加载更多
      loadBottom () {
        let uri = '';
        let key = '';
        let lists = [];
        this.bottomAllLoaded = true;
        if(this.type == 'followers') {
          uri = `users/${this.user_id}/followings?limit=15&after=${this.max_id}`;
          key = 'followeds';
        } else {
          uri = `users/${this.user_id}/followers?limit=15&after=${this.max_id}`
          key = 'follows';
        }
        addAccessToken().get(createAPI(uri), {}, {
          validateStatus: status => status === 200
        })
        .then( ({ data = [] }) => {
          if(!data.length > 0) {
            if(this.$refs[`loadmore${this.type}`]) {
              setTimeout(() => {
                this.$refs[`loadmore${this.type}`].onBottomLoaded();
              }, 800);
            }
            return;
          }
          this.dataList = this[this.type] =  [ ...this[this.type], ...data ];
          this.max_id = data[data.length -1].id;
          // loadmore重新洗牌
          if(this.$refs[`loadmore${this.type}`]) {
            setTimeout(() => {
              this.$refs[`loadmore${this.type}`].onBottomLoaded();
            }, 800);
          }
        });
      },

      loadTop () {
        let uri = '';
        let key = '';
        let lists = [];
        if(this.type == 'followers') {
          uri = `users/${this.user_id}\followers`;
          key = 'followers';
        } else {
          uri = `users/${this.user_id}/followings`;
          key = 'followings';
        }
        addAccessToken().get(createAPI(`${uri}?limit=15`), {}, {
          validateStatus: status => status === 200
        })
        .then( ({data = []}) => {
          // 去重
          this.dataList = this[this.type] = Array.from(new Set([ ...this[this.type], ...data ]));
        });

        // loadmore重新洗牌
        if(this.$refs[`loadmore${this.type}`]) {
          setTimeout(() => {
            this.$refs[`loadmore${this.type}`].onTopLoaded();
          }, 900);
        }
      },
      // 关注用户
      doFollowing (user, index, type) {
        followingUser(user)
        .then(status => {
          if(status) {
            let localUser = localEvent.getLocalItem(`user_${user}`);
            let localCurrentUser = localEvent.getLocalItem(`user_${this.currentUser}`);
            let lists = this[type];
            localUser.following = true;
            localEvent.setLocalItem(`user_${user}`, localUser);
            localCurrentUser.extra.followings_count += 1;
            localEvent.setLocalItem(`user_${this.currentUser}`, localCurrentUser);
            let index = this.followers.findIndex(value => {
              return user = value.id;
            });
            if(index !== -1) {
              let user = this.followers[index];
              user.following = true;
              lists.unshift(user);
            }
            this[type] = lodash.cloneDeep(lists);

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
        .then( status => {
          if(status) {
            let localUser = localEvent.getLocalItem(`user_${user}`);
            let localCurrentUser = localEvent.getLocalItem(`user_${this.currentUser}`);
            let lists = this[type];
            localUser.following = false;
            localCurrentUser.extra.followings_count -= 1;
            localEvent.setLocalItem(`user_${this.currentUser}`, localCurrentUser);
            localEvent.setLocalItem(`user_${user}`, localUser);
            if(type == 'followings') {
              let index = lists.findIndex(value => {
                return value.id = user;
              });
              if(index !== -1) {
                lists.splice(index, 1);
              }
            } else {
              lists[index].following = false;
            }
            this[type] = lodash.cloneDeep(lists);
            this.dataList = lodash.cloneDeep(dataList);
          }
          
        });
      },
      // 设置需要展示的数据
      getData (name) {
        let uri = '';
        let key = '';
        this.max_id = 0;
        this.bottomAllLoaded = true;
        this.bottomStatus = 'pull';
        name = name || this.type;
        console.log(name);
        if(name == 'followers') {
          uri = `users/${this.user_id}/followers`;
        } else {
          uri = `users/${this.user_id}/followings`;
        }
        addAccessToken().get(createAPI(uri), {}, {
          validateStatus: status => status === 200
        })
        .then( ({data = []}) => {
          if(!data.length > 0) {
            if(this.$refs[`loadmore${name}`]) {
              this.$refs[`loadmore${name}`].onTopLoaded();
            }
            return ;
          }
          if(!data.length < 15) {
            this.bottomAllLoaded = true;
          }
          this[name] = [];
          this[name] = [ ...data ];
          this.max_id = data[data.length -1].id;
          if(this.$refs[`loadmore${name}`]) {
            this.$refs[`loadmore${name}`].onTopLoaded();
            this.$refs[`loadmore${name}`].onBottomLoaded();
          }
        });
      }
		},
    computed: {
      nothing () {
        return lodash.keys(this.formateList).length > 0 ? 0 : defaultNoBody;
      },
      formateList() {
        let list = this[this.type].map(data => {
          data.bio = data.bio || '还没有简介';
          data.avatar = data.avatar || defaultAvatar;
          return data;
        });
        return list;
      }
    },
		created () {
			let status = this.$route.params.status;
			let user_id = this.$route.params.user_id;
			if(!user_id || !oneOf(['followers', 'followings'], status)) {
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

<style lang="less">
	.relationship {
    .ivu-tabs {
      .ivu-tabs-tabpane {
        min-height: calc(~'100vh - 46px');
        padding-top: 46px;
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
      overflow: visible;
    }
	}
</style>

<style lang="less" module>
  .diggAvatar {
    width: 100%;
    border-radius: 50%;
  }
</style>
