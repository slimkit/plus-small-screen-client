<template>
    <div class="group-detail">
        <div class="main" :style="translate3d">
            <head-top :go-back='goBack' :append='true' :transparent='top_tranparent'>
                <div slot='append'>
                    <v-icon type='base-search'></v-icon>
                    <v-icon type='base-share'></v-icon>
                    <v-icon type='feed-more' @click.native='openMenu'></v-icon>
                </div>
            </head-top>
            <!-- base info -->
            <div class="group-detail-info">
                <div class="group-detail-bgcover">
                    <div class="bg-blur" :style='bg_cover'></div>
                    <div class="group-detail-base">
                        <div class="group-detail-avatar">
                            <img :src="avatar">
                        </div>
                        <div class="group-detail-txt">
                            <h3>{{ group.name }}</h3>
                            <p>
                                <span>成员</span>
                                <span>{{ group.users_count }}</span>
                            </p>
                            <p>
                                <span>位置</span>
                                <span class="ellipsis">{{ '位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置位置' }}</span>
                            </p>
                        </div>
                        <div class="group-detail-action">
                            <a href="#" v-if='!isMember' class="group-detail-action-btn join" @click='joinGroup'>
                                <v-icon type='foot-plus'></v-icon>加入
                            </a>
                        </div>
                    </div>
                </div>
                <div class="group-detail-other">
                    <div class="group-detail-other-row">
                        <div class="group-detail-other-label">圈主</div>
                        <div class="group-detail-other-content">
                            <span>{{ founder.name }}</span>
                            <a href="#" class="contactFounder" @click.stop='contactFounder'>私聊</a>
                        </div>
                    </div>
                    <div class="group-detail-other-row" :class='{"flex-start": summary.length > 40}'>
                        <div class="group-detail-other-label">简介</div>
                        <div class="group-detail-other-content noborder summary">
                            <p>
                                <span>{{ summary }}</span>
                                <a href="#" v-if='summary.length > 40' @click.stop='showAllSummary = !showAllSummary'>{{ showAllSummary ? ' 收起': '查看更多' }}</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="group-detail-feeds">
                    <div class="group-detail-feeds-label">
                        <span>{{ group.posts_count }}个帖子</span>
                        <div class="group-detail-feeds-filter-wrap">
                            <div class="group-detail-feeds-filter" @click='showFilter'>
                                <span>{{ filterType.label }}</span>
                                <v-icon type='base-filter-list'></v-icon>
                            </div>
                            <div class="group-detail-feeds-filter-select" v-show='filterShow' @click='showFilter'>
                                <div class="group-detail-feeds-filter-option" :class='{active: option.type === filterType.type}' v-for='option in filterTypes' @click='selectFilterType(option)'>
                                    <span>{{ option.label }}</span>
                                    <v-icon type='base-checked'></v-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <feed-item v-for='feed in feeds' v-if='feed.id' :key='`group-feed-${groupID}-${feed.id}`' :feed='feed'></feed-item>
                </div>
            </div>
            <!-- base info END -->
        </div>
        <div class="menu-wrap" :class='{ menuOpen }' @click='closeMenu'>
            <div class="menu-main" @click.stop='menuMainClick($event)'>
                <div class="menu">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop';
