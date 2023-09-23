/**
 * 管理api
 */
import request from '@/unit/axios.js';
// 基本路径
const baseURL = '/linking';

/**
 * 查询全部Net
 * @returns {AxiosPromise} Axios请求
 */
export const getAllNet = () => {
    return request({
        url: `${baseURL}`,
        method: 'GET',
    });
};


/**
 * 根据NetId查询Node
 * 
 * @returns {AxiosPromise} Axios请求
 */
export const findNodeByNet = (id) => {
    return request({
        url: baseURL+'/findNodeByNet/'+id,
        method: 'GET',
    });
};



