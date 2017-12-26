<template>
    <div class="user-home">
        <head-top :go-back='goBack' :append='true' :title='user.name' :transparent='top_tranparent'>
            <div class="user-home-share" slot='append'>
                <v-icon type='base-share'></v-icon>
            </div>
        </head-top>
        <!-- user info  -->
        <div class="user-home-info">
            <div class="user-home-info-box">
                <div class="user-home-bgcover" :style='bg_cover'>
                    <v-avatar sex='user.sex' :badeg='verified.icon' :src='user.avatar' class='user-home-avatar' size='large'></v-avatar>
                    <h2 class='user-home-name'>{{ user.name }}</h2>
                    <div class="user-home-number">
                        <p>粉丝数
                            <span>{{ followers_count }}</span>
                        </p>
                        <p>关注
                            <span>{{ followings_count }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="user-home-info-box txt">
                <p class="user-home-verified" v-if='verified'>认证:
                    <span>{{ verified.description }}</span>
                </p>
                <p class="user-home-location" v-if='location'>地址:
                    <span>{{ location }}</span>
                </p>
                <p class="user-home-bio" v-if='bio'>简介:
                    <span>{{ bio }}</span>
                </p>
                <div class="user-home-tag">
                    <div class="user-home-tag-item" v-for='tag in tags' v-if='tag.id' :key='`user-tag-${tag.id}`'>
                        {{ tag.name }}
                    </div>
                </div>
            </div>
        </div>
        <!-- user info END -->
        <!-- user feeds -->
        <div class="user-home-feeds">
            <div class="user-home-feeds-head">
                <span class="user-home-feeds-length">{{ feeds_length }}个动态</span>
            </div>
            <div class="user-home-feeds-list">
                <feed-item v-for='feed in feeds' :no_user='true' v-if='feed.id' :key='`user-feed-${feed.id}`' :feed='feed'></feed-item>
            </div>
        </div>
        <!-- user feeds END -->
        <!-- user action -->
        <!-- user action -->
    </div>
</template>
<script>
import { formatNum } from '@/util/';
import HeadTop from '@/components/HeadTop';
import { FeedItem } from '@/components/feed/feedItem';
export default {
    name: 'userHome',
    components: {
        HeadTop,
        FeedItem
    },
    data() {
        return {
            user: {
                ...this.$store.getters.getUserById(this.$route.params.Uid),
                tags: [],
                feeds: [],
            },
            scrollTop: 0
        }
    },
    computed: {
        Uid() {
            return this.$route.params.Uid;
        },
        followers_count() {
            return formatNum((this.user.extra || {}).followers_count || 0);
        },
        followings_count() {
            return formatNum((this.user.extra || {}).followings_count || 0)
        },
        bg_cover() {
            const bg = this.user.bg;
            return bg ? {
                'background-image': `url(${bg})`
            } : {};
        },
        verified() {
            const verified = this.user.verified;
            const { description, icon } = verified || {};
            return verified ? {
                description,
                icon
            } : false;
        },
        location() {
            return this.user.location || false;
        },
        bio() {
            return this.user.bio || '这家伙很懒. 什么也没留下';
        },
        feeds_length() {
            return(this.user.extra || {}).feeds_count || 0
        },
        tags() {
            return this.user.tags;
        },
        feeds() {
            return this.user.feeds;
        },

        top_tranparent() {
            return !(this.scrollTop > 110);
        }
    },
    methods: {
        /**
         * 触发一个刷新 同步用户数据
         *     同时更新 vuex 中的数据
         * @author jsonleex <jsonlseex@163.com>
         */
        updateUserData(cb) {
            this.$http.get(`/users/${this.Uid}`).then(({ data = {} }) => {
                this.user = Object.assign({}, this.user, data);
                cb && cb();
            }).catch(err => {
                const { response: { data = { message: '获取用户数据失败' } } = {} } = err;
                this.$Message.error(data);
            });
        },

        getUserTags(cb) {
            this.$http.get(`/users/${this.Uid}/tags`).then(({ data = [] }) => {
                this.user.tags = [...data];
                cb && cb();
            });
        },

        getUserFeeds(cb) {
            this.$http.get('/feeds', {
                params: { type: 'users', user: this.Uid }
            }).then(({ data = [] } = {}) => {
                this.user = Object.assign({}, this.user, { feeds: data['feeds'] });
                cb && cb();
            });
        },

        init() {
            this.updateUserData(this.getUserFeeds(this.getUserTags(() => {
                this.$store.commit('SAVE_USER', this.user);
            })));
        },

        goBack() {
            this.$router.go(-1);
        }
    },

    activated() {
        if(this.user.id !== this.Uid) {
            this.init();
        }
    },

    mounted() {
        this.init();
        this.$el.addEventListener('scroll', (e) => {
            this.scrollTop = this.$el.scrollTop;
        });
    }
}
</script>
<style lang='less'>
@user-home-prefix: user-home;
.@{user-home-prefix} {
    height: 100vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    &-info {
        padding-top: 0;
    }
    &-info-box.txt {
        background-color: #fff;
        padding: 30px 20px;
        p {
            font-size: 26px;
            color: #999;
            margin-bottom: 18px;
            &.@{user-home-prefix}-verified {
                color: #ff9400;
            }
            span {
                margin-left: 5px;
                /*no*/
            }
        }
    }
    &-bgcover {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 375px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('../../images/user_home_default_cover.png');
    }

    &-avatar {
        margin-bottom: 15px;
    }

    &-name {
        font-size: 32px;
        color: #fff;
        margin-bottom: 20px;
    }

    &-number {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        font-size: 20px;
        color: #fff;
        p+p {
            margin-left: 50px;
        }
        span {
            margin-left: 12px;
        }
    }
    &-tag {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-left: -10px;
        margin-bottom: -10px;
        &-item {
            padding: 0 15px;
            height: 36px;
            line-height: 36px;
            font-size: 20px;
            color: #666;
            text-align: center;
            border-radius: 18px;
            background-color: rgba(102, 102, 102, .1);
            margin-bottom: 10px;
            margin-left: 10px;
        }
    }
    &-feeds {
        &-head {
            padding: 0 20px;
            height: 75px;
            line-height: 73px;
            background-color: #f4f5f5;
            font-size: 26px;
        }
    }
}
</style>