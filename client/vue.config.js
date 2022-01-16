
const webpack = require('webpack');
const os = require('os');

// 本机ip
const VUE_APP_MYHOST = getIPAdress();
// socket服务端口
const VUE_APP_SOCKET_SERVER_PORT = 8081

///获取本机ip
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}


module.exports = {
    lintOnSave: false,
    devServer: {
        https: true,
        // port: 8080
    },
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                // 定义...
                VUE_APP_MYHOST: JSON.stringify(VUE_APP_MYHOST),
                VUE_APP_SOCKET_SERVER_PORT: JSON.stringify(VUE_APP_SOCKET_SERVER_PORT)
            })
        ]
    }
}