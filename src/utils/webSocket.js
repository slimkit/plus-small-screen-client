import {
	TOTALMESSAGELIST,
	IMSTATUS,
	UNREAD
} from '../stores/types';
import {
	app
} from '../index';
import {
	getImMessageItem
} from './localDatabase';
import localEvent from '../stores/localStorage';
import lodash from 'lodash';
import {
	getUserInfo
} from './user';
import {
	addAccessToken,
	createAPI,
	createOldAPI
} from './request';

const url = window.TS_WEB.socketUrl;
const im_token = window.TS_WEB.im_token;
const reg = /^\[\"(.*?);\",/;
const currentUser = localEvent.getLocalItem('UserLoginInfo');

function connect() {
	// 链接IM
	if (window.TS_WEB.socketUrl) { // 判断是否配置im聊天服务器,
		if (TS_WEB.webSocket && TS_WEB.webSocket.readyState != 1) { // 已经连接过,但是处于非链接状态
			try {
				window.TS_WEB.webSocket = new window.WebSocket(TS_WEB.webSocket.url);
				window.TS_WEB.webSocket.onopen = evt => {
					onOpen(evt);
				}
				window.TS_WEB.webSocket.onmessage = evt => {
					onMessage(evt);
				}
				window.TS_WEB.webSocket.onclose = evt => {
					onClose(evt);
				}
			} catch (e) {
				window.console.log(e);
			}
		} else if (TS_WEB.webSocket == null && TS_WEB.socketUrl) { // 还没有连接过, 直接新建链接
			addAccessToken().get(createOldAPI('im/users'), {}, {
					validateStatus: status => status === 200
				})
				.then(response => {
					let data = response.data.data;
					window.TS_WEB.im_token = data.im_password; // 保存im口令
					if (window.TS_WEB.socketUrl) {
						let socketUrl = `ws://${window.TS_WEB.socketUrl}?token=${data.im_password}`;
						try {
							window.TS_WEB.webSocket = new window.WebSocket(socketUrl);
							window.TS_WEB.webSocket.onopen = evt => {
								onOpen(evt);
							}
							window.TS_WEB.webSocket.onmessage = evt => {
								onMessage(evt);
							}
							window.TS_WEB.webSocket.onclose = evt => {
								onClose(evt);
							}
						} catch (e) {
							window.console.log(e);
						}
					}
				});
		}
	}


};

function onMessage(message) {
	let msg = message;
	let messagetype = msg.data.substr(0, 1); // 获取消息第一位判断消息类型
	let data = JSON.parse(msg.data.substr(1)); // 数据转换

	// 同步之前的消息
	if (messagetype == 3) {
		if (data[0] === 'convr.msg.sync' && data[1].length) {
			data[1].forEach((value, index) => {
				value.time = value.mid / 8388608 + 1451577600000;
				value.owner = window.TS_WEB.currentUserId;
				// 对比本地存储的会话，写入新会话
				window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.messagebase, window.TS_WEB.dataBase.chatroom, () => {
						// 查找我的最后一条消息
						window.TS_WEB.dataBase.messagebase.where('[cid+owner]').equals([value.cid, window.TS_WEB.currentUserId]).last(item => {
							if (item !== undefined) {
								if (value.seq > item.seq) {
									// 写入数据库
									window.TS_WEB.dataBase.messagebase.put(value);
									// 修改房间最后通话时间
									window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([value.cid, window.TS_WEB.currentUserId]).modify({
										last_message_time: value.time
									});
									window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([value.cid, window.TS_WEB.currentUserId]).first().then(items => {
										if (items !== undefined) {
											let uids = items.uids.split(',');
											let user_id = 0;
											if (uids[0] == window.TS_WEB.currentUserId) {
												user_id = uids[1];
											} else {
												user_id = uids[0];
											}

											let item = this.$storeLocal.get(`user_${user_id}`);
											if (item === undefined) {
												getUserInfo(user_id).then(user => {
													// 未读数 
													if (value.uid !== window.TS_WEB.currentUserId) { // 添加新消息
														app.$store.dispatch(UNREAD, cb => {
																cb({
																	cid: value.cid,
																	uid: value.uid,
																	name: user.name,
																	avatar: user.avatar,
																	targetUser: user_id
																});
															})
															.then(() => {
																app.$store.dispatch(TOTALMESSAGELIST, cb => {
																	cb(value);
																});
															});
													} else {
														app.$store.dispatch(TOTALMESSAGELIST, cb => {
															cb(value);
														});
													}

												})
											} else {
												// 未读数
												if (value.uid !== window.TS_WEB.currentUserId) { // 添加信息消息
													app.$store.dispatch(UNREAD, cb => {
															cb({
																cid: value.cid,
																uid: value.uid,
																name: item.name,
																avatar: item.avatar,
																targetUser: user_id
															});
														})
														.then(() => {
															app.$store.dispatch(TOTALMESSAGELIST, cb => {
																cb(value);
															});
														});
												} else {
													app.$store.dispatch(TOTALMESSAGELIST, cb => {
														cb(value);
													});
												}
											}
										}
									});
								}
							} else {
								// 写入数据库
								window.TS_WEB.dataBase.messagebase.put(value);
								// 更新时间
								window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([value.cid, window.TS_WEB.currentUserId]).modify({
									last_message_time: value.time
								});
								window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([value.cid, window.TS_WEB.currentUserId]).first().then(items => {
									if (items !== undefined) {
										let uids = items.uids.split(',');
										let user_id = 0;
										if (uids[0] == window.TS_WEB.currentUserId) {
											user_id = uids[1];
										} else {
											user_id = uids[0];
										}
										// 未读数
										// 获取目标用户
										let item = this.$storeLocal.get(`user_${user_id}`);

										if (item === undefined) {
											getUserInfo(user_id).then(user => {
												// 未读数
												if (value.uid !== window.TS_WEB.currentUserId) { // 添加新消息
													app.$store.dispatch(UNREAD, cb => {
															cb({
																cid: value.cid,
																uid: value.uid,
																name: user.name,
																avatar: user.avatar,
																targetUser: user_id
															});
														})
														.then(() => {
															app.$store.dispatch(TOTALMESSAGELIST, cb => {
																cb(value);
															});
														});
												} else {
													app.$store.dispatch(TOTALMESSAGELIST, cb => {
														cb(value);
													});
												}
											})
										} else {
											// 未读数
											if (value.uid !== window.TS_WEB.currentUserId) { // 添加新消息
												app.$store.dispatch(UNREAD, cb => {
														cb({
															cid: value.cid,
															uid: value.uid,
															name: item.name,
															avatar: item.avatar,
															targetUser: user_id
														});
													})
													.then(() => {
														app.$store.dispatch(TOTALMESSAGELIST, cb => {
															cb(value);
														});
													});
											} else {
												app.$store.dispatch(TOTALMESSAGELIST, cb => {
													cb(value);
												});

											}
										}
									}
								})
							}
						});
					})
					.catch(e => {
						console.log(e);
					})
			});
		}

		// 登录后同步最近10条消息的操作
		if (data[0] === 'auth' && data[1].seqs) {
			data[1].seqs.forEach(seq => {
				let msg = '2';
				let message = [
					'convr.msg.sync', {
						"cid": parseInt(seq.cid),
						"limit": 10,
						"order": 1 // 倒序获取最新10条消息
					}
				];
				msg += JSON.stringify(message);
				TS_WEB.webSocket.send(msg);
			});
		}

		if (data[0] === 'convr.msg') {
			let dbData = {
				seq: data[1].seq,
				mid: data[1].mid,
				time: data[1].mid / 8388608 + 1451577600000,
				owner: window.TS_WEB.currentUserId
			};
			window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.messagebase, window.TS_WEB.dataBase.chatroom, () => {
					// 修改本地消息
					window.TS_WEB.dataBase.messagebase.where('hash').equals(data[2]).modify(dbData);
					window.TS_WEB.dataBase.messagebase.where('hash').equals(data[2]).first().then(results => {
						// 提交到vuex
						app.$store.dispatch(TOTALMESSAGELIST, cb => {
							cb(results);
						});
						// 更改房间的最后消息时间
						window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([results.cid, window.TS_WEB.currentUserId]).modify({
							last_message_time: results.time
						});
					});
				})
				.catch(window.TS_WEB.dataBase.ModifyError, function(e) {
					// ModifyError did occur
					console.error(e.failures.length + " items failed to modify");
				}).catch(function(e) {
					console.error("Generic error: " + e);
				});
		}
	}
	if (messagetype == 2) {
		let dbMsg = data[1];
		delete dbMsg.type;
		dbMsg.time = dbMsg.mid / 8388608 + 1451577600000;
		dbMsg.hash = '';
		dbMsg.owner = window.TS_WEB.currentUserId;
		dbMsg.addCount = true;
		window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.messagebase, window.TS_WEB.dataBase.chatroom, () => {
			// 消息放入本地
			window.TS_WEB.dataBase.messagebase.put(dbMsg);
			// 修改房间最后消息时间
			window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([dbMsg.cid, dbMsg.owner]).modify({
				last_message_time: dbMsg.time
			})
		});
		// 提交到vuex
		let item = this.$storeLocal.get(`user_${dbMsg.uid}`);

		if (item !== undefined) {
			app.$store.dispatch(UNREAD, cb => {
					cb({
						cid: dbMsg.cid,
						uid: dbMsg.uid,
						name: item.name,
						avatar: item.avatar
					});
				})
				.then(() => {
					app.$store.dispatch(TOTALMESSAGELIST, cb => {
						cb(dbMsg);
					});
				})
		} else {
			getUserInfo(dbMsg.uid).then(user => {
				app.$store.dispatch(UNREAD, cb => {
						cb({
							cid: dbMsg.cid,
							uid: dbMsg.uid,
							name: user.name,
							avatar: user.avatar
						});
					})
					.then(() => {
						app.$store.dispatch(TOTALMESSAGELIST, cb => {
							cb(dbMsg);
						});
					})
			});
		}
	}
};

function onError(error) {

};

// 关闭事件
function onClose(evt) {
	app.$store.dispatch(IMSTATUS, cb => {
		cb({
			open: false
		})
	});
};

// 开启事件
function onOpen(evt) {
	app.$store.dispatch(IMSTATUS, cb => {
		cb({
			open: true
		})
	});
};

export {
	connect
}