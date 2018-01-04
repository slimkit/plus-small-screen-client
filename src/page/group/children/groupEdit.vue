<template>
  <div>
    <head-top :go-back='cancel' :title='role === "member" ? "圈子详情" : "修改资料"' :append='role !== "member"'>
      <button slot='append' class="add_group_btn" :disabled="disabled" @click='addGroup'>修改</button>
    </head-top>
    <div class="form-group">
      <!-- 头像 -->
      <div class="form-row header-upload" @click='chooseImg'>
        <input type="file" ref='uploadFile' @change='getImg'>
        <div class="group-header">
          <img :src="header" v-if='header'>
        </div>
        <span>圈子封面</span>
        <v-icon type='base-arrow-r'></v-icon>
      </div>
    </div>
    <div class="form-group">
      <div class="form-row">
        <label for="name">圈名</label>
        <input class="input" :readonly="role === 'member'" type="text" v-model='name' placeholder="输入圈名, 20字以内" maxlength="20" id="name">
      </div>
      <div class="form-row">
        <label>分类</label>
        <div :class="['input', 'ccc', { c333: category.id}]" @click='toChoose("group/add/category")'>
          {{ (category || {}).name || '选择圈子类别' }}
          <v-icon type='base-arrow-r'></v-icon>
        </div>
      </div>
      <div class="form-row">
        <label>标签</label>
        <div :class="['input', 'ccc', { c333: tagsLen > 0}]" @click='toChoose("tags?redirect=-1")'>
          <template v-if='tagsLen > 0'>
            <div class="tags-list">
              <div class="tags-item" v-for='tag in tags' v-if='tag.id' :key='`group-tag-${tag.id}`'>{{ tag.name }}</div>
            </div>
          </template>
          <template v-else>
            最多可选5个标签
          </template>
          <v-icon type='base-arrow-r'></v-icon>
        </div>
      </div>
      <!-- # todo -->
      <div class="form-row">
        <label>位置</label>
        <div :class="['input', 'ccc', { c333: location_txt}]" @click='toChoose("location")'>
          {{ location_txt || '设置圈子地理位置' }}
          <v-icon type='base-arrow-r'></v-icon>
        </div>
      </div>
      <div class="form-row">
        <label for="summary">简介</label>
        <div class="input auto">
          <textarea v-txtautosize v-model='summary' :readonly="role === 'member'" placeholder="编辑简介" maxlength="50" />
        </div>
      </div>
    </div>
    <!-- switch -->
    <div class="switch-group" v-if='role === "founder"'>
      <v-switch v-model='allow_feed' type='checkbox'>帖子同步至动态</v-switch>
      <v-switch v-model='private' type='checkbox'>设置为封闭圈子</v-switch>
      <template v-if='private'>
        <v-switch v-model='paid' :data-value='true' type='radio'>
          收费入圈
          <template v-if='paid'>
            <div slot='append'>
              <!-- 移动端 数字键盘 -->
              <!-- pattern="[0-9]*" -->
              <input type="number" placeholder="设置入圈收费金额" v-model='money' pattern="[0-9]*">金币
            </div>
          </template>
        </v-switch>
        <v-switch v-model='paid' :data-value='false' type='radio'>免费入圈</v-switch>
      </template>
    </div>
    <!-- switch -->
    <!-- notice -->
    <div class="form-group notice">
      <div class="form-row">
        <label for="notice">公告</label>
        <div class="input auto">
          <textarea v-txtautosize :readonly="role === 'member'" v-model='notice' placeholder="选填" />
        </div>
      </div>
    </div>
    <!-- notice END -->
    <transition name="router-slid" mode='out-in'>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { getFileUrl } from '@/util/'
