import { MESSAGENOTICE, CLEANMESSAGE } from '../types';

const state = {
	messageCount: {
		fans: 0,
		message: 0,
		comments: {
			count: 0,
			uids: [],
			time: ''
		},
		notices: 0,
		diggs: {
			count: 0,
			uids: [],
			time: ''
		}
	}
};

const mutations = {
	[MESSAGENOTICE] (state, messageCount) {
		state.messageCount = { ...state.messageCount, ...messageCount };
	},
	[CLEANMESSAGE] (state, cleanData) {
		let data = 0;
		if([ 'diggs', 'comments' ].includes(cleanData)) {
			data = {
				count: 0,
				uids: state.messageCount[cleanData].uids
			};
		}
		state.messageCount = { ...state.messageCount, [cleanData] : data };
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