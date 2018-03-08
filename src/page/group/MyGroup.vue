<template>
  <div class="profile-group">
    <head-top :go-back='cancel'>
      <div class="head-top-tabs-nav" slot='nav'>
        <router-link
        class='head-top-tabs-nav-item' 
        to='/own/groups'>圈子</router-link>
        <router-link
        class='head-top-tabs-nav-item'
        to='/own/posts'>帖子</router-link>
      </div>
    </head-top>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "my-group",
  methods: {
    cancel() {
      this.$router.push("/profile");
    }
  }
};
</script>
<style lang='less'>
@profile-group-prefix: profile-group;
.@{profile-group-prefix} {
  &-content {
    padding-top: 180px;
  }
}
</style>
