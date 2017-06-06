import { TOTALMESSAGELISTS,  TOTALMESSAGELIST, SYNCIMMESSAGE, MESSAGELISTS, CLEANNEWMESSAGE } from '../types';
import localEvent from '../localStorage';
import { getUserInfo } from '../../utils/user';
import lodash from 'lodash';
import { localDatabase } from '../../utils/localDatabase';

const state = {
	messageLists: {}
};

const mutations = {
	// 清除消息数量提示
	[CLEANNEWMESSAGE] (state, cid) {
		let oldState = state;
		if(lodash.keys(oldState.messageLists[`room_${cid}`]).length) {
			oldState.messageLists[`room_${cid}`].count = 0;
			state.messageLists = { ...state.messageLists, ...oldState.messageLists };
		}
	},
	// signal user chat
	[TOTALMESSAGELIST] (state, list) {
		let oldState = state;
		let time = !list[1].me ? list[1].mid / 8388608 + 1451577600000 : list[1].ext.time;
		if(!lodash.keys(oldState.messageLists[`room_${list[1].cid}`]).length > 0) {
			oldState.messageLists[`room_${list[1].cid}`]  = {};
			let room = {};
			let target_user_id = !list[1].me ? list[1].ext.to_uid : list[1].uid;
			// hash = list[1].me ? list[1].ext.hash : list[1].hash;
			room = {
				name: list[1].name,
				user_id: target_user_id,
				cid: list[1].cid,
				avatar: list[1].avatar,
				lists: [],
				count: !list[1].me ? 1 : 0
			};
			oldState.messageLists[`room_${list[1].cid}`] = { 
				...oldState.messageLists[`room_${list[1].cid}`], 
				...room
			};
		} else {
			if(!list[1].me) oldState.messageLists[`room_${list[1].cid}`].count += 1;
			// hash = list[1].ext.hash;
		}
		let newList = { txt: list[1].txt, user_id: list[1].uid, time };
		oldState.messageLists[`room_${list[1].cid}`].lists = [ ...oldState.messageLists[`room_${list[1].cid}`].lists, newList ];
		state.messageLists = { ...state.messageLists, ...oldState.messageLists };
	},
	// 通过接口增加聊天对话
	[MESSAGELISTS] (state, list) {
	 	let oldState = state;
	 	if(!lodash.keys(oldState.messageLists[`room_${list.cid}`]).length > 0) {
	 		let user = {};
			oldState.messageLists[`room_${list.cid}`] = { 
				...oldState.messageLists[`room_${list.cid}`], 
				...{
					name: list.name,
					user_id: list.user_id,
					cid: list.cid,
					avatar: list.avatar,
					lists: list.lists,
					count: 0
				}
			};
	 	}
		state.messageLists = { ...state.messageLists, ...oldState.messageLists };
	},

	[SYNCIMMESSAGE] (state, list) {
		let oldState = state;
		let time = list.mid / 8388608 + 1451577600000;
		if(!lodash.keys(oldState.messageLists[`room_${list.cid}`]).length > 0) {
			let user = {};
			oldState.messageLists[`room_${list.cid}`] = {
				name: '',
				user_id: list.uid,
				cid: list.cid,
				avatar: '',
				lists: []
			};
			user = localEvent.getLocalItem(`user_${list.uid}`);
			if(!lodash.keys(user).length > 0) {
				getUserInfo(list.uid, 30).then( u => {
					oldState.messageLists[`room_${list.cid}`].name = u.name;
					oldState.messageLists[`room_${list.cid}`].avatar = u.avatar[30];
				});
			} else {
				oldState.messageLists[`room_${list.cid}`].name = user.name;
				oldState.messageLists[`room_${list.cid}`].avatar = user.avatar[30];
			}
		}
		oldState.messageLists[`room_${list.cid}`].lists = [ ...oldState.messageLists[`room_${list.cid}`].lists, { txt: list.txt, user_id: list.uid, time } ];
		oldState.messageLists[`room_${list.cid}`].lists = Array.from(new Set(oldState.messageLists[`room_${list.cid}`].lists));
		state.messageLists = { ...state.messageLists, ...oldState.messageLists };
	},

	[TOTALMESSAGELISTS] (state, lists) {
		return state.messageLists;
	}
};

const actions = {
	[CLEANNEWMESSAGE]: ( context, cb) => {
		cb( cid => {
			context.commit(CLEANNEWMESSAGE, cid);
		});
	},
	[TOTALMESSAGELIST]: (context, cb) => {
		cb( list => {
			context.commit(TOTALMESSAGELIST, list);
		})
	},
	[TOTALMESSAGELISTS]: (context, cb) => {
		cb( lists => {
			context.commit(TOTALMESSAGELISTS, lists);
		})
	},
	[SYNCIMMESSAGE]: (context, cb) => {
		cb( list => {
			context.commit(SYNCIMMESSAGE, list);
		})
	},
	[MESSAGELISTS]: (context, cb) => {
		cb (list => {
			context.commit(MESSAGELISTS, list);
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