import feedItem from '@/page/feed/feedItem';
const filterTypes = [{
    type: 'latest_post',
    label: '最新帖子'
}, {
    type: 'latest_reply',
    label: '最新回复'
}]
export default {
    name: 'groupDetail',
    components: {
        HeadTop,
        feedItem
    },
    data() {
        return {
            group: {},
            feeds: [],
            filterTypes,
            menuOpen: false,
            filterShow: false,
            showAllSummary: false,
            filterType: filterTypes[0],
        }
    },
    computed: {
        founder() {
            return(this.group.founder || {}).user || {};
        },
        bg_cover() {
            return {
                backgroundImage: `url(${this.avatar})`
            }
        },
        isMember() {
            return !!(this.group.joined);
        },
        groupID() {
            return this.$route.params.groupID;
        },
        top_tranparent() {
            return true;
        },
        translate3d() {
            return this.menuOpen ? {
                transform: `translate3d(-4.5rem, 0, 0)`
            } : {};
        },
        avatar() {
            return this.group.avatar;
        },
        summary() {
            const summary = this.group.summary || '';
            return summary.length > 40 && !(this.showAllSummary) ? summary.slice(0, 38) + '...' : summary;
        }
    },
    watch: {
        filterType() {
            this.getGroupFeeds();
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
            this.$destroy();
        },
        openMenu() {
            this.menuOpen = true;
        },
        closeMenu() {
            this.menuOpen = false;
        },
        menuMainClick(e) {},

        getGroupDetail() {
            if(this.groupID) {
                this.$http.get(`/plus-group/groups/${this.groupID}`).then(({ data = {} }) => {
                    this.group = data;
                });
            } else {
                this.$Message.error('发生了一些错误');
                this.$router.go(-1);
            }
        },

        getGroupFeeds() {
            // GET /groups/:group/posts
            this.$http.get(`/plus-group/groups/${this.groupID}/posts`, {
                params: {
                    type: this.filterType.type
                }
            }).then(({ data = [] }) => {
                this.feeds = data;
            })
        },
        joinGroup() {
            this.$http.put(`/plus-group/groups/${this.groupID}`).then(({ data }) => {
                this.$Message.success(data);
            }).catch(err => {
                const { response: { data = { message: '申请失败 可能是已经申请过了' } } = {} } = err;
                this.$Message.error(data);
            })
        },

        // 私聊圈主
        contactFounder() {
            console.log('私聊');
        },

        selectFilterType(type) {
            this.filterType = type;
        },

        showFilter() {
            this.filterShow = !this.filterShow;
        }
    },
    created() {
        this.getGroupDetail();
    }
}
</script>
<style lang='less'>
@group-detail-prefix: group-detail;
.@{group-detail-prefix} {
    &-info {
        padding-top: 0;
    }
    &-bgcover {
        overflow: hidden;
        height: 320px;
        position: relative;
        .bg-blur {
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-position: top center;
            background-size: cover;
            filter: blur(15px);
            transform: scale(1.1);
        }
    }
    &-base {
        padding: 30px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24px;
        color: #f4f5f5;
        position: absolute;
        bottom: 0;
    }
    &-avatar {
        flex: none;
        width: 134px;
        height: 134px;
        border: 2px solid #fff;
        /*no*/
        background-color: #ccc;
        img {
            overflow: hidden;
            width: 100%;
            object-fit: cover;
        }
    }
    &-txt {
        flex: 1 1 auto;
        margin: 0 20px;
        text-align: left;
        h3 {
            font-size: 32px;
            margin: 0 0 30px;
        }
        p {
            display: flex;
            flex-wrap: nowrap;
            max-width: 390px;
            span {
                &:first-child {
                    flex: none;
                    margin-left: 0;
                }
                max-width: 100%;
                margin-left: 15px;
            }
        }
    }
    &-action {
        flex: none;
        &-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            font-size: 26px;
            width: 126px;
            height: 50px;
            line-height: 46px;
            border: 1px solid #fff;
            /*no*/
            border-radius: 8px;
            color: #fff;
            .v-icon {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }
        }
    }

    &-other {
        padding: 30px 0 30px 20px;
        width: 100%;
        background-color: #fff;
        font-size: 28px;
        color: #333;
        &-row {
            display: flex;
            align-items: center;
            &+& {
                margin-top: 30px;
            }

            &.flex-start {
                align-items: flex-start;
            }
        }

        &-label {
            flex: none;
            color: #999;
        }
        &-content {
            flex: 1 1 auto;
            padding-right: 20px;
            height: 100%;
            min-height: 80px;
            line-height: 80px;
            margin-left: 25px;
            border-bottom: 1px solid #ededed;
            /*no*/
            &.noborder {
                border: none;
            }
            .contactFounder {
                display: block;
                float: right;
                width: 90px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                margin-top: 20px;
                border-radius: 20px;
                font-size: 24px;
                color: #fff;
                background-color: #fca308;
            }
        }
        .summary {
            line-height: normal;
            display: flex;
            align-items: center;
            a {
                color: #59b6d7;
            }
        }
    }

    &-feeds {
        &-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            height: 70px;
            background-color: #f4f5f5;
            font-size: 26px;
            color: #999;
        }

        &-filter {
            &-wrap {
                height: 100%;
                position: relative;
                line-height: 70px;
            }
            &-select {
                position: absolute;
                bottom: 0;
                right: 0;
                background-color: #fff;
                transform: translateY(100%);
                border-radius: 8px;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
            }
            &-option {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                width: 200px;
                height: 150/2px;
                &+& {
                    border-top: 1px solid #ededed;
                }
                .v-icon {
                    visibility: hidden;
                    width: 20px;
                    height: 20px;
                }
                &.active {
                    color: #666;
                    .v-icon {
                        visibility: visible;
                    }
                }
            }
            display: flex;
            align-items: center;
            .v-icon {
                margin-left: 15px;
                width: 36px;
                height: 30px;
            }
        }
    }

    .main {
        transition: transform .3s;
    }

    .menu {
        &-main {
            float: right;
            width: 450px;
            height: 100%;
            background-color: #363845;
        }
        &-wrap {
            transition: transform .18s;
            transform: translate3d(100%, 0, 0);
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            &.menuOpen {
                transform: translate3d(0, 0, 0);
            }
        }
        padding: 40px;
    }
}
</style>