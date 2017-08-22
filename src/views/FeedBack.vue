<template>
<transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    <div class="feedBack" :class="$style.postRoot">
        <header class="commonHeader" v-if="!isWeiXin">
            <Row :gutter="24">
                <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="14" class="title-col">意见反馈</Col>
                <Col span="5" class="header-end-col">
                    <LoadingWhiteIcon height="21" width="21" v-if="loading" />
                    <span :class="{ action: !isDisabled, notAction: isDisabled}"  v-else @click="postFeed">提交</span>
                </Col>
            </Row>
        </header>
        <div :class="$style.content">
            <Row :gutter="24">
              <Col span="24">
                <Input 
                  v-model="content" 
                  :autosize="{minRows: 6, maxRows: 12}" 
                  :autofocus="true" 
                  :maxlength="255" 
                  type="textarea" 
                  :class="$style.contentInput" 
                  placeholder="请输入反馈，我们将为您不断改进"
                  v-childfocus
                />
              </Col>
            </Row>
        </div>
    </div>
</transition>
</template>
<script>
import BackIcon from '../icons/Back';
import LoadingWhiteIcon from '../icons/LoadingWhite';
import { goTo } from '../utils/changeUrl';
import { createAPI, addAccessToken } from '../utils/request';
import { NOTICE } from '../stores/types';

const feedBack = {
    name: "feedBack",
    components: {
        BackIcon,
        LoadingWhiteIcon
    },
    data: () => ({
        loading: false,
        isWeiXin: window.TS_WEB.isWeiXin,
        content: ''
    }),
    methods:{
        goTo,
        postFeed(){
            if(this.isDisabled) return false;
            
            this.loading = true;     
            let system_mark = +(window.TS_WEB.currentUserId + (new Date).getTime());
            addAccessToken().post(createAPI("user/feedback"),{
                content: this.content,
                system_mark
            },{
                validateStatus: status => status === 201
            })
            .then(({data={message: '未知错误'}})=>{
                this.$store.dispatch(NOTICE, cb => {
                  cb({
                    text: data.message[0],
                    time: 1500,
                    status: true
                  });
                });
                this.loading = false;
                this.content = '';
            });
        }
    },
    computed:{
        isDisabled () {
          return !(this.content.length);
        }
    }
}

export default feedBack;
</script>

<style>
    .action {
      color: #59b6d7;
      font-size: 16px;
    }
    .notAction {
      color: #999;
      font-size: 16px;
    }
</style>

<style lang="scss" module>
  .postRoot {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    background: #fff;
    z-index: 10;
    display: block;
    height: 100%;
    width: 100%;
    .uploadList {
      padding: 0 4vw;
      display: flex;
      flex-wrap: wrap;
    }
    .contentInput {
      padding: 6px 0;
      input, textarea {
        border: none;
        padding: 4px 8px;
        transition: none;
        font-size: 14px;
        &:focus, &:hover{
          border: none;
          outline: 0;
          box-shadow: none;
        }
      }
    }
    .actionBtn {
      font-size: 16px;
      display: flex;
      justify-content: flex-start;
      padding: 6px 0;
    }
    .sendAction {
      display: flex;
      justify-content: flex-end;
    }
    .camera {
      width: 22vw;
      height: 22vw; 
      line-height: 22vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>