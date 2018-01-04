<template>
  <div>
    <rank-users-component v-for="(rank, index) in ranks" :title="rank.title" :api="rank.api" :key="index" :listUrl="rank.listUrl" />
  </div>
</template>

<script>
  import RankUsersComponent from '../components/rankUsersComponent'
  const ranks = [
    {
      title: '全站粉丝排行榜',
      listUrl: '/rank/users/followers',
      api: '/ranks/followers'
    },
    {
      title: '财富达人排行榜',
      listUrl: '/rank/users/balance',
      api: '/ranks/balance'
    },
    {
      title: '收入达人排行榜',
      listUrl: '/rank/users/income',
      api: '/ranks/income'
    },
    {
      title: '社区签到排行榜',
      listUrl: '/rank/users/checkin',
      api: '/checkin-ranks'
    },
    {
      title: '社区专家排行榜',
      listUrl: '/rank/users/question-experts',
      api: '/question-ranks/experts'
    },
    {
      title: '问答达人排行榜',
      listUrl: '/rank/users/question-likes',
      api: '/question-ranks/likes'
    }
  ]

  export default {
    name: 'rankUsers',
    components: {
      RankUsersComponent
    },
    data () {
      return {
        ranks
      }
    }
  }
</script>