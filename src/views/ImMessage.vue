<template>
	<div class="imMessage">
		<div class="commonHeader">
      <Row :gutter="16">
        <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          {{targetUser.name}}
        </Col>
        <Col span="5" style="display: flex;">
          <MoreIcon width="21" height="21" color="#333" />
        </Col>
      </Row>
    </div>
		<div class="messageList">
			<Row :gutter="16">
				<Col span="19">
					<Input  v-model="message.content" placeholder="say anything" :autosize="{minRows: 1,maxRows: 4}" />
				</Col>

				<Col span="5">
					<Button :long="true" type="primary" size="small" @click.native="sendmsg()">发送</Button>
				</Col>
			</Row>
		</div>
		<div class="sendBox">
			
		</div>
	</div>
</template>

<script>
	import { getUserInfo } from '../utils/user';
	import localEvent from '../stores/localStorage';
	import { NOTICE, TOTALMESSAGELISTS } from '../stores/types';
	import MoreIcon from '../icons/More';
	import BackIcon from '../icons/Back';
	import lodash from 'lodash';
	import { goTo, changeUrl } from '../utils/changeUrl';
	import { connect } from '../utils/webSocket';

	const imMessage = {
		components: {
			MoreIcon,
			BackIcon
		},
		data: () => ({
			targetUser: { 

			},
			currentUser: 0,
			userInfo: {},
			cid: 0,
			user_id: 0,
			message: {
				content: ''
			}
		}),
		methods: {
			goTo,
			changeUrl,
			sendmsg() {
				let msg = '2';
				let message = [
					'convr.msg',
					{
				    "cid": parseInt(this.cid), // 要发送到对话的ID， 无符号长整型，必填
				    "type": 0, // 消息的类型，无符号整型，可选，默认0；范围0-255
				    "txt": this.message.content, // 消息的文本内容，字符串，可选，默认空字符串
				    "ext": {to_uid: parseInt(this.user_id)}, // 消息的扩展，可以是字符串、集合、键值对，可选，默认空字符串
				    "rt": false, // 是否实时消息，可选，默认false
					}
				];
				msg += JSON.stringify(message);
				if(TS_WEB.webSocket.readyState != 1) {
					connect(TS_WEB.webSocket.url);
					setTimeout(() => {
						if(TS_WEB.webSocket.readyState == 1) {
							this.sendmsg();
						}
					}, 1000);
				} else {
					TS_WEB.webSocket.send(msg);

					this.$store.dispatch(TOTALMESSAGELISTS, cb => {
						cb([
							'localmessage',
							{
								cid: this.cid,
								uid: this.currentUser,
								ext: { to_uid: parseInt(this.user_id) },
								txt: this.message.content,
								me: true
							}
						])
					})
				}
			}
		},
		computed: {

		},
		created () {
			// target user_id 
			let targetUserId = this.user_id = this.$route.params.user_id;
			this.cid = this.$route.params.cid;
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
			let targetUser = localEvent.getLocalItem(`user_${targetUserId}`);
			if(!lodash.keys(targetUser).length > 0) {
				getUserInfo(targetUserId, 20).then( user => {
					this.targetUser = { ...this. targetUser, ...user };
				})
			} else {
				this.targetUser = { ...this.targetUser, ...targetUser };
			}

			// load current user info
			let currentUser = localEvent.getLocalItem('UserLoginInfo');
			this.currentUser = currentUser.user_id;
			let userInfo = localEvent.getLocalItem(`user_${currentUser.user_id}`);
			if(!lodash.keys(userInfo).length > 0) {
				getUserInfo(currentUser.user_id, 20).then( user => {
					this.userInfo = { ...this.userInfo, ...user };
				});
			} else {
				this.userInfo = { ...this.userInfo, ...userInfo };
			}



		}
	}

	export default imMessage;
</script>