<template>
    <div>
        <div v-show='loading' class="full">
            <full-spin></full-spin>
        </div>
        <template v-if='noData'>
            no data
        </template>
        <template>
            <find-item v-for='user in user_list' v-if='user.id' :user='user' :key='`find-usr-${user.id}`'></find-item>
        </template>
    </div>
</template>
<script>
import findItem from '../components/findItem';
export default {
  name: 'findContent',
  components: {
    findItem
  },
  data() {
    return {
      user_list: [],
      loading: true
    };
  },

  computed: {
    type() {
      return this.$route.meta.type;
    },
    noData() {
      return this.user_list.length === 0 && !this.loading;
    }
  },

  /**
   * 判断是否刷新数据
   * @author jsonleex <jsonlseex@163.com>
   * @param  {Object}                 to
   * @param  {Object}                 from
   * @param  {Function}               next
   */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.type !== from.meta.type) {
        vm.getUsers();
      }
    });
  },
  methods: {
    getUsers() {
      this.loading = true;
      this.$store
        .dispatch('GET_USER_DATA', {
          type: this.type,
          limt: 15
        })
        .then(({ data }) => {
          this.loading = false;
          if (data && data.length > 0) {
            this.user_list = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang='less'>
.full {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
  z-index: 99;
}
</style>
