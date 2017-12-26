<template>
    <div>
        <head-top :go-back='cancel' :title='`我加入的`'></head-top>
        <div>
            <group-item v-for='group in myGroups' :key='`group-${group.id}`' :group='group' :role='true'></group-item>
        </div>
    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop'
import groupItem from '../components/groupListItem'
export default {
  name: 'joinedGroup',
  components: {
    HeadTop,
    groupItem
  },
  data () {
    return {
      myGroups: []
    }
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    getMyGroups () {
      this.$http.get('/plus-group/user-groups').then(({ data = [] }) => {
        if (data) {
          this.myGroups = [...data]
        }
      })
    }
  },
  created () {
    this.getMyGroups()
  }
}
</script>
<style lang='less'>
</style>