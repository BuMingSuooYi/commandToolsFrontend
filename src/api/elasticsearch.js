/**
 * 管理api
 */
import request from '@/unit/axios.js';
// 基本路径
const baseURL = '/elasticsearch';

/**
 * 查询全部命令
 * @returns {AxiosPromise} Axios请求
 */
export const countByType = () => {
	return request({
		url: `${baseURL}`+"/countByType",
		method: 'GET',
	});
};

/**
 * 分页查询
 * @returns {AxiosPromise} Axios请求
 */
export const searchInfoDocuments = (pageNumber, pageSize) => {
	return request({
		url: `${baseURL}` + '/searchInfoDocuments/' + pageNumber+'/'+pageSize,
		method: 'GET',
	});
};

export const searchErrorDocuments = (pageNumber, pageSize) => {
	return request({
		url: `${baseURL}` + '/searchErrorDocuments/' + pageNumber+'/'+pageSize,
		method: 'GET',
	});
};

export const searchWarningDocuments = (pageNumber, pageSize) => {
	return request({
		url: `${baseURL}` + '/searchWarningDocuments/' + pageNumber+'/'+pageSize,
		method: 'GET',
	});
};

