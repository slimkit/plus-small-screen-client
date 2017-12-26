<template>
    <div>
        <find-item v-for='user in formatData' v-if='user.id' :user='user' :key='`find-nearby-${user.id}`'></find-item>
    </div>
</template>
<script>
import findItem from '@/page/find/components/findItem';
export default {
    name: 'findNearby',
    components: {
        findItem
    },
    data() {
        return {
            dataList: [],
            userIDs: [],
            formatData: []
        }
    },
    computed: {
        location() {
            return this.$store.state.LOCATION;
        },
        latitude() {
            return this.$route.query.lat || this.location.lat || 0;
        },
        longitude() {
            return this.$route.query.lng || this.location.lng || 0;
        },
    },
    watch: {
        location() {
            this.getUsers();
        },
        userIDs() {
            this.formatDataList();
        }
    },
    methods: {
        formatDataList() {
            this.formatData = this.userIDs.map((id) => {

                let user = this.$store.getters.getUserById(id);

                if(!user.id) {
                    this.$http.get(`/users/${id}`).then(({ data = {} }) => {
                        this.$store.commit('SAVE_USER', data);
                    }).catch(err => {
                        console.log(err);
                        const { response: { status } = {} } = err;
                        if(status === 404) {
                            console.error('该用户不存在, 或已删除 #ID:' + id);
                        }
                    });
                }
                return user;
            });
        },
        getUsers() {
            this.$http.get('around-amap', {
                params: {
                    limit: 10,
                    offset: this.formatData.length,
                    latitude: this.latitude,
                    longitude: this.longitude
                }
            }).then(({ data = [] }) => {
                this.userIDs = data.map(item => {
                    return item.user_id;
                });
            });
        }
    },

    created() {
        this.getUsers();
    }
}
</script>
<style lang='less'></style>