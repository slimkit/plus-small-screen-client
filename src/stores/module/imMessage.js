import { TOTALMESSAGELISTS } from '../types';
import localEvent from '../localStorage';
import { getUserInfo } from '../../utils/user';
import lodash from 'lodash';

/**
 * messageLists: {
 * 	room_cid: {
 *		name: 'xxx',
 * 		user_id: 0,
 *		cid: 111,
 *		avatar: '',
 *		lists: {
 *			[
 *				txt: 'content',
 *				user_id: 1
 *			]
 *		}	
 *	}
 * }
 */
const state = {
	messageLists: {}
};

const mutations = {
	// signal user chat
	[TOTALMESSAGELISTS] (state, list) {
		let oldState = state;
		if(!lodash.keys(oldState.messageLists[`room_${list[1].cid}`]).length > 0) {
			let user = {};
			let target_user_id = list[1].me ? list[1].ext.to_uid : list[1].uid;
			oldState.messageLists[`room_${list[1].cid}`] = {
				name: '',
				user_id: target_user_id,
				cid: list[1].cid,
				avatar: '',
				lists: []
			};
			user = localEvent.getLocalItem(`user_${target_user_id}`);
			if(!lodash.keys(user).length > 0) {
				getUserInfo(target_user_id, 30).then( u => {
					oldState.messageLists[`room_${list[1].cid}`].name = u.name;
					oldState.messageLists[`room_${list[1].cid}`].avatar = u.avatar[30];
				});
			} else {
				oldState.messageLists[`room_${list[1].cid}`].name = user.name;
				oldState.messageLists[`room_${list[1].cid}`].avatar = user.avatar[30];
			}
		}
		// save localMessages
		let localMsgs = localEvent.getLocalItem(`user_msg_room_${list[1].cid}`);
		localMsgs = [ ...localMsgs, { user_id: list[1].uid, txt: list[1].txt } ];
		localEvent.setLocalItem(`user_msg_room_${list[1].cid}`, localMsgs);

		oldState.messageLists[`room_${list[1].cid}`].lists = [ ...oldState.messageLists[`room_${list[1].cid}`].lists, { txt: list[1].txt, user_id: list[1].uid } ];
		state = { ...state, ...oldState };
	}
};

const actions = {
	[TOTALMESSAGELISTS]: (context, cb) => {
		cb( list => {
			context.commit(TOTALMESSAGELISTS, list);
		})
	}
};

const getters = {

};

const store = {
	state,
	mutations,
	actions,
	getters
};

export default store;