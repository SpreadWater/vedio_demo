
import Vue from 'vue'
import store from '@/store'
import { io } from "socket.io-client";
import { Notification } from 'element-ui'
// socket地址
// VUE_APP_MYHOST：vue.config.js中定义的全局变量
let socket = io(`https://${VUE_APP_MYHOST}:${VUE_APP_SOCKET_SERVER_PORT}/`);

socket.on("connect", (e) => {
    Notification({
        message: '已链接上主机服务',
        type: "success",
    });
});
socket.on("connect_error", (err) => {
    Notification.error({
        message: err,
    });
});
socket.on("disconnect", (reason) => {
    Notification.error({
        message: '已断开链接' + reason,
    });
});


socket.on('init', ({ id }) => {
    // console.log('init:id:', id)
    store.commit('SET_MYSOCKETID', id)
})


Vue.prototype.$socketEmit = function (mission, arg) {
    return new Promise(resolve => {
        socket.emit(mission, arg, res => {
            resolve(res)
        })
    })
}
Vue.prototype.$socketOn = function (mission, cb) {
    return socket.on(mission, cb)
}
