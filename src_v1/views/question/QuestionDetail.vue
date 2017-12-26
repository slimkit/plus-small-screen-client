<template>
  <section :class="$style.QuestionDetail">
    <!-- Loadding -->
    <div id="spinner" v-if="loading">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <header class="commonHeader">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon height="21" @click.native="goBack()" width="21" color="#979797" />
        </Col>
        <Col span="14" class="title-col">
          问题详情
        </Col>
      </Row>
    </header>
    <section :class="$style.detail">
      <Row :gutter="24" :class="$style.topics">
        <Col span="24">
          <section :class="$style.topicContainer">
            <Tag @click="$router.push({ name: 'topicDetail', params: { topic_id: topic.id }})" :class="$style.topic" v-for="topic in question.topics" :key="topic.id">{{ topic.name }}</Tag>
          </section>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="24">
          <h2 style="padding: 12px 0; color: #323232;">{{question.subject}}</h2>
          <div @click="showAll = true;" v-if="!showAll" :class="$style.someDesc">{{ getPureText(getHtmlFalse) }}</div>
          <div v-else @click="showAll = false" :class="$style.allDesc" v-html="getHtml" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.watch">
        <Col span="12">
          <span :class="$style.follow">{{ question.watchers_count }} 关注</span>
          <span :class="$style.special" v-if="question.amount"> · <RewardCon color="#FCA92B" height="16" width="16" /><i>{{showAmount(question.amount)}}</i></span>
          <span :class="$style.special" v-if="question.look"> · <LookIcon color="#FCA92B" height="16" width="16" /><i>{{showAmount($storeLocal.get('onlookers_amount'))}}</i></span>
        </Col>
        <Col span="12" class="header-end-col">
          <Button size="small"  class="followAboutButton" v-if="question.watched" @click.native="unFollow()" type="ghost"><RightIcon color="#ccc" width="14" height="14" />已关注</Button>
          <Button class="followAboutButton" size="small" v-else type="ghost" :class="$style.unFollow" @click.native="follow()"><PlusIcon color="#59B6D7" width="14" height="14"/>关注 </Button>
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.answerEntry">
        <Col span="12" class="title-col" v-if="question.amount && question.invitations.length">
          <Poptip placement="bottom" style="display: flex">
            <span class="IconWithText"><RewardIcon height="21" width="21" />已设置悬赏</span>
            <div :class="$style.api" slot="content">
              <img  class="component-avatar" style="width: 8vw; vertical-align: middle; margin-right: 3vw;" v-lazy="question.invitations[0].avatar || defaultAvatar" alt="">{{question.invitations[0].name}}
            </div>
          </Poptip>
        </Col>
        <Col span="12" class="title-col" v-else-if="question.amount">
          <span class="IconWithText"><RewardIcon height="21" width="21" />已设置悬赏</span>
        </Col>
        <Col span="12" class="title-col" v-else>
          <span class="IconWithText"><RewardIcon height="21" width="21" />未设置悬赏</span>
        </Col>
        <Col span="12" :class="['title-col', $style.hasleftborder]">
          <span class="IconWithText" v-if="question.my_answer" @click="$router.push({name: 'AnswerDetail', params: {answer_id: question.my_answer.id}})">
            <AnswerIcon height="21" width="21" color="#646464"/>
            查看回答
          </span>
          <span class="IconWithText" style="" v-else @click="answerQuestion">
            <AnswerIcon height="21" width="21" color="#646464"/>
            添加回答
          </span>
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.order">
        <Col span="12">
          {{question.answers_count}} 个回答
        </Col>
        <Col span="12" class="header-end-col">
          <span v-if="order_type === 'default'">默认排序</span>
          <span v-else>时间排序</span>
          <OrderIcon style="margin-left: 2vw;" height="21" width="21" />
        </Col>
      </Row>
      <section :class="$style.answers" v-if="hasAnswers">
        <div :class="[$style.wrapper, 'wrapper']">
          <mt-loadmore
            :bottom-method="loadMore"
            :top-method="loadNew"
            :bottom-all-loaded="bottomAllLoaded"
            :top-all-loaded="true"
            ref="loadmore"
            :bottomDistance="70"
            @bottom-status-change="bottomStatusChange"
          >
            <section v-if="question.invitation_answers.length" :class="$style.answerContainer" v-for="(invitation_answer, index) in question.invitation_answers" @click="checkAnswer(invitation_answer.could , invitation_answer.id)">
              <Row :class="$style.answer" :gutter="24" :key="invitation_answer.id">
                <Col span="4">
                  <user-avatar :src="invitation_answer.user.avatar" :sex="invitation_answer.user.sex" size="small" v-if="!invitation_answer.anonymity" />
                  <user-avatar v-else size="small" />
                </Col>
                <Col span="20">
                  <div :class="$style.userTime">
                    <section :class="$style.user">
                      <router-link v-if="!invitation_answer.anonymity" :to="{name: 'userSpace', params: { user_id: invitation_answer.user.id}}">{{invitation_answer.user.name}}</router-link>
                      <a href="javascript:void(0);" v-else>匿名用户</a> 
                      <InvitedIcon height="21" width="57" color="#59B6D7" />
                      <AdoptionIcon v-if="invitation_answer.adoption" height="21" width="45" color="#56BC9A" />
                    </section>
                    <timeago 
                      :class="$style.time" 
                      :since="time(invitation_answer.created_at, 8, false)" 
                      locale="zh-CN" 
                      :auto-update="60"
                    />
                  </div>
                  <p v-if="question.look && (!invitation_answer.could !== undefined && !invitation_answer.could)" :class="$style.answerBodyHide" class="blur">
                    这个回答的内容是不可见的哦，你需要先围观该答案才能看到详情的问答情况，请尊重答主的劳动成果，谢谢啦
                  </p>
                  <p 
                    v-else
                    :class="$style.answerBody"
                    v-html="answerBody(invitation_answer)"
                  />
                </Col>
              </Row>
              <Row :gutter="24" :class="$style.counts">
                <Col offset="4" span="8" style="display: inline-flex" :class="$style.count">
                  <span v-if="!invitation_answer.liked">
                    <UnDiggIcon 
                      @click.native.stop="diggAnswer(invitation_answer.id, index, 'invitation_answers')" 
                      color="#979797" 
                      height="21" 
                      width="21" 
                    /> 
                    {{invitation_answer.likes_count}}
                  </span>
                  <span v-else>
                    <DiggIcon 
                      @click.native.stop="unDiggAnswer(invitation_answer.id, index, 'invitation_answers')" 
                      color="#f4504d" 
                      height="21" 
                      width="21" 
                    />
                    {{invitation_answer.likes_count}}
                  </span>
                  <span>
                    <CommentIcon color="#979797" height="21" width="21" />
                    {{invitation_answer.comments_count}}
                  </span>
                </Col>
                <Col span="12" v-if="question.look" class="header-end-col">
                  {{invitation_answer.onlookers_count}}人正在围观
                  <Button style="margin-left: 2vw;" size="small" type="primary" v-if="question.look && !invitation_answer.could">去围观</Button>
                  <Button style="margin-left: 2vw;" size="small" v-else>已围观</Button>
                </Col>
                </Col>
              </Row>
            </section>
            <section v-if="question.adoption_answers.length" :class="$style.answerContainer" v-for="(adoption_answer, index) in question.adoption_answers" @click="$router.push({name: 'AnswerDetail', params: {answer_id: adoption_answer.id}})">
              <Row :class="$style.answer" :gutter="24" :key="adoption_answer.id">
                <Col span="4">
                  <user-avatar v-if="!adoption_answer.anonymity" :src="adoption_answer.user.avatar" :sex="adoption_answer.user.sex" size="small" />
                  <user-avatart v-else size="small" />
                </Col>
                <Col span="20">
                  <div :class="$style.userTime">
                    <section :class="$style.user">
                      <router-link v-if="!adoption_answer.anonymity" :to="{name: 'userSpace', params: { user_id: adoption_answer.user.id}}">{{adoption_answer.user.name}}</router-link> 
                      <a href="javascript:void(0);" v-else>匿名用户</a>
                      <AdoptionIcon height="21" width="45" color="#56BC9A" />
                    </section>
                    <timeago 
                      :class="$style.time" 
                      :since="time(adoption_answer.created_at, 8, false)" 
                      locale="zh-CN" 
                      :auto-update="60"
                    />
                  </div>
                  <p 
                    :class="$style.answerBody" 
                    v-html="getContent(answerBody(adoption_answer))"
                  />
                </Col>
              </Row>
              <Row :gutter="24" :class="$style.counts">
                <Col offset="4" span="20" style="display: inline-flex" :class="$style.count">
                  <span v-if="!adoption_answer.liked">
                    <UnDiggIcon 
                      @click.native.stop="diggAnswer(adoption_answer.id, index, 'adoption_answers')" 
                      color="#979797" 
                      height="21" 
                      width="21" 
                    /> 
                    {{adoption_answer.likes_count}}
                  </span>
                  <span v-else>
                    <DiggIcon 
                      @click.native.stop="unDiggAnswer(adoption_answer.id, index, 'adoption_answers')" 
                      color="#f4504d" 
                      height="21" 
                      width="21" 
                    />
                    {{adoption_answer.likes_count}}
                  </span>
                  <span>
                    <CommentIcon color="#979797" height="21" width="21" />
                    {{adoption_answer.comments_count}}
                  </span>
                </Col>
              </Row>
            </section>
            <section :class="$style.answerContainer" @click="$router.push({name: 'AnswerDetail', params: {answer_id: answer.id}})" v-for="(answer, index) in answers" :key="answer.id">
              <Row :class="$style.answer" :gutter="24">
                <Col span="4">
                  <user-avatar v-if="!answer.anonymity" :src="answer.user.avatar" :sex="answer.user.sex" size="small" />
                  <user-avatar v-else size="small" />
                </Col>
                <Col span="20">
                  <div :class="$style.userTime">
                    <section :class="$style.user">
                      <router-link v-if="!answer.anonymity" :to="{name: 'userSpace', params: { user_id: answer.user.id}}">{{ answer.user.name || '' }}</router-link>
                      <a v-else href="javascript:void(0)">匿名用户</a>
                    </section>
                    <timeago 
                      :class="$style.time" 
                      :since="time(answer.created_at, 8, false)" 
                      locale="zh-CN" 
                      :auto-update="60"
                    />
                  </div>
                  <p 
                    :class="$style.answerBody" 
                    v-html="getContent(answerBody(answer))"
                  />
                </Col>
              </Row>
              <Row :gutter="24" :class="$style.counts">
                <Col offset="4" span="20" style="display: inline-flex" :class="$style.count">
                  <span v-if="!answer.liked">
                    <UnDiggIcon 
                      @click.native.stop="diggAnswer(answer.id, index, 'answers')" 
                      color="#979797" 
                      height="21" 
                      width="21" 
                    /> 
                    {{answer.likes_count}}
                  </span>
                  <span v-else>
                    <DiggIcon 
                      @click.native.stop="unDiggAnswer(answer.id, index, 'answers')" 
                      color="#f4504d" 
                      height="21" 
                      width="21" 
                    />
                    {{answer.likes_count}}
                  </span>
                  <span>
                    <CommentIcon color="#979797" height="21" width="21" />
                    {{answer.comments_count}}
                  </span>
                </Col>
              </Row>
            </section>
            <div slot="bottom" :class="[$style.mintLoadmoreBottom, 'mint-loadmore-bottom']">
              <span v-if="bottomAllLoaded">没有更多了</span>
              <section v-else>
                <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
                <span v-show="bottomStatus === 'loading'">加载中...</span>
                <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
              </section>
            </div>
          </mt-loadmore>
        </div>
      </section>
      <img v-lazy="noAnswerPic" v-else :class="$style.noAnswerPic" alt="">
    </section>
    <div id="feed-footer" class="feed-container-tool-operation feed-background-color">
      <Row :gutter="24" style="display: flex; justify-content: center; align-items: center; height: 100%;"  v-if="question.user_id === user_id">
        <Col span="6" class="operation" @click.native="openComments">
          <div>
            <CommentIcon height="20" width="20" color="#999" />
            <i>评论</i>
          </div>
        </Col>
        <Col span="6" class="operation">
          <div>
            <ShareIcon height="20" width="20" color="#999" />
            <i>分享</i>
          </div>
        </Col>
        <Col span="6" class="operation">
          <div @click="editQuestion">
            <EditIcon height="20" width="20" color="#999" />
            <i>编辑</i>
          </div>
        </Col>
        <Col span="6" class="operation">
          <div v-if="!question.has_collect" @click="showPopup">
            <MoreIcon height="20" width="20" color="#999" />
            <i>更多</i>
          </div>
        </Col>
      </Row>
      <Row :gutter="24" style="display: flex; justify-content: center; align-items: center; height: 100%;"  v-else>
        <Col span="8" class="operation" @click.native="openComments">
          <div>
            <CommentIcon height="20" width="20" color="#999" />
            <i>评论</i>
          </div>
        </Col>
        <Col span="8" class="operation">
          <div>
            <ShareIcon height="20" width="20" color="#999" />
            <i>分享</i>
          </div>
        </Col>
        <Col span="8" class="operation">
          <div @click="$Message.info({content: '敬请期待'})">
            <MoreIcon height="20" width="20" color="#999" />
            <i>更多</i>
          </div>
        </Col>
      </Row>
    </div>
    <Modal v-model="openPay" width="70">
      <h3 slot="header" style="color: #333; text-align:center">
        围观支付
      </h3>
      <div style="text-align:center">
        <h1 style="color: #FCA205">{{showAmount(onlookers_amount)}}</h1>
        <p style="color: #949494; padding: 5vw 10vw;">您只需要{{showAmount(onlookers_amount)}}{{goldName}}即可围观该答案</p>
      </div>
      <div slot="footer">
          <Button @click.native="lookAnswer(lookAnswerId)" type="primary" size="large" long :loading="payLoading" @click="">支付</Button>
          <br />
          <br />
          <Button type="ghost" size="large" @click="cannelPay" long>返回</Button>
      </div>
    </Modal>
    <Modal v-model="openExcellet" width="70">
      <h3 slot="header" style="color: #333; text-align:center">
        精选问题支付
      </h3>
      <div style="text-align:center">
        <h1 style="color: #FCA205">{{showAmount(apply_amount)}}</h1>
        <p style="color: #949494; padding: 5vw 10vw;">您只需要{{showAmount(apply_amount)}}{{goldName}}就可以使问题成为精选问答</p>
      </div>
      <div slot="footer">
          <Button @click.native="doAskExcellet" type="primary" size="large" long :loading="payLoading" @click="">支付</Button>
          <br />
          <br />
          <Button type="ghost" size="large" @click="handleCloseExcellt" long>返回</Button>
      </div>
    </Modal>
    <template v-if="showComments">
      <section :class="$style.commentsRoot">
        <header class="commonHeader" id="feed-header">
          <Row :gutter="24">
            <Col span="5" style="display: flex; justify-content: flex-start">
              <BackIcon @click.native="colseComments" height="21" width="21" color="#999" />
            </Col>
            <Col span="14" class="title-col">
              评论({{question.comments_count}})
            </Col>
          </Row>
        </header>
        <div :class="$style.commentsContainer">
          <template v-if="comments.length === 0">
            <img :src="noCommentImage" alt="">
          </template>
          <template v-else>
            <mt-loadmore
              :top-method="commentsLoadNew"
              :bottom-method="commentsLoadMore"
              :bottom-all-loaded="commentsBottomAllLoaded"
              ref="commentLoadMore"
              @bottom-status-change="commentsBottomStatusChange"
              :bottomDistance="40"
            >
              <section v-for="(comment, index) in formateComments" :key="comment.id" >
                <Row :gutter="24" :class="$style.perComment">
                  <Col span="4">
                    <div class="grid-content bg-purple">
                      <img @click="changeUrl(`/users/feeds/${comment.user.user_id}`)" :src="comment.user.avatar" alt="" class="component-avatar">
                    </div>
                  </Col>
                  <Col span="20">
                    <div class="grid-content bg-purple">
                      <Row style="padding-bottom: 5px">
                        <Col span="17">
                          <router-link :class="$style.profileLink" :to="{ path: `/users/feeds/${comment.user.user_id}` }">{{ comment.user.name }}</router-link>
                        </Col>
                        <Col span="7" style="display: flex; justify-content: flex-end;">
                          <timeago style="color: #ccc; font-size: 12px;" :since="time(comment.created_at, 8, false)" locale="zh-CN" :auto-update="60"></timeago>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="24">
                          <div style="color: #ccc;">
                            <span v-if="comment.reply_user">回复 </span>
                            <router-link :class="$style.profileLink" :to="{ path: `/users/feeds/${comment.reply_user}` }">{{ comment.replyToUser.name }} </router-link>
                            <span
                              v-if="comment.user_id  != user_id"
                              @click.stop="focusInput(comment.user_id)"
                              :class="$style.commentContent"
                            > 
                             {{ comment.body }}
                            </span>
                            <span
                              v-if="comment.user_id == user_id"
                              @click.stop="showComfirm(comment.id, question.id, index)"
                              :class="$style.commentContent"
                            > 
                             {{ comment.body }}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </section>
              <div slot="bottom" :class="['mint-loadmore-bottom', $style.mintLoadmoreBottom]">
                <span v-show="commentsBottomAllLoaded && commentsBottomStatus !== 'loading' && comments.length > 15">没有更多了</span>
                <span v-show="commentsBottomStatus === 'loading'">加载中...</span>
                <span v-show="commentsBottomStatus === 'pull' && !commentsBottomAllLoaded">上拉加载更多评论</span>
                <span v-show="commentsBottomStatus === 'drop'">释放加载更多评论</span>
              </div>
            </mt-loadmore>
          </template>
          <section :class="$style.commentInput" ref="commentFeedInput">
            <Row :gutter="24">
              <Col span="20">
                <Input 
                  type="textarea" 
                  ref="commentUserInput"
                  class="commentInput"
                  :minlength='1' 
                  :maxlength='255'
                  :autofocus="true"
                  v-model="commentBody"
                  :placeholder="placeholder"
                  :rows="1"
                  v-childfocus
                />
              </Col>
              <Col span="4">
                <Button 
                  :class="$style.commentOperation" 
                  type="primary" 
                  class="sendButton" 
                  :disabled="!canSend" 
                  size="small"
                  long
                  @click.native="sendComment()"
                >
                  发送
                </Button>
              </Col>
            </Row>
          </section>
        </div>
      </section>
    </template>
    <mt-popup
      v-model="isShowPopup"
      position="bottom"
      style="width: 100%;"
      :class="$style.popup"
    >
      <div>
        <Button 
          @click="handleOpenExcellet" 
          size="large" 
          :class="[$style.askForexCellent, $style.popupButton]" 
          type="text" :long="true"
        >
          申请为精选问答
        </Button>
        <Button
          type=""
          @click="comfirmDelete" 
          size="large" 
          :class="[$style.deleteQuestion, $style.popupButton]" 
          type="text" 
          :long="true"
        >
          删除问题
        </Button>
        <Button 
          @click="hidePopup" 
          size="large" 
          :class="$style.popupButton" 
          type="text" 
          :long="true"
        >
          取消
        </Button>
      </div>
    </mt-popup>
  </section>
