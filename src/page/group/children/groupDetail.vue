<template>
    <div class="group-detail">
        <div class="main" :style="translate3d">
            <head-top :go-back='goBack' :append='true' :transparent='top_tranparent'>
                <div slot='append'>
                    <v-icon type='base-search' @click.native='to(`/group/search`)'></v-icon>
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
                    <group-feed-item v-for='feed in feeds' v-if='feed.id' :key='`group-feed-${groupID}-${feed.id}`' :feed='feed' />
                </div>
            </div>
            <!-- base info END -->
            <div class="group-detail-post-btn" @click='beforeToPost'>
                <v-icon type='foot-plus'></v-icon>
            </div>
        </div>
        <!-- 侧滑菜单 -->
        <div class="menu-wrap" :class='{ menuOpen }' @click='closeMenu'>
            <div class="menu-main" @click.stop='menuMainClick($event)'>
                <div class="menu">
                    <div class="menu-item">
                        更多操作
                    </div>
                    <div class="menu-item">
                        <v-icon class='menu-item-prepend' type='group-member'></v-icon>
                        <div class="menu-item-title">成员</div>
                        <div class="menu-item-tips">{{ group.users_count }}</div>
                        <v-icon class='menu-item-append' type='base-arrow-r'></v-icon>
                    </div>
                    <div class="menu-item">
                        <v-icon class='menu-item-prepend' type='group-info'></v-icon>
                        <div class="menu-item-title">详细信息</div>
                        <v-icon class='menu-item-append' type='base-arrow-r'></v-icon>
                    </div>
                    <div class="menu-item">
                        <v-icon class='menu-item-prepend' type='group-income'></v-icon>
                        <div class="menu-item-title">圈子收益</div>
                        <v-icon class='menu-item-append' type='base-arrow-r'></v-icon>
                    </div>
                    <div class="menu-item">
                        <v-icon class='menu-item-prepend' type='group-permissions'></v-icon>
                        <div class="menu-item-title">发帖权限</div>
                        <v-icon class='menu-item-append' type='base-arrow-r'></v-icon>
                    </div>
                    <div class="menu-item">
                        <v-icon class='menu-item-prepend' type='group-report'></v-icon>
                        <div class="menu-item-title">举报管理</div>
                        <v-icon class='menu-item-append' type='base-arrow-r'></v-icon>
                    </div>
                    <a class="menu-exit-group" @click='exitGroup'>退出圈子</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop';
import { GroupFeedItem } from '@/components/feed/feedItem';
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
        GroupFeedItem
    },
    data() {
        return {
            oldID: 0,
            group: {},
            feeds: [],
            filterTypes,
            redirect: '',
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
        },
    },
    methods: {
        to(path) {
            if(path) {
                this.$router.push({ path });
            }
        },
        goBack() {
            this.to(this.redirect);
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
                this.goBack();
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
                this.getGroupDetail();
            }).catch(err => {
                const { response: { data = { message: '申请失败 可能是已经申请过了' } } = {} } = err;
                this.$Message.error(data);
            })
        },

        exitGroup() {
            // DELETE /groups/:group/exit
            this.$http.delete(`/plus-group/groups/${this.groupID}/exit`).then(({ data }) => {
                this.$Message.success('退出成功');
                this.goBack();
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
        },

        beforeToPost() {
            if(!this.isMember) {
                return this.$Modal.info({
                    content: `你需要先加入"${this.group.name}"才能发布圈内帖子`,
                    cancelText: `知道了`
                });
            }
            if(true) {
                this.to(`/group/post`);
            }
        }
    },
    /**
     * 判断  是否刷新 页面数据
     * @author jsonleex <jsonlseex@163.com>
     */
    activated() {
        this.groupID !== this.oldID ? this.getGroupDetail() : '';
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const path = from.fullPath;
            vm.oldID = to.params.groupID;
            vm.redirect = path && path !== '/' ? path : '/group';
        });
    },
    created() {
        this.getGroupDetail();
    }
}
</script>
<style lang='less' src='./groupDetail.less'></style>