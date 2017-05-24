import { IMSTATUS } from '../types';

const state = {
	imStatus: {
		open: false // 是否链接
	}
};

const mutations = {
	[IMSTATUS] (state, status) {
		state.imStatus = { ...state.imStatus, ...status };
	}
};

const actions = {
	[IMSTATUS]: (context, cb) => {
		cb( status => {
			context.commit(IMSTATUS, status);
		});
	}
};

const getters = {
	[IMSTATUS]: state => {
		return state.imStatus;
	}
};

const store = {
	state,
	mutations,
	actions,
	getters
};

export default store;