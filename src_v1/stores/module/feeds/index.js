/**
 * feeds store module
 */
import localEvent from 'store';
import actions from './actions.js';
import mutations from './mutations.js';
import getters from './getters.js';

export const NEWFEEDS = 'new';
export const HOTFEEDS = 'hot';
export const FOLFEEDS = 'follow';

const state = {
    feeds: {
        [NEWFEEDS]: {
            pinned: {},
            feed: {}
        },
        [HOTFEEDS]: {
            pinned: {},
            feed: {}
        },
        [FOLFEEDS]: {
            pinned: {},
            feed: {}
        },
        userFeeds: {
            user_0: {

            }
        }
    },
    groupFeeds: {

    },
    commentInputId: -1,
    feedType: NEWFEEDS,
};

export default {
    state,
    getters,
    actions,
    mutations
};