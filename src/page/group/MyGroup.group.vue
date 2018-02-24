<template>
  <nav-tabs 
  :fixed='true'
  :navs='navs'
  :value='activeTab'></nav-tabs>
</template>
<script>
export default {
  name: 'my-group-groups',
  data() {
    return {
      navs: [
        {
          path: '/own/groups/joined',
          title: '我加入的'
        },
        {
          path: '/own/groups/audit',
          title: '待审核的'
        }
      ]
    };
  },
  computed: {
    activeTab: {
      get() {
        return this.$route.path;
      },
      set(val) {
        this.$router.push(val);
      }
    }
  }
};
</script>
