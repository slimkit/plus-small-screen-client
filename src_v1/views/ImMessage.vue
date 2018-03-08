<template>
	<div class="imMessage">
		<div class="commonHeader">
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          {{targetUser.name}}
        </Col>
        <Col span="5" class="header-end-col">
          <!-- <MoreIcon width="21" height="21" color="#333" /> -->
        </Col>
      </Row>
    </div>
		<div class="messageList" id="messagelists">
			<div class="message" v-for="msg in messagelists">
				<div class="hemessage" v-if="msg.user_id !== currentUser" >
					<img :src="room.avatar" class="avatar">
					<div class="content">
						<h5 class="name">{{room.name}}</h5>
						<div class="msg-content"> 
							{{msg.txt}}
						</div>
					</div>
				</div>
				<div class="mymessage" v-if="msg.user_id == currentUser" >
					<div class="content">
						<h5 class="name">{{userInfo.name}}</h5>
						<div class="msg-content"> 
							{{msg.txt}}
						</div>
					</div>
					<img :src="myAvatar" alt="" class="avatar">
				</div>
			</div>
		</div>
		<div class="sendBox">
			<Row :gutter="16" style="width: 100%;">
				<Col span="20">
					<Input v-childfocus :maxLength="255" type="textarea" class="commentInput" v-model="message.content" placeholder="say anything" :autosize="{minRows: 1,maxRows: 4}" />
				</Col>

				<Col span="4">
					<Button size="small" class="sendButton" :long="true" :disabled="canSend" type="primary" @click.native="sendmsg()">发送</Button>
				</Col>
			</Row>
		</div>
	</div>
</template>

<script>
	import { getUserInfo } from '../utils/user';
	import localEvent from '../stores/localStorage';
	import { NOTICE, TOTALMESSAGELISTS, TOTALMESSAGELIST, CLEANNEWMESSAGE } from '../stores/types';
	import MoreIcon from '../icons/More';
	import BackIcon from '../icons/Back';
	import lodash from 'lodash';
	import { goTo, changeUrl } from '../utils/changeUrl';
	import { connect } from '../utils/webSocket';
	import { getDatas } from '../utils/localDatabase';
	import { mapState, mapGetters } from 'vuex';

	const imMessage = {
		components: {
			MoreIcon,
			BackIcon
		},
		data: () => ({
			targetUser: { 

			},
			currentUser: window.TS_WEB.currentUserId,
			userInfo: {},
			cid: 0,
			user_id: 0,
			message: {
				content: '',
				max_id: 0
			}
		}),
		methods: {
			goTo,
			changeUrl,
			sendmsg() {
				let msg = '2';
				let time = (new Date()).getTime();
				let hash = time + '_' +this.user_id;
				let message = [
					'convr.msg',
					{
				    "cid": this.cid, // 对话id
				    "type": 0, // 消息的类型，私密消息
				    "txt": this.message.content, // 消息的文本内容，字符串，可选，默认空字符串
				    "rt": false, // 非实时消息
					},
					hash
				];
				msg += JSON.stringify(message);
				if(!TS_WEB.webSocket) {
					this.$store.dispatch(NOTICE, cb => {
						cb({
							show: true,
							time: 1500,
							status: false,
							text: '链接出错,可能是没有配置聊天服务器'
						});
					})
					return false;
				}
				if(TS_WEB.webSocket.readyState != 1) {
					connect();
					setTimeout(() => {
						if(TS_WEB.webSocket.readyState == 1) {
							this.sendmsg();
						}
					}, 1000);
				} else {
					TS_WEB.webSocket.send(msg);
					let dbMsg = {
							cid: this.cid,
							uid: this.currentUser,
							txt: this.message.content,
							hash,
							mid: 0,
							seq: -1,
							time: 0,
							owner: window.TS_WEB.currentUserId
						};
					window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.messagebase, () => {
						window.TS_WEB.dataBase.messagebase.put(dbMsg);
					})
					.catch (function (e) {
				    console.error("Generic error: " + e);
					});
					this.message.content = '';
				}
			}
		},
		computed: {
			room() {
				let messagelist = this.$store.getters[TOTALMESSAGELISTS];
				const key = `room_${this.cid}`;
				const { [key]: room = {} } = messagelist;
				return room;
			},
			messagelists () {
				const { lists = [], count = 0 } = this.room;
				this.$nextTick( function () {
					// 在当前会话时，清除当前会话的message提示数量
					if(count != 0) {
						this.$store.dispatch(CLEANNEWMESSAGE, cb => {
							cb(this.cid);
						})
					}
					window.scrollTo(0,document.body.scrollHeight)
				});
				return lists;
			},
			myAvatar () {
				const { avatar = '' } = this.userInfo;
				return avatar;
			},
			canSend () {
				let message = this.message.content;
				message = message.replace(/(^\s*)|(\s*$)/g,"");
				message = message.replace(" ","");
				if(!message.length) {
					return true;
				} else {
					return false;
				}
			}
		},
		created () {
			// target user_id 
			let targetUserId = this.user_id = this.$route.params.user_id;
			this.cid = parseInt(this.$route.params.cid);
			if(!targetUserId) {
				this.$store.dispatch(NOTICE, cb => {
					cb({
						text: 'got some errors',
            time: 1500,
            status: false,
            show: true
					})
				});
				// miss main param, go back
				setTimeout( () => {
					this.$router.go(-1);
				}, 1600);
				return;
			}
			// load target user info;
			let itemTarget = this.$storeLocal.get(targetUserId);

			if(itemTarget !== undefined) {
				this.targetUser = { ...itemTarget };
			} else {
				getUserInfo(targetUserId, 30).then( user => {
					this.targetUser = { ...user };
				})
			}

			// load logged on userinfo
			
			let item = this.$storeLocal.get(window.TS_WEB.currentUserId);
			if(item !== undefined) {
				this.userInfo = { ...item };
			} else {
				getUserInfo(window.TS_WEB.currentUserId, 30).then( user => {
					this.userInfo = { ...user };
				})
			}
		}
	}

	export default imMessage;
</script>

<style lang="less" scoped>
	.commonHeader {
		height: 46px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
	.message {
		margin: 2vh 0;
	}
	.mymessage, .hemessage {
		display: flex;
		align-items: flex-start;
	}
	.hemessage {
		.msg-content {
			padding: 2vw;
		  	max-width: 60vw;
		  	background: #ededed;
		  	color: #333;
		  	border-radius: 0 10px 10px 10px;
		  	float: left;
		  	word-break: break-all;
		}
		.content {
			text-align: left;
			padding-right: 2vw;
		}
		.name {
			text-align: left;
		}
	}
	.mymessage {
		.msg-content {
			padding: 2vw;
		  max-width: 60vw;
		  background: #59b6d7;
		  color: #333;
		  border-radius: 10px 0px 10px 10px;
		  float: right;
		  word-break: break-all;
		}
		.content {
			text-align: right;
			padding-left: 2vw;
		}
		.name {
			text-align: right;
		}
	}
	.content {
		width: 84vw;
    display: inline-block;
    .name{
			color: #999;
	    font-weight: normal;
	    line-height: 1.8;
		}
	}
	.avatar {
		padding: 0px 2vw;
	  	width: 16vw;
	  	border-radius: 50%;
	  	height: 12vw;
	}
	.sendBox {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 7vh;
		max-height: 30vh;
		padding: 1vh 0;
		background: #fff;

	}
	.messageList {
		padding-top: 9vh;
		padding-bottom: 7vh;
	}
</style>