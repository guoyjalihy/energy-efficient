module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5050/',
                ws: true,  //开启跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/api':'/'
                }
            }
        }
    }
};