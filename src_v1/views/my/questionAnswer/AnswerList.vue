<template>
	<div root>
		<!-- loading -->
	    <div id="spinner" v-show="loading">
	      <div id="spinner-parent">
	        <div class="spinner-double-bounce-bounce2" />
	        <div class="spinner-double-bounce-bounce1" />
	      </div>
	    </div>
	    <!-- loading end -->
      <div style="height: 100%; overflow: auto;">
        <mt-loadmore :auto-fill="false" :bottomPullText="`上拉加载更多`" :bottomDropText="`释放加载更多`" :top-method="loadTop" :bottom-method="loadBottom" :bottomAllLoaded="bottomAllLoaded" ref="loadmore" v-show="itemsLength">
    			<div class="answer-container" v-for="item in items" :key='item.id'>
    				<div @click="handleClickComment(item.id)" class="answer-content">
  			       {{answerBody( getPureContent(item.body) ) }}
    				</div>
    				<div class="answer-operation">
  				    <div class="answer-action">
  				    	<div class="feed-tool-item feed-like">
  				        	<DiggIcon v-if="item.liked" width="21" height="21" color="#f4504d" @click.native="handleDigg(item.liked, item.id)"/>
  				        	<UnDiggIcon v-else width="21" height="21" color="#999" @click.native="handleDigg(item.liked, item.id)"/>
  				        	<span class="count feed-like-count">{{ item.likes_count }}</span>
  					    </div>
  					    <div class="feed-tool-item feed-comment" @click="handleClickComment(item.id)">
  					        <CommentIcon width="21" height="21" color="#999" />
  					        <span class="count feed-comment-count">{{ item.comments_count }}</span>
  					    </div>
  				    </div>
  				    <span>
  		          <timeago style="color: #ccc; font-size: 12px;" :since="timers(item.created_at, 8, false)" locale="zh-CN" :auto-update="60" />
    					</span>
    				</div>
    			</div>
    		</mt-loadmore>
      </div>	
	    <img v-show="!loading && !itemsLength"style="width: 80vw; left: 10vw;  position: fixed; top: 30vh;" :src="nothingImage"/>
	</div>
</template>
<script>
import { createAPI, addAccessToken } from '../../../utils/request';
import timers from '../../../utils/timer';
import CommentIcon from '../../../icons/Comment';
import DiggIcon from '../../../icons/Digg';
import UnDiggIcon from '../../../icons/UnDigg';
import { resolveImage } from '../../../utils/resource';
import getPureContent from '../../../utils/getPureContent';
import markdownIt from 'markdown-it';
import _ from 'lodash';

const md = markdownIt();
const nothingImage = resolveImage(require('../../../statics/images/defaultNothingx2.png'));

export default {
    name: "rank-show",
    components: {
    	CommentIcon,
    	DiggIcon,
		UnDiggIcon,
    },
    data() {
      return({
      	loading: false,
      	items: [],
      	type: null,
      	limit: 20,
      	nothingImage,
        bottomAllLoaded: false,
      })
    },
    watch: {
   	  '$route' (to) {
        this.type = to.params.type;
   	  	this.loadData();
   	  },
    },
    computed: {
      itemsLength () {
      	const { length } = this.items;
      	return length;
      },
      bottomPullText () {
      	return this.bottomAllLoaded ? '没有更多了' : '上拉加载更多';
      }
    },
    methods: {
   	  timers,
      getPureContent,
      getPureText (str) {
        return ( (md.render(str)).replace(/<\/?.+?>/g,"") ).replace(/ /g,"");
      },
      answerBody (body) {
        if(!body) return '';
        return this.getPureText(body);
      },
      stringLimit (str){
      	return str.length > 75 ? 
      	str.substring(0, 71) + "..." :
      	str;
      },
      handleDigg (bool, id) {
      	let url = createAPI(`question-answers/${id}/likes`);
      	if (bool) {
	        addAccessToken().delete(url)
	        .then(({ data = [] }) => {
	        	this.byIdUpdateDigg(id, bool);
	        })
	        .catch(err => {
	          
	        });
      	} else {
	        addAccessToken().post(url)
	        .then(({ data = [] }) => {
	        	this.byIdUpdateDigg(id, bool);
	        })
	        .catch(err => {
	          console.log(err);
	        });
      	}
      },
      byIdUpdateDigg (id, type) {
      	this.items.forEach( function(item) {
  		  if (item.id == id) {
  		    type ? item.likes_count-- : item.likes_count++;
  		    item.liked = (type ? false : true);
  		  }
      	});
      },
      handleClickComment(id) {
      	this.$router.push({path:`/questions/answers/${id}`});
      },
      /**
       * 加载数据
       * @param  {Boolean} merge
       */
      loadData(u = 'new') {
        if (u === 'loadmore' && this.bottomAllLoaded) {
          this.$refs.loadmore.onBottomLoaded();

          return;
        }

        if (u === 'new') this.loading = true;
      	const { type, limit, items } = this;

      	let params = { type, limit };

      	if (u === 'loadmore') params.after = items[items.length-1].id ;

        let uri = createAPI('user/question-answer');
        addAccessToken().get(uri, { params }).then(({ data = [] }) => {

          this.loading = false;
         	this.bottomAllLoaded = (data.length < params.limit) ? true : false;

            if (u === 'loadnew') {
                this.items = _.uniqBy([...data, ...this.items], 'id');
                this.$refs.loadmore.onTopLoaded();
            } else if ( u === 'new') {
                this.items = [...data];
            } else {
              this.items = [
                ...this.items,
                ...data
              ];
              this.$refs.loadmore.onBottomLoaded();
            }
          }).catch(err => {
              this.loading = false;
              console.log(err);
          })
        },

        loadTop() {
            this.loadData('loadnew');
        },

        loadBottom() {
            this.loadData('loadmore');
        }
    },
    created() {
   	   this.type = this.$route.params.type || 'all';
   	   this.loadData('new');
    }
}
</script>
<style lang="less">
  [root] {
    height: calc(~"100vh - 86px");
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .mint-loadmore-bottom {
        margin-bottom: -50px;
    }
  }
	.answer-container {
    padding-top: 10px;
		border-bottom: 5px #f4f5f5 solid; 
		background-color: #ffffff;
    &:last-child {
      border-bottom: none;
    }
		.answer-content {
			color: #666;
			font-size: 14px;
			margin: 0 15px 10px 15px;
      text-align: initial;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
			p{
				margin: 0;
				line-height: 1;
				max-height: 42px;
			}
		}
		.answer-operation {
			padding: 10px 15px;
			border-top: 1px #ededed solid; 
			display: flex;
			justify-content: space-between;
			align-items: center;
			.answer-action{
				flex: 1 1 auto;
				display: flex;
				.feed-tool-item:not(:first-child){
					margin-left: 30px;
				}
			}
			> :last-child{

			}
		}
	}
</style>