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
 * 查询命令全部分类
 * @returns {AxiosPromise} Axios请求
 */
export const findAlltype = () => {
	return request({
		url: `${baseURL}`+"/findAlltype",
		method: 'GET',
	});
};

/**
 * 查询单个命令
 * @returns {AxiosPromise} Axios请求
 */
export const findByName = (name) => {
	return request({
		url: baseURL + '/findByName/' + name,
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

// /**
//  * 获取一个命令并解析变量
//  * @returns {AxiosPromise} Axios请求
//  */
// export const findbyOne = (id) => {
//     return request({
//         url: baseURL+'/findbyOne/'+id,
//         method: 'GET',
//     });
// };

/**
 * 多条件模糊查询命令
 * @param condition 
 * @returns {AxiosPromise} Axios请求
 */
export const search = (condition) => {
	return request({
		url: `${baseURL}/search`,
		method: 'POST',
		data: {
			...condition
		}
	});
};

/**
 * 添加命令
 * @param params Command对象
 * @returns {AxiosPromise} Axios请求
 */
export const add = (params) => {
	return request({
		url: `${baseURL}/createcommand`,
		method: 'POST',
		data: {
			...params
		}
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
		data: {
			...params
		}
	});
};

/**
 * 根据ID删除命令
 * @param id 命令ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteCommand = (id) => {
    return request({
        url: `${baseURL}`+"/"+id,
        method: 'DELETE',
    });
};

/**
 * 修改命令
 * @param params Account对象
 * @returns {AxiosPromise} Axios请求
 */
export const updata = (params) => {
	return request({
		url: `${baseURL}`,
		method: 'Patch',
		data: {
			...params
		}
	});
};


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

/**
 * 倒叙查询全部命令发送历史
 * @returns {AxiosPromise} Axios请求
 */
export const findSendingHistory = () => {
	return request({
		url: `${baseURL}/sendingHistory`,
		method: 'GET',
	});
};

/**
 * 添加命令发送历史
 * @param params Command对象
 * @returns {AxiosPromise} Axios请求
 */
export const addSendingHistory = (params) => {
	return request({
		url: `${baseURL}/addSendingHistory`,
		method: 'POST',
		data: {
			...params
		}
	});

};

/**
 * 查询命令的全部状态列表
 * @returns {AxiosPromise} Axios请求
 */
export const getAllState = () => {
	return request({
		url: baseURL+'/getAllState',
		method: 'GET',
	});
}

/**
 * 查询命令历史的全部标签
 * @returns {AxiosPromise} Axios请求
 */
export const getAllTag = () => {
	return request({
		url: baseURL+'/getAllTag',
		method: 'GET',
	});
}



/**
 * 获取命令发送历史题头
 * @returns {AxiosPromise} Axios请求
 */
export const getHistoryTite = () => {
	return request({
		url: baseURL+'/getHistoryTite',
		method: 'GET',
	});
}

/**
 * 获取某命令近n天的发送记录和标签
 * @returns {AxiosPromise} Axios请求
 */
export const getHistoryNearlyNByCommand = (commandId) => {
	return request({
		url: baseURL+'/getHistoryNearlyNByCommand/' + commandId,
		method: 'GET',
	});
}


/**
 * 更新历史命令的标签集
 * * @param params 
 * @returns {AxiosPromise} Axios请求
 */
export const updataSendingHistoryTag = (params) => {
	return request({
		url: baseURL+'/updataSendingHistoryTag',
		method: 'Patch',
		data: {
			...params
		}
	});
};


// 历史标签部分

/**
 * 获取全部历史标签
 * @returns {AxiosPromise} Axios请求
 */
export const findAllTag = () => {
	return request({
		url: baseURL+'/findAllTag',
		method: 'GET',
	});
}

/**
 * 添加历史标签
 * @param params 历史标签对象
 * @returns {AxiosPromise} Axios请求
 */
export const createTag = (params) => {
	return request({
		url: `${baseURL}/createTag`,
		method: 'POST',
		data: {
			...params
		}
	});
};

/**
 * 更新历史标签
 * * @param params 
 * @returns {AxiosPromise} Axios请求
 */
export const updateTag = (params) => {
	return request({
		url: baseURL+'/updateTag',
		method: 'Patch',
		data: {
			...params
		}
	});
};


/**
 * 根据ID删除历史标签
 * @param id 历史标签ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteTag = (id) => {
    return request({
        url: `${baseURL}`+"/deleteTag/"+id,
        method: 'DELETE',
    });
};
