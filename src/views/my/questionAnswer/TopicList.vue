<template>
<div style="margin-top:6px;">
	<!-- Loadding -->
    <div id="spinner" v-if="loading">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
	<div v-if="itemLength">
		<div class="topic-item" v-for="item in items">
		  <div class="ivu-row">
		    <Col class="topic-avatar" :span="4">
		    	<img :src="item.avatar">
		    </Col>
		    <Col class="topic-info" :span="14">
			    <p>{{ item.name }}</p>
			    <p><span class="num">{{ item.follows_count }}</span>关注 · <span class="num">{{ item.questions_count }}</span>问题 </p>
		    </Col>
		    <Col class="topic-action"
		         :span="6"
		         style="flex: 0 1 auto">
			    <div class="action-btn"
			         :class="{primary: !item.followed}" @click="handleFollow(item)">
			      <Icon :type="icon(item.followed).type"></Icon>
			      <span>{{ icon(item.followed).txt }}</span>
			    </div>
		    </Col>
		  </div>
		</div>
	</div>
	<div v-else>
		<!-- Topic is empty. -->
	    <img style="width: 80vw; left: 10vw;  position: fixed; top: 30vh;" :src="nothingImage" alt="" />
	</div>
</div>
</template>
<script>
import { NOTICE } from '../../../stores/types';
import { resolveImage } from '../../../utils/resource';
import { addAccessToken, createAPI } from '../../../utils/request';

const nothingImage = resolveImage(require('../../../statics/images/defaultNothingx2.png'));

export default {
  watch: {
  },
  data() {
    return ({
    	loading: true,
    	items: [],
    	nothingImage,
    })
  },
  computed: {
    itemLength () {
    	const { length } = this.items;
    	return length;
    }
  },
  methods: {
  	getUserQuestionTopics () {
	    addAccessToken().get(
	      createAPI(`user/question-topics`),
	      { validataStatus: status => status === 200 }
	    )
	    .then(({ data }) => {
	    	this.loading = false;
	    	data.forEach( function(item) {
	    		item.followed = true;
	    	});
	    	this.items = data;
	    })
	    .catch(error => {
	    	this.loading = false;
	    });
  	},
  	handleFollow (item) {
  	  let method = item.followed ? 'DELETE' : 'PUT';
      addAccessToken()({
        method,
        url: createAPI(`user/question-topics/${item.id}`),
        validateStatus: status => (status === 201 || status === 204)
      }).then(({status, data = { message: '操作成功！'} }) => {
      	if (method == 'DELETE') {
      		item.followed = false;
      		item.follows_count--;
      	} else {
      		item.followed = true;
      		item.follows_count++;
      	}
      }).catch(({response: {data: {message}}}) => {
        this.$Message.error(message);
      })
  	},
  	icon (followed) {
  	  if (followed) {
		      return { type: `checkmark`, txt: `已关注` };
  	  } else {
		      return { type: `plus`, txt: `关注` };
  	  }
  	}
  },
  created() {
  	this.getUserQuestionTopics();
  }
}

</script>

<style lang="scss">
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

.topic-item .ivu-row {
  padding: 15px 10px;
  height: 80px;
  background-color: #fff;
  border-bottom: 1px solid #dedede;
  [class*="load-"] {
    animation: loadingB 1.4s infinite linear;
  }
}

.topic-info {
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

.topic-avatar {
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

.topic-action {
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
