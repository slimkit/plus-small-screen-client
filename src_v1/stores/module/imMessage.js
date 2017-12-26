import { TOTALMESSAGELISTS,  TOTALMESSAGELIST, SYNCIMMESSAGE, MESSAGELISTS, CLEANNEWMESSAGE, UNREAD, MESSAGEROOMS } from '../types';
import localEvent from '../localStorage';
import { getUserInfo } from '../../utils/user';
import lodash from 'lodash';

const currentUser = window.TS_WEB.currentUserId;

const state = {
	messageLists: {}
};

const mutations = {
	// 添加聊天对话
	[MESSAGEROOMS] (state, { index, data }) {
		state.messageLists = { ...state.messageLists, [index]: data };
	},

	[UNREAD] (state, {index, room}) {
		state.messageLists = { ...state.messageLists, [index]: room };
	},
	// 清除消息数量提示
	[CLEANNEWMESSAGE] (state, cid) {
		let oldState = state;
		if(lodash.keys(oldState.messageLists[`room_${cid}`]).length) {
			oldState.messageLists[`room_${cid}`].count = 0;
			state.messageLists = { ...state.messageLists, ...oldState.messageLists };
		}
	},
	// signal user chat
	[TOTALMESSAGELIST] (state, {index, room}) {
		state.messageLists = {
			...state.messageLists,
			[index]: room
		}
	},
	// 同步本地数据
	[MESSAGELISTS] (state, list) {
		const index = `room_${list.cid}`;
		state.messageLists = {
			...state. messageLists,
			[index]: list
		}
	},
};

const actions = {
	// 添加聊天房间, 数据需要在提交到action之前先处理
	[MESSAGEROOMS]: (context, cb) => {
		cb( data => {
			let index = `room_${data.cid}`;
			context.commit(MESSAGEROOMS, { index, data });
		})
	},

	// 未读数
	[UNREAD]: (context, cb) => {
		return new Promise( (resolove, reject) => {
			cb( (roomInfo) => {
				const index = `room_${roomInfo.cid}`;
				let { messageLists } = context.state;
				if(messageLists[index] === undefined) {
					const room = {
						user_id: roomInfo.targetUser,
						lists: [],
						count: 1,
						cid: roomInfo.cid,
						name: roomInfo.name,
						avatar: roomInfo.avatar
					};
					context.commit(UNREAD, {index, room});
					return;
				}
				let { [index]: room } = messageLists;
				room.count += 1;
				context.commit(UNREAD, {index, room});
				resolove();
			});
		});
	},

	// 清理未读数
	[CLEANNEWMESSAGE]: ( context, cb) => {
		cb( cid => {
			context.commit(CLEANNEWMESSAGE, cid);
		});
	},

	// 增加消息
	[TOTALMESSAGELIST]: (context, cb) => {
		cb( list => {
			let me = false;
			let count = 0;
			if(list.uid === currentUser) {
				me = true;
			}

			const { cid, uid: listUID } = list;
			const index = `room_${cid}`;
			let { messageLists } = context.state;
			if (messageLists[index] === undefined) { // 房间不存在
				const room = {
					user_id: listUID,
					lists: [
						{ txt: list.txt, user_id: listUID, time: list.time }
					],
					count: me ? 0 : 1,
					cid: cid
				};
				context.commit(TOTALMESSAGELIST, {index, room});
				return
			}
			// 房间已经存在
			let { [index]: room } = messageLists;
			room.lists = [
				...room.lists,
				{ txt: list.txt, user_id: listUID, time: list.time }
			];
			context.commit(TOTALMESSAGELIST, {index, room});
		})
	},

	// 同步本地数据
	[MESSAGELISTS]: (context, cb) => {
		cb (list => {
			const index = `room_${list.cid}`;
			const { messageLists } = context.state; 
			if( messageLists[index] === undefined) {
				list.count = 0;
				context.commit(MESSAGELISTS, list);
			} 
		})
	}
};

const getters = {
	[TOTALMESSAGELISTS]: state => {
		return state.messageLists;
	}
};

const store = {
	state,
	mutations,
	actions,
	getters
};

export default store;