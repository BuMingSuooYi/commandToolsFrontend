/**
 * 管理api
 */
import request from '@/unit/axios.js';
// 基本路径
const baseURL = '/command';

/**
 * 查询全部命令
 * @returns {AxiosPromise} Axios请求
 */
export const getAll = () => {
    return request({
        url: `${baseURL}`,
        method: 'GET',
    });
};

/**
 * 查询全部系统参数
 * @returns {AxiosPromise} Axios请求
 */
export const getAllSysParameter = () => {
    return request({
        url: `${baseURL}/sysParameter`,
        method: 'GET',
    });
};

/**
 * 获取一个命令并解析变量
 * @returns {AxiosPromise} Axios请求
 */
export const findbyOne = (id) => {
    return request({
        url: baseURL+'/findbyOne/'+id,
        method: 'GET',
    });
};

// /**
//  * 分页查询命令
//  * @param params ()
//  */
// export const getPage = (params) => {
//     return request({
//         url: `${baseURL}/page`,
//         method: 'GET',
//         params
//     });
// };

/**
 * 添加命令
 * @param params Command对象
 * @returns {AxiosPromise} Axios请求
 */
export const add = (params) => {
    return request({
        url: `${baseURL}/createcommand`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 预览命令
 * @param params Command对象
 * @returns {AxiosPromise} Axios请求
 */
export const call = (params) => {
    return request({
        url: `${baseURL}/callfunction`,
        method: 'POST',
		data: { ...params }
    });
};

// /**
//  * 根据ID删除账户
//  * @param id 账户ID
//  * @returns {AxiosPromise} Axios请求
//  */
// export const deleteAccountById = (id) => {
//     return request({
//         url: `${baseURL}`,
//         method: 'DELETE',
//         params: { id }
//     });
// };

// /**
//  * 修改账户
//  * @param params Account对象
//  * @returns {AxiosPromise} Axios请求
//  */
// export const editAccount = (params) => {
//     return request({
//         url: `${baseURL}`,
//         method: 'PUT',
//         data: { ...params }
//     });
// };
// /**
//  * 用户登录
//  * @param params
//  * @returns {*}
//  */
// export const login = (params) => {
//     return request({
//         url: `${baseURL}/login`,
//         method: 'POST',
//         params
//     });
// };
// /**
//  * 导出账户
//  * @returns {*}
//  */
// export const exportAccount = () => {
//     return request({
//         url: `${baseURL}/download`,
//         method: 'GET',
//         responseType: 'blob' // 设置响应类型为二进制数据
//     });
// };
