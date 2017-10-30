<template>
  <section :class="[$style.topicDetailRoot]">
    <header :class="['commonHeader', $style.commonHeader]">
      <Row :gutter="24">
        <Col span="4">
          <BackIcon height="21" @click.native="goBack()" width="21" color="#999" />
        </Col>
        <Col span="16" :class="['title-col', $style.title]">
          {{ topic.name }}
        </Col>
        <Col span="4" class="header-end-col">
          <SearchIcon height="21" width="21" color="#999" />
        </Col>
      </Row>
    </header>
    <section :class="$style.topicDetail">
      <Row :gutter="24">
        <Col span="6">
          <img :class="$style.topicImg" v-lazy="avatar" :alt="topic.name" />
        </Col>
        <Col span="12">
          <section>
            <h3 :class="$style.name">{{ topic.name }}</h3>
            <span>{{ topic.follows_count }}</span> 关注 · <span>{{ topic.questions_count }}</span> 问题
          </section>
        </Col>
        <Col span="6" class="header-end-col">
          <Button v-if="!topic.has_follow" class="followAboutButton"  :class="$style.unfollow" type="ghost" @click="follow(topic.id)"><PlusIcon height="16" width="16" color="#59b6d7" />关注</Button>
          <Button v-else type="ghost" class="followAboutButton"  @click="unFollow(topic.id)"><RightIcon height="16" width="16" color="#ccc" />已关注</Button>
        </Col>
      </Row>
    </section>
    <section :class="$style.detailDesc">
      <Row :gutter="24">
        <Col span="24">
          <span @click="showAll = true;" v-if="!showAll" :class="$style.someDesc">话题简介: {{ topic.description }}</span>
          <span v-else @click="showAll = false" :class="$style.allDesc">话题简介: {{ topic.description }}</span>
        </Col>
      </Row>
    </section>
    <section :class="$style.experts" @click="$router.push({name: 'expertlist', params: {topic_id: topic.id}})">
      <Row :gutter="24">
        <Col span="8">
          {{topic.experts_count}}位相关专家  
        </Col>
        <Col span="16" style="position: relative;">
          <img  class="component-avatar" :style="styleCompute(index)" v-lazy="expert.avatar || defaultAvatar" alt="" v-for="(expert, index) in topic.experts" :key="index">
        </Col>
      </Row>
    </section>
    <Row :gutter="24" :class="[$style.nav, 'nav']">
      <Col span="4-8">
        <router-link :to="{name: 'TopicDetailQuestionsList', params: {topic_id: topic.id, type: 'hot'}}">热门</router-link>
      </Col>
      <Col span="4-8">
        <router-link :to="{name: 'TopicDetailQuestionsList', params: {topic_id: topic.id, type: 'excellent'}}">精选</router-link>
      </Col>
      <Col span="4-8">
        <router-link :to="{name: 'TopicDetailQuestionsList', params: {topic_id: topic.id, type: 'reward'}}">悬赏</router-link>
      </Col>
      <Col span="4-8">
        <router-link :to="{name: 'TopicDetailQuestionsList', params: {topic_id: topic.id, type: 'new'}}">最新</router-link>
      </Col>
      <Col span="4-8">
        <router-link :to="{name: 'TopicDetailQuestionsList', params: {topic_id: topic.id, type: 'all'}}">全部</router-link>
      </Col>
    </Row>
    <router-view :class="$style.view"></router-view>
  </section>
</template>
<style lang="less" module>
  .topicDetailRoot {
    .commonHeader {
      .title {
        word-break: break-all;
        display: -webkit-box; 
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;  
        -webkit-line-clamp: 1;
        text-align: center;
      }
    }
    .topicDetail {
      padding-top: 12px;
      padding-bottom: 12px;
      background-color: #fff;
      .name {
        word-break: break-all;
      }
      .topicImg {
        width: 100%;
      }
      .unfollow {
        border: #59b6d7 1px solid;
        color: #59b6d7;
      }
    }
    .detailDesc {
      padding-bottom: 12px;
      background-color: #fff;
      border-bottom: 1px solid #ededed;
      span {
        padding-top: 12px;
        border-top: 1px solid #ededed;
        word-break: break-all;
        display: -webkit-box; 
        -webkit-box-orient: vertical; 
        &.someDesc {
          overflow: hidden;
          text-overflow: ellipsis;  
          -webkit-line-clamp: 3;  
        }
      }
    }
    .experts {
      padding-top: 12px;
      padding-bottom: 12px;
      background-color: #fff;
      border-bottom: 1px solid #efefef;
    }
    .nav {
      width: 100vw;
      padding-bottom: 12px;
      padding-top: 12px;
      border-bottom: 1px solid #efefef;
      background-color: #fff;
      z-index: 10;
    }
    .view {

    }
  }
</style>
<style lang="less" scoped>
  .nav {
    a {
      font-size: 16px;
      color: #bfbfbf;
      &.router-link-active {
        color: #333;
        border-bottom: none;
        font-weight: 500;
      }
    }
  }
</style>
<script>
  import _ from 'lodash';
  import { createAPI, addAccessToken } from '../../utils/request';
  import { resolveImage } from '../../utils/resource';
  import timer from '../../utils/timer';
  import BackIcon from '../../icons/Back';
  import SearchIcon from '../../icons/Search';
  import RightIcon from '../../icons/Right';
  import PlusIcon from '../../icons/Plus';
  const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
  const nothingImage = resolveImage(require('../../statics/images/defaultNothingx2.png'));
  
  const TopicDetail = {
    components: {
      BackIcon,
      SearchIcon,
      PlusIcon,
      RightIcon
    },
    data: () => ({
      topic: {
        id: 0
      },
      questions: [],
      showAll: false,
      defaultAvatar
    }),
    methods: {
      follow (id) {
        addAccessToken().put(
          createAPI(`user/question-topics/${id}`),
          {
            validataStatus: status => status === 201
          }
        )
        .then( () => {
          this.topic.has_follow = true;
        })
      },
      unFollow (id) {
        addAccessToken().delete(
          createAPI(`user/question-topics/${id}`),
          {
            validataStatus: status => status === 204
          }
        )
        .then( () => {
          this.topic.has_follow = false;
        })
      },
      styleCompute(index) {
        let right = (index !== 0 ? `${(this.topic.experts_count * index)}vw` : '12px');
        return `top: -14px; z-index: ${this.topic.experts_count - index}; width: 7vw; position: absolute; right: ${right}`;
      },
      goBack () {
        if(window.history.length < 2) {
          this.$router.push('/questions/topics');
          return;
        }
        this.$router.back();
      },
      getTopic() {
        const { id } = this.topic;
        addAccessToken().get(
          createAPI(`question-topics/${id}`),
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          this.topic = {
            ...this.topic,
            ...data
          };
        })
        .catch(({ response: { data } }) => {
          console.log(data);
        })
      }
    },
    computed: {
      avatar () {
        return this.topic.avatar || defaultAvatar
      }
    },
    mounted () {
      this.topic.id = this.$route.params.topic_id || 0;
      this.getTopic();
    }
  };

  export default TopicDetail;
</script>