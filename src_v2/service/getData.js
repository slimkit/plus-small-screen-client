import api from './api';

/**
 * 动态相关
 */
// 获取动态
export const getFeeds = ( params ) => {
    return api('/feeds', params);
}