<template>
  <div>
    <head-top v-if='head' :go-back='true' title='我加入的' />
    <load-more
    :onRefresh='onRefresh'
    :onLoadMore='onLoadMore'
    ref='loadmore'
    key='join'
    >
      <group-item 
      :group='group'
      v-for='group in list'
      :key='`group-${group.id}`'
      :role='true'
      :append='true'
      />
    </load-more>
  </div>
</template>
<script>
import groupItem from "./components/groupListItem";
export default {
  name: "my-groups-join-list",
  components: {
    groupItem
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    head() {
      return this.$route.meta.head;
    }
  },
  methods: {
    onRefresh() {
      this.$http
        .get("/plus-group/user-groups", {
          params: {
            limit: 15,
            type: "join"
          }
        })
        .then(({ data }) => {
          this.list = [...data];
          this.$refs.loadmore.topEnd(!(data.length < 15));
        });
    },
    onLoadMore() {
      this.$http
        .get("/plus-group/user-groups", {
          params: {
            limit: 15,
            type: "join",
            offset: this.list.length
          }
        })
        .then(({ data }) => {
          this.list = [...this.list, ...data];
          this.$refs.loadmore.bottomEnd(data.length < 15);
        });
    }
  }
};
</script>
