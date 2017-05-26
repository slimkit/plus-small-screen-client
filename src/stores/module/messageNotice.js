import { MESSAGENOTICE, CLEANMESSAGE } from '../types';

const state = {
	messageCount: {
		fans: 0,
		message: 0,
		comments: 0,
		notices: 0
	}
};

const mutations = {
	[MESSAGENOTICE] (state, messageCount) {
		state.messageCount = { ...state.messageCount, ...messageCount };
	},
	[CLEANMESSAGE] (state, cleanData) {
		state.messageCount = { ...state.messageCount, [cleanData] : 0 };
	}
};

const actions = {
	[MESSAGENOTICE]: (context, cb) => {
		cb( message => {
			context.commit(MESSAGENOTICE, message);
		})
	},
	[CLEANMESSAGE]: (context, cb) => {
		cb( cleanData => {
			context.commit(CLEANMESSAGE, cleanData)
		});
	}
};

const getters = {
	[MESSAGENOTICE]: state => {
		return state.messageCount;
	}
};

const store = {
	state,
	mutations,
	actions,
	getters
};

export default store;