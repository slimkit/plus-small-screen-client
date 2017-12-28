<template>
    <div class="group-all">
        <head-top :go-back='cancel' :title='$route.meta.title' :append='true'>
            <div slot='append'>
                <v-icon type='base-search' @click.native='to(`/group/search`)'></v-icon>
                <v-icon type='group-add' @click.native='createdGroup'></v-icon>
            </div>
        </head-top>
        <div></div>
        <div class="group-all-category" :class='{"open": switchStatus}'>
            <div class="group-all-category-list">
                <div :class="['group-all-category-list-item', { active: cur_cate === 0}]" id='group-categorys-0' @click='setlectCurCate(0)'>全部</div>
                <div :class="['group-all-category-list-item', { active: item.id === cur_cate}]" @click='setlectCurCate(item.id)' v-for='item in categorys' :key='`group-categorys-${item.id}`' :id='`group-categorys-${item.id}`'>{{ item.name }}</div>
            </div>
            <div class="group-all-category-switch" @click='switchStatus = true'>
                <v-icon type='base-arrow-r'></v-icon>
            </div>
        </div>
        <div class="group-all-content">
            <groupItem v-for='group in groups' v-if='group.id' :group='group' :key='`group-${group.id}`'></groupItem>
        </div>
    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop'
import groupItem from '../components/groupListItem'
export default {
  name: 'groupAll',
  components: {
    HeadTop,
    groupItem
  },
  data () {
    return {
      cur_cate: 0,
      groups: [],
      switchStatus: false
    }
  },
  computed: {
    categorys () {
      return this.$store.state.GROUPTYPES
    }
  },
  watch: {
    cur_cate () {
      this.getGroupByCate()
    }
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    to (path) {
      path = typeof path === 'string' ? { path } : path
      if (path) {
        this.$router.push(path)
      }
    },
    createdGroup () {
      this.$router.push('/group/add')
      // this.$Modal.info({
      //     content: '只有认证通过的用户才可以创建圈子, 是否去认证?',
      //     okText: '去认证',
      //     showOk: true,
      //     onOk() {
      //         console.log('去认证');
      //     }
      // })
    },

    setlectCurCate (id) {
      this.switchStatus = false
      this.cur_cate = id
      this.$nextTick(() => {
        document.getElementById(`group-categorys-${id}`).scrollIntoViewIfNeeded()
      })
    },

    getGroupByCate () {
      this.$http.get(`/plus-group/groups?category_id=${this.cur_cate}`).then(({ data }) => {
        this.groups = data
      })
    }
  },
  created () {
    this.getGroupByCate()
  }
}
</script>
<style lang='less' src='./groupAll.less'></style>