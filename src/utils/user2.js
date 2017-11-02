import axios from '../utils/request';
import _ from 'lodash';
const FUNC = () => {};
let timer = null,
    ids = [];
export const getUserInfoFromVuex = (id, success = FUNC, error = FUNC) => {
    ids = Array.from(new Set([...ids, ...id]));
    const params = _.filter(ids, (u) => typeof u === 'number' && u > 0);
    clearTimeout(timer);

    timer = setTimeout(() => {
        let str = params.join(',');
        axios.get(`/api/v2/users?id=${str}`).then(({data}) => {
            ids = [];
            success(data);
        }).catch(err => {
            ids = [];
            error(err);
        });
    }, 1000);
};