const path = require('path')

module.exports = {
    productionSourceMap: false,

    // publicPath: '././',

    devServer: {
        disableHostCheck: true,

        proxy: {
            '/api/v1/admin': {
                target: 'http://127.0.0.1:7001'
            }
        }
    },

    chainWebpack: config => {
        const isProd = process.env.NODE_ENV === 'production'
        if (isProd) {
            // 配置如何展示性能提示
            config.performance
                .hints('warning')
                .maxEntrypointSize(3000000)
                .maxAssetSize(1000000)
                .assetFilter((assetFilename) => {
                    // 配置计算性能提示的文件类型
                    return (
                        assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
                    )
                })

            config.optimization.splitChunks({
                cacheGroups: {
                    common: {
                        // 在所有组件中引用超过2次的依赖模块
                        name: 'chunk-common',
                        chunks: 'all',
                        minChunks: 2,
                        priority: 10,
                        test: /[\\/]node_modules[\\/]/
                    },
                    vendors: {
                        // 入口js共享的所有代码，包括vue
                        name: 'chunk-vendors',
                        chunks: 'initial', // 注册到入口的模块
                        minChunks: 2, // 最少两个入口点引用
                        priority: 20
                    }
                }
            })
        }

        // 为axios引用设置别名
        config.resolve.alias
            .set('@axios', path.resolve(__dirname, './src/assets/js/axios'))
        
        // 全局scss混入
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
            .use('sass-resources-loader')
            .loader('sass-resources-loader')
            .options({
                resources: './src/assets/sass/_mixin.scss',
            })
            .end()
        })
    }
}
