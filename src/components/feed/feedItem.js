import feedMixin from './mixins/feed.mixin'
import groupFeedMixin from './mixins/groupFeed.mixin'
// components
import feedTools from './components/feedTools'
import feedImages from './components/feedImages'
import feedCommentItem from './components/feedCommentItem'
import { oneOf } from '../../util/'
// import showCommentInput from './showCommentInput'
import './feedItem.less'

const
  // Feed type `feed | group |`
  FEED_TYPES = ['feed', 'group']
const
  // Node template
  template = `
    <div class='feed-item' @click='viewFeed'>
        <span v-if='showFeedTime'>{{ time | time2txt }}</span>
        <v-avatar v-else sex='user.sex' 
            :src='user.avatar' 
            class='feed-item-avatar' 
            @click.native.stop='viewUser'>
            {{ user.name.slice(0, 1) }}
        </v-avatar>

        <div class="feed-item-content">
            <!-- 作者信息 -->
            <div class="feed-item-content-info" v-if='!showFeedTime'>
                <span @click.stop='viewUser'>{{ user.name }}</span>
                <div>
                    <i class="feed-item-content-info-pinned-icon" v-if='isPinned'>置顶</i>
                    <template>
                        <span class="feed-item-content-info-time">
                            {{ time | time2tips }}
                        </span>
                    </template>
                </div>
            </div>
            <!-- 作者信息 END -->

            <!-- 文本内容 -->
            <template v-if='title'>
                <div class="feed-item-content-title">{{ title }}</div>
            </template>
            <template v-if='text'>
                <div class="feed-item-content-text">
                    <span>{{ text }}</span>
                    <span v-if='isPay' class="blur">{{ '魑魅魍魉魑魅魍魉魑魅' }}</span>
                </div>
            </template>
            <!-- 文本内容 END -->

            <!-- 图片内容 -->
            <template v-if='images.length > 0'>
                <feed-images 
                :imgs='images' 
                @viewPic='viewPic' 
                class='feed-item-content-imgs'
                />
            </template>
            <!-- 图片内容 END -->

        </div>
        <!-- 操作区 -->

        <div class="feed-item-foot">
            <feed-tools
            :hasLike='hasLike' 
            :likeCount='likeCount' 
            :viewCount='viewCount' 
            :commentCount='commentCount' 
            @likeFeed='likeFeed' 
            @moreAction='moreAction' 
            @commentFeed='showCommentInput'
            />
        </div>
        
        <!-- 操作区 END -->

        <!-- 评论 -->
        <template v-if='commentCount'>
            <div class="feed-item-comments">
                <feed-comment-item 
                v-for='comment in comments.slice(0,5)' 
                v-if='comment.id'
                :comment='comment'
                :key='comment.id'
                @action='commentAction' />
                <a v-if='commentCount >5' @click='viewFeed'>查看更多</a>
            </div>
        </template>
        <!-- 评论 END -->

    </div>
`

/**
 * Feed component common props
 * @type {Object}
 */
const props = {
  /**
   * 动态原始数据
   *
   * 因来源不同数据结构不同 需要进行自定义处理
   * @type {Object}
   */
  feed: {
    required: true
  },
  /**
   * 动态所属栏目
   * @type {String}
   */
  channel: {
    validator (val) {
      return oneOf(val, FEED_TYPES)
    }
  },
  /**
   * 是否显示 `左侧` 发布时间
   *
   * 默认 false -> 显示用户头像
   * @type {Boolean}
   */
  showFeedTime: {
    type: Boolean,
    default: false
  },
  /**
   * 是否为置顶动态
   *
   * @type {Boolean}
   */
  isPinned: {
    type: Boolean,
    default: false
  },
  /**
   * 是否为付费动态
   * @type {Boolean}
   */
  isPay: {
    type: Boolean,
    default: false
  }
}

/**
 * Feed component common components
 * @type {Object}
 */
const components = {
  feedTools,
  feedImages,
  feedCommentItem
}

/**
 * Feed component common methods
 * @type {Object}
 */
const methods = {
  /**
   * 前往动态作者主页
   * @author jsonleex <jsonlseex@163.com>
   */
  viewUser () {
    this.$router.push(`/user/${this.feed.user_id}`)
  },
  /**
   * 查看图片
   * @author jsonleex <jsonlseex@163.com>
   */
  viewPic () {
    console.log('查看图片')
  },
  /**
   * 弹出评论操作框
   * @author jsonleex <jsonlseex@163.com>
   */
  commentAction (uId, uName, cId) {
    if (uId === this.$store.state.CURRENTUSER.id) {
      this.showCommentAction(cId)
    } else {
      const placeholder = uName && uId ? `回复${uName}` : '随便说说'
      this.showCommentInput({ placeholder, reply_user: uId })
    }
  },
  /**
   * 显示评论操作弹层
   * @author jsonleex <jsonlseex@163.com>
   */
  showCommentAction (id) {
    const that = this
    this.$Modal.info({
      render (h) {
        return h('div', {}, [
          h('button', {
            on: {
              click: () => {
                that.deleteComment(id, this.onOk)
              }
            }
          }, '删除'),
          h('button', {
            on: {
              click: () => {
                that.pinnedComment(id, this.onOk)
              }
            }
          }, '申请评论置顶')
        ])
      },
      onOk () {
        this.$Modal.remove()
      }
    })
  },
  /**
   * 显示评论输入框
   * @author jsonleex <jsonlseex@163.com>
   */
  showCommentInput (options = {}) {
    const that = this
    const { reply_user } = options
    options = Object.assign({}, {
      onOk (txt) {
        that.commentFeed(txt, reply_user, () => {
          that.$Modal.remove()
        })
      }
    }, options)
    this.$ShowCommentInput(options)
  }
}

/**
 * Feed component common computed
 * @type {Object}
 */
const computed = {
  // 动态作者
  user () {
    return this.feed.user
  },
  // 发布时间
  time () {
    // replace(/-/g, '/') 兼容 IOS
    return this.feed.created_at.replace(/-/g, '/')
  },
  // 图片
  images () {
    return this.feed.images || []
  },
  // 评论
  comments () {
    return this.feed.comments || []
  },
  // 是否为自己的动态
  isOwner () {
    return this.user.id === this.$store.state.CURRENTUSER.id
  }
}

/**
 * FeedItem
 * @type {Object}
 */
export const FeedItem = {
  props,
  methods,
  computed,
  template,
  components,
  name: 'FeedItem',
  mixins: [feedMixin]
}

/**
 * GroupFeedItem component
 * @type {Object}
 */
export const GroupFeedItem = {
  props,
  methods,
  computed,
  template,
  components,
  name: 'GroupFeedItem',
  mixins: [groupFeedMixin]
}
