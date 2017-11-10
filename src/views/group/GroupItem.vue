<template>
<div class="group-item">
  <router-link :to="`/group/${id}`"
               class="ivu-row">
    <Col class="group-avatar"
         :span="4">
    <img :src="avatar">
    </Col>
    <Col class="group-info"
         :span="14">
    <p>{{group.title}}</p>
    <p>分享 <span class="num">{{group.posts_count}}</span> 订阅数 <span class="num">{{group.members_count}}</span></p>
    </Col>
    <Col class="group-action"
         :span="6"
         style="flex: 0 1 auto">
    <div class="action-btn"
         :class="{primary: !is_member}"
         @click.stop.prevent="joinGroup">
      <Icon :type="iconType.type"></Icon>
      <span>{{iconType.txt}}</span>
    </div>
    </Col>
  </router-link>
</div>

</template>

<script>
import { addAccessToken, createAPI } from '../../utils/request';
import { NOTICE } from '../../stores/types';
export default {
  name: 'group-item',
  props: {
    group: {
      type: Object,
      required: true
    },
    updateData: {
      type: Function,
      required: true
    }
  },

  watch: {
    group(val) {
      this.init()
    }
  },
  data() {
    return ({
      loading: false,
      id: this.group.id,
      title: this.group.title,
      avatar: this.group.avatar,
      is_member: this.group.is_member,
      posts_count: this.group.posts_count,
      members_count: this.group.members_count
    })
  },
  computed: {
    iconType() {
      return this.loading ? {
        type: `load-b`,
        txt: `请求中`
      } :
        (this.is_member ? {
          type: `checkmark`,
          txt: `已加入`
        } : {
          type: `plus`,
          txt: `加入`
        })
    }
  },
  methods: {
    joinGroup() {
      if (this.loading) {
        return false
      }
      this.loading = true
      const method = this.is_member ? 'DELETE' : 'POST',
        is_member = this.is_member
      this.is_member = !is_member
      addAccessToken()({
        method,
        url: createAPI(`groups/${this.id}/join`),
        validateStatus: status => (status === 201 || status === 204)
      }).then(({status, data = {
            message: '操作成功！'
          }}) => {
        this.loading = false
      }).catch(({response: {data: {message}}}) => {
        this.loading = false
        this.is_member = is_member
        this.updateData()
        this.$store.dispatch(NOTICE, cb => {
          cb({
            show: true,
            time: 1500,
            status: false,
            text: message
          })
        })
      })
    },
    init() {
      const {id, title, avatar, is_member, posts_count, members_count} = this.$props.group

      this.id = id
      this.title = title
      this.posts_count = posts_count || 0
      this.members_count = members_count || 0
      this.avatar = avatar ? `/api/v2/files/${avatar.id}` : null
      this.is_member = is_member === undefined ? true : !!(is_member)
    }
  },
  created() {
    this.init()
  }
}

</script>

<style lang="less">
@keyframes loadingB {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.group-item .ivu-row {
  padding: 15px 10px;
  height: 80px;
  background-color: #fff;
  border-bottom: 1px solid #dedede;
  [class*="load-"] {
    animation: loadingB 1.4s infinite linear;
  }
}

.group-info {
  p {
    margin: 10px;
    line-height: 1;
    font-size: 14px;
    color: #999;
    &:first-child {
      font-size: 16px;
      color: #333;
    }
    .num {
      color: #59b6d7;
    }
  }
}

.group-avatar {
  width: 60px;
  height: 60px;
  line-height: 60px;
  background-color: #ededed;
  text-align: center;
  >img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.group-action {
  .action-btn {
    display: flex;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 63px;
    height: 25px;
    line-height: 23px;
    font-size: 12px;
    text-align: center;
    color: #ccc;
    align-items: center;
    justify-content: center;
    &.primary {
      color: #59b6d7;
      border-color: #59b6d7;
    }
    i {
      font-size: 12px;
      color: inherit;
      font-weight: 100;
      margin-right: 3px;
    }
  }
}
</style>
