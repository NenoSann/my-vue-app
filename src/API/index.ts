// /API/index储存所有api共用的工具函数, 以及初始化axios配置
export const apiRoot = "https://nenosannn.icu:";
export const apiPort = "3000";
import axios, { AxiosResponse } from "axios";

// axios请求拦截器
axios.interceptors.request.use(function (config) {
    // 根据项目环境重载目标url
    if (config.url) {
        config.url = urlOverride(config.url);
    }
    return config;
});

axios.interceptors.response.use(
    function (response) {
        // 成功响应
        return response;
    },
    function (error: AxiosResponse) {
        // 非2xx https状态
        console.log(error);
        const statusString = error.status.toString();
        if (statusString.startsWith("4")) {
            // 4xx https
            return Promise.reject(error);
        }
    },
);

/**
 * 根据项目的生产环境,将url转换为测试用的 /api开头字符串(测试)
 * 或 https开头的生产api网址
 */
function urlOverride(rawURL: string): string {
    if (rawURL) {
        if (import.meta.env.DEV) {
            return rawURL;
        } else {
            return apiRoot + apiPort + rawURL.slice(3);
        }
    } else {
        return rawURL;
    }
}

export { axios };
