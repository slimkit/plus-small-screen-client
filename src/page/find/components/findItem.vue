<template>
    <div :id='`find-usr-${user.id}`' class="find-item" @click='toUserHome'>
        <v-avatar sex='user.sex' :src='user.avatar' class='find-item-avatar'>
            {{ user.name.slice(0, 1) }}
        </v-avatar>
        <div class="find-item-info">
            <p class="find-item-name ellipsis">{{ user.name }}</p>
            <p class="find-item-bio ellipsis">{{ user.bio }}</p>
        </div>
        <template>
            <v-icon :type='`base-${isFollow}`' class='find-item-follow-icon' @click.native.stop='followUser'></v-icon>
        </template>
    </div>
</template>
<script>
export default {
    name: 'findItem',
    props: ['user'],
    data() {
        return {
            loading: false
        }
    },
    computed: {
        isFollow() {
            const { follower = false, following = false } = this.user;
            return follower && following ?
                'eachFollow' : (follower ? 'follow' : 'unFollow');
        }
    },
    methods: {
        toUserHome() {
            this.$router.push(`/user/${this.user.id}`);
        },
        followUser(e) {
            if(this.loading) return false;
            this.loading = true;
            this.$store.dispatch('FOLLOW_USER', {
                id: this.user.id,
                status: this.isFollow
            }).then(({ status, follower }) => {
                this.loading = false;
                this.user.follower = follower;
            }).catch((err) => {
                const { response: { data = { message: '操作失败' } } = {} } = err;

                this.loading = false;
                this.$Message.error(data);
            });
        }
    }
}
</script>
<style lang='less'>
.find-item {
    padding: 0 20px;
    background-color: #fff;
    height: 135px;
    border-bottom: 1px solid #ededed;
    /*no*/
    display: flex;
    align-items: center;
    font-size: 28px;
    color: #999;
    &-avatar, &-follow-icon {
        flex: 0 0 auto;
    }
    &-info {
        margin-left: 30px;
        margin-right: 30px;
        width: calc(~'100% -' 60+76+35px);
        flex: 1 1 auto;
    }
    &-name {
        font-size: 32px;
        color: #333;
    }
    &-follow-icon {
        width: 35px;
        height: 35px;
    }
}
</style>