</template>
<style lang="less" module>
  .QuestionDetail {
    height: 100%;
    .popup {
      width: 100%;
      background: rgba(0, 0, 0, 0);
      .popupButton {
        border-bottom: 1px solid #ededed;
        color: #333;
        border-radius: 0;
        font-size: 16px;
        &.deleteQuestion {
          color: #f00;
        }
        &:last-child {
          margin-top: 5px;
        }
      }
    }
    .commentsRoot {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      background-color: #f4f5f5;
      z-index: 10;
      .commentsContainer {
        height: calc(~"100vh - 92px");
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        .mintLoadmoreBottom {
          margin-bottom: -50px;
        }
        .perComment {
          padding-top: 12px;
          padding-bottom: 12px;
          background-color: #fff;
          border-bottom: 1px solid #efefef;
          .profileLink {
            color: #333;
          }
          .commentContent {
            word-break: break-all;
            color: #A9A9A9;
          }
        }
        .commentInput {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 11;
          padding-top: 6px;
          padding-bottom: 6px;
          background-color: #fff;
          border-top: 1px solid #efefef;
          height: 46px;
        }
      }
    }
    .detail {
      background-color: #fff;
      height: calc(~"100% - 46px");
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      .topics {
        padding-top: 12px;
        .topicContainer {
          padding-bottom: 12px;
          border-bottom: 1px solid #efefef;
          .topic {
            background: #DEF0F7;
            border-radius: 15px;
            padding: 4px 12px;
            border: none;
            font-size: 14px;
            color: #979797;
            height: auto;
            line-height: 1;
          }
        }
      }
      .answers {
        background-color: #f4f5f5;
        .mintLoadmoreBottom {
          margin-bottom: -50px;
        }
        .answerContainer {
          margin-bottom: 6px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .counts {
          padding-top: 12px;
          padding-bottom: 12px;
          background-color: #fff;
          .count {
            span {
              display: inherit;
              margin-right: 3vw;
              svg {
                margin-right: 2vw;
              }
            }
          }
        }
        .answer {
          display: block;
          padding-top: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ededed;
          background-color: #fff;
          &:last-child {
            border-bottom: none;
          }
          .answerBodyHide {
            margin: 4px 0 12px 0;
          }
          .answerBody {
            font-size: 14px;
            color: #5A5A5A;
            text-align: initial;
            overflow: hidden;
            text-overflow: ellipsis;  
            display: -webkit-box;  
            -webkit-line-clamp: 3;  
            -webkit-box-orient: vertical;
            word-break: break-all;
            margin: 4px 0 12px 0;
          }
          .userTime{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .user {
              color: #2b2b2b;
              font-size: 16px;
              display: inline-flex;
              align-items: center;
              svg {
                margin-left: 1vw;
              }
              a {
                color: #2b2b2b;
              }
              i {
                font-size: 12px;
                font-style: normal;
              }
            }
            .time {
              text-align: right;
              color: #C5C5C5;
              font-size: 12px;
            }
          }
        }
      }
      .order {
        padding-top: 12px;
        padding-bottom: 12px;
        background-color: #F4F5F5;
        color: #999999;
      }
      .answerEntry {
        color: #656565;
        padding-top: 12px;
        padding-bottom: 12px;
        .api {
          text-align: center;
        }
        .hasleftborder {
          border-left: 1px solid #efefef;
        }
      }
      .watch {
        font-size: 14px;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #efefef;
        .follow {
          color: #979797;
        }
        .special {
          display: inline-flex;
          align-items: center;
          i {
            color: #FCA92B;
            font-style: normal;
          }
          svg {
            margin-left: 1vw;
            margin-right: 1vw;
          }
        }
        .unFollow {
          border: 1px solid #59b6d7;
          color: #59b6d7;
        }
      }
      h2 {
        font-weight: 500;
      }
      div {
        &.allDesc {
          color: #6B6B6B;
          word-break: break-all;
          display: -webkit-box; 
          -webkit-box-orient: vertical;
          img {
            width: 100%;
          }
        }
        &.someDesc {
          color: #6B6B6B;
          word-break: break-all;
          display: -webkit-box; 
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;  
          -webkit-line-clamp: 3;  
        }
      }
    }
  }
</style>
<script>
  import { SHOWPOSTANSWER, CONFIRM, SHOWQUESTIONPOST  } from '../../stores/types';
  import BackIcon from '../../icons/Back';
  import time from '../../utils/timer';
  import getContent from '../../utils/getPureContent';
  import _ from 'lodash';
  import { createAPI, addAccessToken } from '../../utils/request';
  import { showAmount, trueAmount } from '../../utils/balance';
  import { resolveImage } from '../../utils/resource';
  import markdownIt from 'markdown-it';
  import plusImageSyntax from 'markdown-it-plus-image';
  import hljs from 'highlight.js';
  import DiggIcon from '../../icons/Digg';
  import UnDiggIcon from '../../icons/UnDigg';
  import CommentIcon from '../../icons/Comment';
  import OrderIcon from '../../icons/Order';
  import RewardIcon from '../../icons/Reward';
  import AnswerIcon from '../../icons/Answer';
  import LookIcon from '../../icons/Look';
  import RewardCon from '../../icons/RewardCon';
  import RightIcon from '../../icons/Right';
  import AdoptionIcon from '../../icons/Adoption';
  import InvitedIcon from '../../icons/Invited';
  import PlusIcon from '../../icons/Plus';
  import EditIcon from '../../icons/Edit';
  import MoreIcon from '../../icons/More';
  import ShareIcon from '../../icons/Share';
  import storeLocal from 'store';
  import { getUserInfo } from '../../utils/user';
  import formateFeedComments from '../../utils/formateFeedComments';
  import { mapState } from 'vuex';
  // 引入样式库
  import "github-markdown-css";
  import 'highlight.js/styles/github.css';
  const noCommentImage = resolveImage(require('../../statics/images/defaultNothingx2.png'));
  const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
  const onlookers_amount = storeLocal.get('onlookers_amount');
  const apply_amount = storeLocal.get('apply_amount');
  // markdown 解析
  const md = markdownIt({
    breaks: true,
    html: false,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }
   
      try {
        return hljs.highlightAuto(str).value;
      } catch (__) {}
   
      return ''; // use external default escaping 
    }
  }).use(plusImageSyntax, `/api/v2/files/`);

  const QuestionDetail = {
    components: {
      BackIcon,
      CommentIcon,
      DiggIcon,
      OrderIcon,
      UnDiggIcon,
      RewardIcon,
      AnswerIcon,
      LookIcon,
      RewardCon,
      RightIcon,
      AdoptionIcon,
      InvitedIcon,
      PlusIcon,
      EditIcon,
      MoreIcon,
      ShareIcon
    },
    data: () => ({
      user_id: 0,
      goldName: window.TS_WEB.goldName,
      onlookers_amount, // 围观金额
      apply_amount, // 申精金额
      loading: false,
      showAll: false,
      question: {
        id: 0
      },
      defaultAvatar,
      noCommentImage,
      order_type: 'default',
      bottomAllLoaded: true,
      bottomStatus: '',
      topStatus: '',
      answers: [],
      limit: 20,
      locked: false, // 请求锁
      openPay: false, // 支付窗口开关
      payLoading: false, // 加载动画
      lookAnswerId: 0, // 需要被围观的回答ID
      comments: [], // 问题评论列表
      showComments: false, // 评论窗口开关
      commentBody: '', // 评论内容
      reply_user: 0, // 被评论者
      commentsBottomAllLoaded: true,
      commentsBottomStatus: '',
      placeholder: '随便说说',
      max_id: 0,
      isShowPopup: false,
      showAskforExcellent: false,
      openExcellet: false, // 设置精华窗口开关
    }),

    mounted () {
      window.addEventListener('scroll', this.menu);
      this.getComments(); // 最后加载评论列表
    },
    methods: {
      time,
      showAmount,
      trueAmount,
      getUserInfo,
      updateQ( ){
        this.getQuestion();
      },
      editQuestion () {
        const { id } = this.question;
        const u = this.updateQ;
        this.$store.dispatch(SHOWQUESTIONPOST, cb => {
          cb({
            show: true,
            id,
            callback: u
          })
        })
      },
      getPureText (str) {
        return (str.replace(/<\/?.+?>/g,"")).replace(/ /g,"");
      },
      doAskExcellet () {
        const { question: { id } } = this;
        addAccessToken().post(
          createAPI(`user/question-application/${id}`),
          {
            validataStatus: status => status === 201
          }
        )
        .then( () => {
          this.$Message.info({
            content: '申请成功,请等待审核'
          });
          this.question = {
            ...this.question,
            ...{
              excellent: true
            }
          };
          this.openExcellet = false;
        })
        .catch(({ response: { data } }) => {
          this.openExcellet = false;
          this.$Message.error(this.$MessageBundle(data).getMessage());
        })
      },
      deleteQuestion () {
        this.hidePopup();
        const { question: { id } } = this;
        addAccessToken().delete(
          createAPI(`questions/${id}`),
          {
            validataStatus: status => status === 204
          }
        )
        .then( () => {
          this.$Message.success({
            content: '删除成功,跳转中...',
            duration: 2
          });
          setTimeout( () => {
            this.$router.push('/questions');
          }, 2000)
        })
      },
      comfirmDelete () {
        this.hidePopup();
        this.$Modal.confirm({
            title: '删除问题',
            content: '问题删除后将无法复原，确认删除该问题',
            onOk: () => {
              this.deleteQuestion();
            }
        });
      },
      hidePopup () {
        this.isShowPopup = false;
      },
      showPopup () {
        this.isShowPopup = true;
      },
      handleCloseExcellt() {
        this.openExcellet = false;
      },
      handleOpenExcellet () {
        this.hidePopup();
        this.openExcellet = true;
      },
      /**
       * 打开评论输入框
       * @param  {Number} comment_to_uid [回复某个用户ID]
       * @param  {Number} index          [被回复的评论在数组中的index]
       * @return {[type]}                [description]
       */
      focusInput (comment_to_uid = 0) {
        // 对评论进行评论
        let reply_to_user_id = this.reply_user = comment_to_uid;
        if(reply_to_user_id) {
          let item = this.$storeLocal.get(reply_to_user_id);
          if(item === undefined) {
            getUserInfo( reply_to_user_id ).then( user => {
              this.placeholder = `回复： ${user.name}`;
            })
          } else {
            this.placeholder = `回复: ${item.name}`;
          }
        } else {
          this.placeholder = '随便说说';
        }
      },
      // 新版删除确认提示
      showComfirm (commentId, id, index) {
        this.$store.dispatch(CONFIRM, cb => {
          cb({
            show: true,
            confirmContent: 'confirmContent',
            data: {
              comment_id: commentId,
              id: id,
              index: index
            },
            confirm: this.deleteComment
          })
        })
      },
      deleteComment (close, data) {
        addAccessToken().delete(createAPI(`questions/${data.id}/comments/${data.comment_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then(response => {
          let newComments = this.comments;
          newComments.splice(data.index,1);
          this.comments = newComments;
          this.question .comments_count -- ;
          this.$Message.success({
            content: '删除成功'
          })
        })
      },
      sendComment () {
        const { commentBody, reply_user } = this;
        let data = {
          body: commentBody
        }
        if(reply_user) {
          data.reply_user = reply_user
        }

        addAccessToken().post(
          createAPI(`questions/${this.question.id}/comments`),
          {
            ...data
          },
          {
            validataStatus: status => status === 201
          }
        )
        .then(({ data }) => {
          this.comments.unshift(data.comment);
          this.commentBody = '';
          this.reply_user = 0;
          this.placeholder = '随便说说'
        })
        .catch(({ response: { data } }) => {
          this.$Message.error(this.$MessageBundle(data).getMessage())
        })
      },
      commentsBottomStatusChange (status) {
        this.commentsBottomStatus = status;
      },
      
      colseComments() {
        this.showComments = false;
        document.body.style.overflow = 'auto';
      },
      openComments() {
        this.showComments = true;
        document.body.style.overflow = 'hidden';
      },
      commentsLoadMore () {
        this.getComments('loadMore');
      },

      commentsLoadNew () {
        this.getComments('loadNew');
      },
      // 获取评论列表
      getComments (type = 'new') {
        if(type === 'loadMore' && this.commentsBottomAllLoaded) {
          this.$refs.commentLoadMore.onBottomLoaded();
          return;
        }
        const { limit, max_id } = this;
        let params = {
          limit
        };
        if(type==='loadMore') {
          params.after = max_id;
        }
        addAccessToken().get(
          createAPI(`questions/${this.question.id}/comments`),
          {
            params: {
              ...params
            }
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data = [] }) => {
          const { length } = data;
          if(type !== 'loadNew') {
            
            if(length === limit) {
              this.commentsBottomAllLoaded = false;
            } else {
              this.commentsBottomAllLoaded = true;
            }
          }
          if(type === 'new') {
            this.comments = data;
            return;
          }

          if(type === 'loadMore') {
            this.comments = [
              ...this.comments,
              ...data
            ]
            this.$refs.commentLoadMore.onBottomLoaded();
            return;
          }

          if(type === 'loadNew') {
            this.comments = _.uniqBy([
              ...data,
              ...this.comments
            ], 'id');
            this.$refs.commentLoadMore.onTopLoaded();
            return;
          }
        })
      },
      menu() {
        let footer = document.getElementById('feed-footer');
        if(footer) {
          if(this.scroll > 55) {
            if(this.scroll > window.pageYOffset) {
              if(footer) footer.style.bottom = 0;
            } else {
              if(footer) footer.style.bottom = '-55px';
            }
          }
          this.scroll = window.pageYOffset;
        }
      },
      lookAnswer (id) {
        this.payLoading = true;
        addAccessToken().post(
          createAPI(`question-answers/${id}/onlookers`),
          {
            validataStatus: status => status === 201
          }
        )
        .then(({ data }) => {
          this.payLoading = false;
          this.lookAnswerId = 0;
          this.openPay = false;
          data.answer.could = true;
          let index = _.findIndex(this.question.invitation_answers, {id: id});
          this.question.invitation_answers[index] = data.answer;
          this.$Message.success(this.$MessageBundle(data).getMessage());
        })
        .catch(({ response: { data } }) => {
          this.$Message.error(this.$MessageBundle(data).getMessage());
        })
      },
      answerBody (answer) {
        const { body = '' } = answer;
        return this.getPureText(md.render(this.getContent(body)));
      },
      cannelPay () {
        this.openPay = false;
        this.lookAnswerId = 0;
      },
      checkAnswer( could, id ) {
        if (this.question.look === 0) {
          this.$router.push({name: 'AnswerDetail', params: {answer_id: id}});

          return;
        }
        if(!could && could !== undefined) {
          this.openPay = true;
          this.lookAnswerId = id;
          return;
        }
        this.$router.push({name: 'AnswerDetail', params: {answer_id: id}})
      },
      goBack() {
        if(window.history.length < 2) {
          this.$router.push('/questions/questions/hot');
          return;
        }
        this.$router.back();
      },
      unDiggAnswer (id, index, data) {
        const { locked } = this;
        let answers = []
        if(data !== 'answers') {
          answers = this.question[data];
        } else {
          answers = this[data];
        }
        
        if(locked) return;
        addAccessToken().delete(
          createAPI(`question-answers/${id}/likes`),
          {
            validataStatus: status => status === 204
          }
        )
        .then( () => {
          answers[index].liked = false;
          answers[index].likes_count -= 1;
          if(data !== 'answers') {
            this.question[data] = answers;
          } else {
            this[data] = answers;
          }
          this.locked = false;
        })
        .catch(({ response: { data }}) => {
          this.locked = false;
          this.$Message.error(this.$MessageBundle(data).getMessage())
        });
      },

      diggAnswer (id, index, data) {
        const { locked } = this;
        let answers = []
        if(data !== 'answers') {
          answers = this.question[data];
        } else {
          answers = this[data];
        }
        if(locked) return;
        addAccessToken().post(
          createAPI(`question-answers/${id}/likes`),
          {
            validataStatus: status => status === 201
          }
        )
        .then( () => {
          answers[index].liked = true;
          answers[index].likes_count += 1;
          if(data !== 'answers') {
            this.question[data] = answers;
          } else {
            this[data] = answers;
          }
          this.locked = false;
        })
        .catch(({ response: { data }}) => {
          this.locked = false;
          this.$Message.error(this.$MessageBundle(data).getMessage())
        });
      },
      /**
       * 打开回答界面
       * @return {[type]} [description]
       */
      answerQuestion () {
        const { id: question } = this.question;
        const update = this.getQuestion;
        this.$store.dispatch(SHOWPOSTANSWER, cb => {
          cb({
            show: true,
            question,
            callback: update
          })
        })
      },
      loadMore() {
        this.getAnswers('loadMore');
      },
      loadNew () {
        this.getAnswers('loadNew');
      },

      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      unFollow () {
        addAccessToken().delete(
          createAPI(`user/question-watches/${this.question.id}`),
          {
            validataStatus: status => status === 204
          }
        )
        .then ( () => {
          this.question.watched = false
          this.question.watchers_count -= 1;
        })
      },

      follow () {
        addAccessToken().put(
          createAPI(`user/question-watches/${this.question.id}`),
          {
            validataStatus: status => status === 204
          }
        )
        .then ( () => {
          this.question.watched = true
          this.question.watchers_count += 1;
        })
      },
      getContent,
      getQuestion () {
        addAccessToken().get(
          createAPI(`questions/${this.question.id}`),
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          this.question = {...data};
          this.loading = false;
          this.getAnswers();
        })
        .catch(({ response: {status, data } }) => {
          if(status === 404) {
            this.$Message.error('该问题已被删除');
            this.$router.push('/questions');

            return;
          }
          this.$Message(this.$MessageBundle(data).getMessage());
        })
      },

      getAnswers (type = 'new') {
        if (type === 'loadMore' && this.bottomAllLoaded) return;
        const { limit, answers: { length }, question: { id }, order_type } = this;
        let params = {
          limit,
          order_type
        }
        if(type === 'loadMore') {
          params.offset = length;
        }
        addAccessToken().get(
          createAPI(`questions/${id}/answers`),
          {
            ...params
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          const { length: dataLength } = data;
          if(type === 'new') {
            this.answers = data;
            if ( dataLength === limit ) {
              this.bottomAllLoaded = false;
            } else {
              this.bottomAllLoaded = true;
            }

            return;
          }

          if(type === 'loadNew') {
            this.answers = _.uniqBy([
              ...data,
              ...this.answers
            ], 'id');
            this.$refs.loadmore.onTopLoaded();
            return;
          }

          if(type === 'loadMore') {
            this.answers = [
              ...this.answers,
              ...data
            ]

            if(dataLength === limit) {
              this.bottomAllLoaded = false;
            } else {
              this. bottomAllLoaded = true;
            }

            this.$refs.loadmore.onBottomLoaded();
            return;
          }
        })
      }
    },
    computed: {
      canSend () {
        return this.commentBody.length > 0;
      },
      getHtmlFalse () {
        const { body = '' } = this.question;
        return md.render(this.getContent(body));
      },
      getHtml() {
        const { body = '' } = this.question;
        return md.render(body);
      },
      body () {
        const { body = '' } = this.question;
        return body;
      },
      hasAnswers () {
        const { answers_count } = this;
        return answers_count !== 0;
      },
      formateComments () {
        let formated = formateFeedComments(this.comments);
        this.max_id = formated.max_id;
        return formated.comments;
      },
      ...mapState({
        mine: state => state.users.mine
      })
    },
    
    created () {
      this.question.id = this.$route.params.question_id || 0;
    },

    beforeMount() {
      this.loading = true;
      this.getQuestion();
      const { id } = this.mine;
      this.user_id = id;
    }
  };

  export default QuestionDetail;
</script>