<template>
	<div sadadsa style="margin-top:6px;">
		<!-- loading -->
	    <div id="spinner" v-show="loading">
	      <div id="spinner-parent">
	        <div class="spinner-double-bounce-bounce2" />
	        <div class="spinner-double-bounce-bounce1" />
	      </div>
	    </div>
	    <!-- loading end -->
        <mt-loadmore :auto-fill="false" :bottomPullText="`上拉加载更多`" :bottomDropText="`释放加载更多`" :top-method="loadTop" :bottom-method="loadBottom" :bottomAllLoaded="bottomAllLoaded" ref="loadmore" v-show="itemsLength">
			<div class="answer-container" v-for="item in items" :key='item.id'>
				<div class="answer-content">
					<p>{{ stringLimit(item.body) }}</p>
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
		                <timeago style="color: #ccc; font-size: 12px;" :since="timers(item.created_at, 8, false)" locale="zh-CN" :auto-update="60"></timeago>
					</span>
				</div>
			</div>
		</mt-loadmore>	
		<!-- Topic is empty. -->
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
      	limit: 10,
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
        loadData(merge = false) {
        	this.loading = true;
        	const { type, limit, items } = this;
        	let params = { type, limit };
        	if (merge) params.after = items[items.length-1].id;
            let uri = createAPI('user/question-answer');
            addAccessToken().get(uri, { params }).then(({ data = [] }) => {
                this.loading = false;
             	this.bottomAllLoaded = data.length < params.limit;
                if(merge) {
                    this.items = Array.from(new Set([...data, ...this.items]));
                    this.$refs.loadmore.onBottomLoaded();
                } else {
                    this.items = [...data];
                    this.$refs.loadmore.onTopLoaded();
                }
            }).catch(err => {
                this.loading = false;
                console.log(err);
            })
        },

        loadTop() {
            this.loadData();
        },

        loadBottom() {
            this.loadData(true);
        }
    },
    created() {
   	   this.type = this.$route.params.type || 'all';
   	   this.loadData();
    }
}
</script>
<style lang="scss">
		[sadadsa] {
		.mint-loadmore-bottom {
		    margin-bottom: -50px;
		}
	}
</style>
<style lang="less">
	.answer-container {
		border-top: 2px #ededed solid; 
		background-color: #ffffff;
		.answer-content {
			color: #666666;
			font-size: 14px;
			padding: 10px 15px;
			min-height: 28px;
			p{
				margin: 0;
				line-height: 1;
				max-height: 42px;
			}
		}
		.answer-operation {
			padding: 10px;
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