<template>
	<div class="rank-item" @click="changeUrl(`/users/feeds/${userInfo.id}`)">
		<i class="rank-index">{{ rankIndex }}</i>
		<div class="rank-info">
			<user-avatar :sex='userInfo.sex' :src='userInfo.avatar || null' />
			<div class="user-info">
				<p class="user-name">{{ userInfo.name }}</p>
				<p class="user-num">{{ `${countTitle}` }}</p>
			</div>
		</div>
		<div class="rank-follow">
            <div class="actionButton" @click.stop="handleFollowingStatus(followAction.status)">
                <FollowingIcon v-if="followAction.text == '已关注'" height="24" width="24" color="#59b6d7" />
                <UnFollowingIcon v-if="followAction.text == '关注'" height="24" width="24" color="#333" />
                <EachFollowingIcon v-if="followAction.text == '相互关注'" height="24" width="24" color="#59b6d7" />
            </div>
        </div>
	</div>
</template>

<script>
import FollowingIcon from '../../icons/Following';
import UnFollowingIcon from '../../icons/UnFollowing';
import EachFollowingIcon from '../../icons/EachFollowing';
import { followingUser, unFollowingUser } from '../../utils/user';
import { resolveImage } from '../../utils/resource';
import { changeUrl } from '../../utils/changeUrl';

const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
	export default {
		name: 'rank-item',
		components: {
			FollowingIcon,
			UnFollowingIcon,
			EachFollowingIcon,
		},
		props: ['person'],
		data(){
			return({
				follower: false,
	        	ollowing: false,
			})
		},
		computed: {
			rankIndex(){
				const { extra: { rank }} = this.person;
				return rank;
			},
			userInfo(){
				let { id, avatar, name, extra, sex } = this.person;
				return ({ id, avatar, name, sex, extra }); 
			},
			followAction() {
				let { following, follower } = this;
	            if (following && follower) {
	                return {
	                    status: true,
	                    text: '相互关注'
	                };
	            }
	            if (!follower) {
	                return {
	                    status: false,
	                    text: '关注'
	                }
	            }
	            if (!following && follower) {
	                return {
	                    status: true,
	                    text: '已关注'
	                }
	            }
        	},
        	countTitle(){
        		let { type } = this.$route.query;
        		let { extra } = this.person;
        		let title = '';

        		if (type === 'followers') {
        			title = `粉丝数：${ extra.followers_count }`;
        		} else if (type === 'checkin') {
        			title = `连续签到：${ extra.last_checkin_count }`;
        		} else if (type === 'likes') {
        			title = `问答点赞量：${ extra.likes_count }`;
        		} else if (type === 'dayQuestion' || type === "weekQuestion" || type === "monthQuestion") {
        			title = `回答量：${ extra.answers_count }`;
        		} else if (type === 'dayFeed' || type === "weekFeed" || type === "monthFeed") {
        			title = `点赞量：${ extra.likes_count }`;
        		} else if (type === 'dayNews' || type === "weekNews" || type === "monthNews") {
        			title = `浏览量：${ extra.count }`;
        		}

        		return title;
        	}
		},
		methods: {
			changeUrl,
			handleFollowingStatus(status) {
	            // 关注操作
	            if (status) {
	                // 取关
	                this.handleUnfollowing();
	            } else {
	                // 加关注
	                this.handleFollowing();
	            }
	        },
	        // 取关操作
	        handleUnfollowing() {
	            unFollowingUser(this.person.id)
	                .then(status => {
	                    if (status) {
	                      this.follower = false;
	                    } else {
	                      this.$Message.warning('取关失败,可能是还没关注');
	                    }
	                });
	        },
		    // 关注操作
	        handleFollowing() {
	            followingUser(this.person.id)
                .then(status => {
                    if (status) {
                        this.follower = true;
                    } else {
                    	this.$Message.warning('关注失败,可能是已经关注了');
                    }
                })
	        },
		},
		created(){
		  const { follower, following } = this.person;
		  this.follower = follower;
		  this.following = following;
		}
	}
</script>

<style lang="less">
	.rank-item{
		display: flex;
		align-items: center;
		background-color: #fff;
		border-bottom: 1px solid #ededed;
		padding: 15px;
		&:nth-child(2),
		&:nth-child(3),
		&:nth-child(4){
			.rank-index{
				color: #59b6d7;
			}
		}
		.rank-index{
			font-style: normal;
			font-size: 17px;
			color: #999;
		}
		.rank-info{
			flex: 1 1 auto;
			display: flex;
			padding: 0 25px;
			align-items: center;
			.user-header{
				overflow: hidden;
				width: 38px;
				height: 38px;
				border-radius: 50%;
				img{
					width: 100%;
					object-fill: cover;
				}
			}
			.user-info{
				margin-left: 15px;
				font-size: 14px;
				color: #999;
				display: flex;
				flex-direction: column;
				justify-content: center;
				p{
					margin: 0;
				}
				.user-name{
					font-size: 15px;
					color: #333;
					margin-bottom: 9px;
				}
			}
		}
	}
</style>