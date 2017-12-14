import http from '@/http';
export default {
    async GET_USER_DATA({ commit }, type, params = { limit: 15 }) {
        let uri;

        switch(type) {
            case 'pop':
                uri = '/user/populars';
                break;
            case 'new':
                uri = '/user/latests';
                break;
            case 'rec':
                uri = '/user/find-by-tags';
                break;
        }
        return new Promise((resolve, reject) => {
            let res = {
                noMore: false,
                data: []
            };
            http.get(uri, params).then(({ data = [] }) => {
                if(data.length > 0) {
                    res.data = data;
                    res.noMore = data.length < params.limit;
                    commit('SAVE_USER', data);
                }
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }
}