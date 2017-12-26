<template>
    <div class="feed-tool-item feed-like" @click='diggFeed'>
        <DiggIcon v-if="isDigg2" width="21" height="21" color="#f4504d" />
        <UnDiggIcon v-else width="21" height="21" color="#999" />
        <span class="count feed-like-count">{{ count2 }}</span>
    </div>
</template>
<script>
import DiggIcon from '../../../icons/Digg';
import UnDiggIcon from '../../../icons/UnDigg';

export default {
    name: 'feed-like',
    components: {
        DiggIcon,
        UnDiggIcon
    },
    props: {
        feedID: {
            required: true
        },
        count: {
            required: true
        },
        isDigg: {
            type: Boolean,
            required: true,
            default: false
        },
        upvote: {
            type: Function,
            required: true
        }
    },
    data() {
        return({
            count2: 0,
            isDigg2: false,
        });
    },
    beforeMount(){
        this.count2 = this.count;
        this.isDigg2 = this.isDigg;
    },
    methods: {
        diggFeed() {
            const count = this.count2,
            isDigg = this.isDigg2;
            try {
                if(this.isDigg2) {
                    this.count2--;
                    this.upvote('unlike');
                } else {
                    this.count2++
                    this.upvote('like');
                }
                this.isDigg2 = !this.isDigg2;
            } catch(e) {
                this.count2 = count;
                this.isDigg2 = isDigg;
                this.$Message.error('点赞失败');
            }

        }
    }
}
</script>