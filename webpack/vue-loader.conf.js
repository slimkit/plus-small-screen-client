import config from './config/';
import utils, { cssLoaders } from './utils';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  loaders: cssLoaders({
    sourceMap: isProduction 
      ? config.build.productionSourceMap 
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}