export default {
    SET_FEED_TYPE(state, type) {
        state.feedType = type;
    },
    SET_INPUT_ID(state, feedID) {
        state.commentInputId = feedID ? feedID : -1;
    },
    SET_FEEDS(state, feeds) {
        let oldFeeds = state.feeds[state.feedType]['feed'];
        state.feeds[state.feedType]['feed'] = Object.assign({}, oldFeeds, feeds);
    },
    SET_PINNED_FEEDS(state, pinneds) {
        let oldFeeds = state.feeds[state.feedType]['pinned'];
        state.feeds[state.feedType]['pinned'] = Object.assign({}, oldFeeds, pinneds);
    }
};