import HeadTop from '@/components/HeadTop'
import { encodeGeoHash } from '@/util/geohash'
export default {
  name: 'addGroup',
  components: {
    HeadTop
  },
  data() {
    return {
      name: '', // 圈名
      // tags: [], //  标签
      header: '', // 头像
      avatar: null,
      category: {}, // 当前
      summary: '', // 圈子简介
      notice: '', // 公告
      money: null,
      allow_feed: false,
      // 圈子类别 public: 公开，private：私有，paid：付费的
      private: true,
      paid: false,

      role: 'member',
      groupID: this.$route.params.groupID
    }
  },
  computed: {
    disabled() {
      return [this.name, this.header, this.tags].map(v => v.length > 0).includes(false)
    },
    tagsLen() {
      return this.tags.length
    },
    tags() {
      return this.$store.state.CUR_SELECTED_TAGS
    },
    cur_location() {
      return this.$store.state.CUR_GROUP_LOCATION
    },
    location_txt() {
      return this.cur_location.label || ''
    },
    mode() {
      return this.paid ? 'paid' : (this.private ? 'private' : 'public')
    }
  },
  watch: {
    money(val) {
      if (val < 0) {
        this.money = 0
      }
    },
    private(val) {
      if (!val) {
        this.paid = val
      }
    }
  },
  methods: {
    async init() {
      const {
        data: {
          tags,
          mode,
          name,
          money,
          avatar,
          notice,
          summary,
          category,
          allow_feed: allowFeed,
          joined: {
            role
          }
        }
      } = await this.$http.get(`/plus-group/groups/${this.groupID}`)

      this.name = name
      this.header = avatar
      this.avatar = {}
      this.category = category
      this.summary = summary
      this.notice = notice
      this.money = money
      this.role = role
      this.allow_feed = allowFeed

      switch (mode) {
        case 'paid':
          this.paid = true
          break
        case '1':
          this.private = true
          break
      }


      this.$store.state.CUR_SELECTED_TAGS = [...tags]
      this.$store.state.CUR_GROUP_LOCATION = {}
    },
    /**
     * 取消 并 返回上一页
     *     @author jsonleex <jsonlseex@163.com>
     */
    cancel() {
      this.$router.go(-1)
    },
    /**
     * 创建圈子
     *     @author jsonleex <jsonlseex@163.com>
     */
    addGroup() {
      // POST /categories/:category/groups
      const category = this.category.id
      if (!category) {
        return this.$Message.error('请选择圈子分类')
      }

      let params = {
        name: this.name,
        summary: this.summary,
        notice: this.notice,
        mode: this.mode,
        allow_feed: this.allow_feed
      }

      if (this.location) {
        const { lat, lng } = this.cur_location
        params = Object.assign({}, params, {
          location: this.location_txt,
          latitude: lat,
          longitude: lng,
          geo_hash: encodeGeoHash(lat, lng)
        })
      }

      this.avatar.toBlob((blob) => {
        let formData = new FormData()
        formData.append('avatar', blob)

        Object.keys(params).forEach(key => formData.append(key, params[key]))

        if (params.mode === 'paid') {
          if (this.money > 0) {
            formData.append('money', this.money)
          }
        }
        // tags
        this.tags.forEach((t, index) => {
          formData.append(`tags[][id]`, t.id)
        })

        this.$http.post(`/plus-group/groups/${this.groupID}`, formData, {
          validateStatus: s => s === 200
        }).then(data => {
          this.$Message.success('创建圈子成功')
        }).catch(err => {
          const { response: { data = { message: '创建圈子失败' } } = {} } = err
          this.$Message.error(data)
        })
      })
    },

    /**
     * 选择图片
     *     @author jsonleex <jsonlseex@163.com>
     */
    chooseImg() {
      if (this.role === 'member') {
        return
      }
      this.$refs.uploadFile.click()
    },

    /**
     * 裁剪图片
     *     @author jsonleex <jsonlseex@163.com>
     */
    getImg(e) {
      const vm = this
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.$ImgCropper.show({
        url: getFileUrl(files[0]),
        round: false,
        onCancel() {
          vm.$refs.uploadFile.value = null
        },
        onOk(canvas) {
          vm.avatar = canvas
          vm.header = canvas.toDataURL()
          vm.$refs.uploadFile.value = null
        }
      })
    },
    /**
     * 进入选择页面
     *     @author jsonleex <jsonlseex@163.com>
     */
    toChoose(type) {
      if (this.role === 'member') {
        return
      }
      if (!type) {
        return
      }
      this.$router.push(`/${type.toLocaleLowerCase()}`)
    }
  },
  created() {
    this.init()
  }
}

</script>
<style lang='less'>
.add_group_btn {
  width: 100%;
  height: 100%;
  font-size: 32px;
  background: none;
  color: #59b6d7;
  &[disabled] {
    color: #ccc;
  }
}

.form-group {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  font-size: 30px;
  color: #999;
  border-bottom: 1px solid #dedede;
  /*no*/
  &.notice {
    margin-top: 30px;
  }
}

.form-row {
  display: flex;
  padding: 0 20px;
  line-height: 1;
  width: 100%;
  font-size: 30px;
  justify-content: space-between;
  align-items: center;
  &.header-upload {
    input[type='file'] {
      display: none!important;
    }
    span {
      flex: 1 1 auto;
      color: #333;
    }
  }
  label {
    color: #999;
    width: 126px;
    flex: 0 0 auto;
  }
  .input {
    flex: 1 1 auto;
    min-height: 100px;
    line-height: 100px;
    color: #333;
    font-size: 30px;
    border-bottom: 1px solid #ededed;
    /*no*/
    &[type='text'] {
      line-height: normal;
    }
    &.ccc {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ccc;
      &.c333 {
        color: #333;
      }
    }
    &.auto {
      overflow: hidden;
      height: auto;
      min-height: 100px;
      border: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  textarea {
    padding: 15px 0;
    outline: 0;
    border: 0;
    width: 100%; // height: 30px;
    line-height: 1;
    resize: none;
    font-size: 30px;
    vertical-align: middle;
    color: #333;
  }

   ::placeholder {
    color: #ccc;
  }

  .v-icon {
    width: 32px;
    height: 32px;
    color: #bfbfbf;
    flex: 0 0 auto;
  }
}

.group-header {
  display: block;
  width: 90px;
  height: 90px;
  background-color: #ededed;
  margin: 35px 25px 35px 0;
  overflow: hidden;
  img {
    display: block;
    width: 100%;
  }
}

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all .4s;
}

.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(100%, 0, 0);
}

.switch-group {
  margin-top: 30px;
}

.full-page {
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1010;
  background-color: #fff;
}

.tags-list {
  height: 100%;
  padding: 25px 0;
  display: flex;
  flex-wrap: wrap;
  .tags-item {
    margin-left: 10px;
    margin-bottom: 10px;
    padding: 0 20px;
    height: 48px;
    line-height: 46px;
    background-color: #f4f5f5;
    color: #666;
    border-radius: 3px;
    /*no*/
  }
}

.tips {
  padding-left: 20px;
  margin-top: 15px;
  font-size: 20px;
  color: #b3b3b3;
}

</style>
