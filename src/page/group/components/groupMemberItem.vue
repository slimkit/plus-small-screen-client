<template>
  <div class="group-member-item" v-if='user.id'>
    <div class="group-member-item-info">
      <v-avatar :src='user.avatar' :sex='user.sex'></v-avatar>
      <span class="group-member-name">{{user.name}}</span>
    </div>
    <v-icon type='feed-more' color='#b3b3b3'>
      
    </v-icon>
  </div>
</template>
<script>
export default {
  name: 'groupMemberItem',
  props: {
    user: Object,
    rule: {
      type: Number,
      required: true
    }
  },

  computed: {
    actions() {
      return []
    }
  }
}

</script>
<style lang='less'></style>
