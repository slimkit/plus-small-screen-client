<template>
	<div class="relationship">
		<BackIcon width="21" height="21" @click.native="goTo(-1)" color="#999" style="z-index: 4; position: fixed; left: 12px; top: 12px;" />
		<Tabs v-model="type" @on-click="getData">
      <Tab-pane label="粉丝" name="followers">
        <mt-loadmore
          class="followers"
          v-if="!nothing && type === 'followers'"
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="topAllLoaded"
          ref="loadmorefollowers"
          :bottomDistance="70"
          @bottom-status-change="followersBottomStatusChange"
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
          class="followings"
          v-if="!nothing && type === 'followings'"
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="topAllLoaded"
          ref="loadmorefollowings"
          :bottomDistance="70"
          @bottom-status-change="followingsBottomStatusChange"
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
      max_id: 0,
      loading: false
		}),
		methods: {
			goTo,
			changeUrl,
      followersBottomStatusChange(status) {
        this.bottomStatus = status;
      },
      followingsBottomStatusChange(status) {
        this.bottomStatus = status;
      },
      // 加载更多
      loadBottom () {
        if(this.loading) return;
        this.loading = true;
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
          this[this.type] =  lodash.uniqBy([ ...this[this.type], ...data ], 'id');
          this.max_id = data[data.length -1].id;
          
          // loadmore重新洗牌
          if(this.$refs[`loadmore${this.type}`]) {
            setTimeout(() => {
              this.$refs[`loadmore${this.type}`].onBottomLoaded();
              this.loading = false;
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
          this[this.type] =  lodash.uniqBy([ ...this[this.type], ...data ], 'id');
        });

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
            let lists = this[type];
            let other = type === 'followers' ? this['followings'] : this['followers'];
            let user = this.followers[index];
            lists[index].follower = true;
            user.following = true;
            user.follower = true;
            other.unshift(user);
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
            let lists = this[type];
            let other = type === 'followers' ? this['followings'] : this['followers'];
            if(type == 'followings') {
              let index = lists.findIndex(value => {
                return value.id == user;
              })
              lists.splice(index, 1);
            } else {
              type === 'followers' ? lists[index].following = false : lists[index].follower = false;

              let index = other.findIndex(value => {
                return value.id == user;
              })
              if(index !== -1) {
                type === 'followers' ? other[index].following = false : other[index].follower = false;
              }
            }
            this[type] = lodash.cloneDeep(lists);
          }
        })
        .catch(error => {
          console.log(error);
        });
      },
      // 设置需要展示的数据
      getData (name) {
        this.loading = true;
        let uri = '';
        let key = '';
        this.max_id = 0;
        this.bottomAllLoaded = true;
        this.bottomStatus = 'pull';
        name = name || this.type;
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
            setTimeout(() => {
              this.loading = false;
            }, 800);
            return ;
          }
          if(!data.length < 15) {
            this.bottomAllLoaded = true;
          }
          this[name] = [];
          this[name] = [ ...data ];
          this.max_id = data[data.length -1].id;

          setTimeout(() => {
            this.loading = false;
          }, 800);
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
