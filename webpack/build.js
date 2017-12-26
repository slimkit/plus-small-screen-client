import ora from 'ora'
import rm from 'rimraf'
import path from 'path'
import webpack from 'webpack'
import config from './config/index'
import webpackConfig from './pro.conf'

process.env.NODE_ENV = 'production'

const spinner = ora('building for production...')
spinner.start()
// 删除 dist 目录
rm(path.join(config.build.assetsRoot), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // if you are using ts-loader, setting this to true will make tyescript errors show up during build
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log('  Build failed with errors.\n')
      process.exit(1)
    }
    spinner.succeed('Build all complete.\n')
  })
})
