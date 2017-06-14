import { TOTALMESSAGELISTS,  TOTALMESSAGELIST, SYNCIMMESSAGE, MESSAGELISTS, CLEANNEWMESSAGE } from '../types';
import localEvent from '../localStorage';
import { getUserInfo } from '../../utils/user';
import lodash from 'lodash';

// const currentUser = localEvent.getLocalItem('UserLoginInfo');
const currentUser = window.TS_WEB.currentUserId;
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
		console.log(list);
		let oldState = state;
		// let time = list.time;
		let me = false;
		if(list.uid === currentUser) me = true;
		// 当前cid还不在会话列表中
		if(!lodash.keys(oldState.messageLists[`room_${list.cid}`]).length > 0) {
			oldState.messageLists[`room_${list.cid}`]  = {};
			window.TS_WEB.dataBase.transaction('rw', window.TS_WEB.dataBase.userbase, () => {
				let room = {};
				window.TS_WEB.dataBase.userbase.where('user_id').equals(list.uid).first( item => {
					if(!lodash.keys(item).length) {
						getUserInfo(list.uid).then( user => {
							room = {
								name: user.name,
								user_id: list.uid,
								avatar: user.avatar[30],
								lists: [],
								count: 0,
								cid: list.cid
							}
							oldState.messageLists[`room_${list.cid}`] = { 
								...oldState.messageLists[`room_${list.cid}`], 
								...room
							};
							if(!me) oldState.messageLists[`room_${list.cid}`].count += 1;
							let newList = { txt: list.txt, user_id: list.uid, time: list.time };
							oldState.messageLists[`room_${list.cid}`].lists = [ ...oldState.messageLists[`room_${list.cid}`].lists, newList ];
							state.messageLists = { ...state.messageLists, ...oldState.messageLists };
						});
					} else {
						room = {
							name: item.name,
							user_id: list.uid,
							avatar: item.avatar[30],
							lists: [],
							count: 0,
							cid: list.cid
						}
						oldState.messageLists[`room_${list.cid}`] = { 
							...oldState.messageLists[`room_${list.cid}`], 
							...room
						};
						if(!me) oldState.messageLists[`room_${list.cid}`].count += 1;
						let newList = { txt: list.txt, user_id: list.uid, time: list.time };
						oldState.messageLists[`room_${list.cid}`].lists = [ ...oldState.messageLists[`room_${list.cid}`].lists, newList ];
						state.messageLists = { ...state.messageLists, ...oldState.messageLists };
					}
				})
			})
			.catch( e => {
				console.log(e);
			});
		} else {
			if(!me) oldState.messageLists[`room_${list.cid}`].count += 1;
			let newList = { txt: list.txt, user_id: list.uid, time: list.time };
			oldState.messageLists[`room_${list.cid}`].lists = [ ...oldState.messageLists[`room_${list.cid}`].lists, newList ];
			state.messageLists = { ...state.messageLists, ...oldState.messageLists };
		}
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