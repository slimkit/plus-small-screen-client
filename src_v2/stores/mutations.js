import localEvent from 'store';
export default {
    SAVE_FEED_TYPE(state, type) {
        state.FEEDTYPE = type;
    },

    SAVE_CURRENTUSER(state, info){
        state.CURRENTUSER = info;
        localEvent.set('CURRENTUSER', state.CURRENTUSER);
    }
}