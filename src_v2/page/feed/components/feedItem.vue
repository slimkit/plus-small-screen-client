<template>
    <div class="feed_item" @click='viewFeed'>
        <v-avatar sex='user.sex' :src='user.avatar' class='feed_item_avatar'>
            {{ user.name.slice(0, 1) }}
        </v-avatar>
        <div class="feed_item_content">
            <div class="feed_item_content_info">
                <span>{{ user.name }}</span>
                <div>
                    <i class="feed_item_content_info_pinned_icon" v-if='is_pinned'>置顶</i>
                    <template>
                        <timeago class="feed_item_content_info_time" :since="time" :auto-update="60" />
                    </template>
                </div>
            </div>
            <template v-if='text.length > 0 '>
                <div class="feed_item_content_text">
                    <template v-if='is_pay && text.length > 50'>
                        <span>{{ text.slice(0, 50) }}</span>
                        <span class="blur">{{ '魑魅魍魉魑魅魍魉魑魅' }}</span>
                    </template>
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template v-if='images.length > 0'>
                <feed-images :imgs='images' @viewPic='viewPic' class='feed_item_content_imgs'></feed-images>
            </template>
        </div>
        <div class="feed_item_foot">
            <feedTool :has_like='has_like' :like_count='like_count' :comment_count='comment_count'></feedTool>
        </div>
    </div>
</template>
<script>
import feedTool from './feedTool';
import feedImages from './feedImages';

export default {
    name: 'feedItem',
    components: {
        feedTool,
        feedImages,
    },
    props: {
        feed: {
            type: Object,
            required: true
        },
        is_pinned: {
            type: Boolean,
            default: true
        },
        is_pay: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        user() {
            return this.feed.user;
        },
        time() {
            return this.feed.created_at.replace(/-/g, '/');
        },
        text() {
            let r = (this.feed.feed_content || '').slice(0, 59);
            return r.length < 59 ? r : r + '...';
        },
        images() {
            return this.feed.images || [];
        },
        has_like() {
            return this.feed.has_like || false;
        },
        like_count() {
            return this.feed.like_count || 0;
        },
        comment_count() {
            return this.feed.feed_comment_count || 0
        }
    },
    methods: {
        to(path) {
            if(path) {
                this.$router.push({ path });
            }
        },
        viewFeed() {
            this.to(`/feed-detail/${this.feed.id}`);
        },
        /**
         * 查看图片
         *     @author jsonleex <jsonlseex@163.com>
         */
        viewPic(id) {
            console.log('查看图片', id);
        }
    }
}
</script>
<style lang='less' socped>
.feed_item {
    /*display: flex;*/
    background: #fff;
    padding: 30px 20px;
    font-size: 30px;
    +.feed_item {
        margin-top: 10px;
    }
    &_avatar {
        /*flex: 0 0 auto;*/
        float: left;
    }
    &_content {
        /*flex: 1 1 auto;*/
        margin-left: 20+38*2px;
        &_info {
            display: flex;
            justify-content: space-between;
            font-size: 26px;
            color: #333;
            &_time {
                margin-left: 10px;
                font-size: 24px;
                color: #ccc
            }
            &_pinned_icon {
                display: inline-table;
                font-size: 22px;
                color: #4bb893;
                width: 62px;
                height: 30px;
                text-align: center;
                border: 1px solid currentColor;
                /*no*/
            }
        }
        &_text {
            margin-top: 25px;
            width: 100%;
            font-size: 30px;
            line-height: 1.4;
            overflow: hidden;
            .blur {
                color: transparent;
                text-shadow: 0 0 10px #999;
            }
        }
        &_imgs {
            margin-top: 25px;
        }
    }
    &_foot {
        margin: 20px -20px 0;
        padding: 0 20px 0 116px;
        height: 90px;
        border-top: 1px solid #ededed; /*no*/
    }
    >:last-child {
        margin-bottom: -30px;
    }
}
</style>