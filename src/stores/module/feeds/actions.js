import _ from 'lodash';
export default {
    ADD_MORE_FEEDS({ state, commit, dispatch }, { feeds, pinned, ad } = {}) {
        const
            type = state.feedType,
            oldFeeds = state.feeds[type]['feed'],
            oldPinned = state.feeds[type]['pinned'],
            pinned_ids = pinned.map(pf => pf.id),
            newPinneds = {},
            newFeeds = {};
        try {
            pinned = pinned.filter(f => f.id > 0);

            _.dropWhile(feeds, (f) => (pinned_ids.indexOf(f.id) > -1)).forEach(f => {
                newFeeds[`feed_${f.id}`] = f;
            });

            pinned.forEach(pf => {
                newPinneds[`pinned_feed_${pf.id}`] = { ...pf, pinned: true }
            });

            commit("SET_FEEDS", newFeeds);
            commit("SET_PINNED_FEEDS", newPinneds);
        } catch(e) {
            console.log('dispatch ADD_MORE_FEEDS catch `Error`:', e);
        }
    }
};