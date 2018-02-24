<template>
  <nav-tabs
  :fixed='true'
  :navs='navs' 
  :value='activeTab'></nav-tabs>
</template>
<script>
export default {
  name: 'my-group-posts',
  data() {
    return {
      navs: [
        {
          path: '/own/posts/1',
          title: '我发布的'
        },
        {
          path: '/own/posts/2',
          title: '已置顶的'
        },
        {
          path: '/own/posts/3',
          title: '置顶待审核'
        }
      ]
    };
  },
  computed: {
    activeTab() {
      return this.$route.path;
    }
  }
};
</script>
