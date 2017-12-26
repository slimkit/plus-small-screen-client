import ExtractTextPlugin from 'extract-text-webpack-plugin'
export const cssLoaders = (options = {}) => {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  const px2remLoader = {
    loader: 'px2rem-loader',
    options: {
      remUnit: 100,
      remPrecision: 8,
      threeVersion: true
    }
  }

  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader, px2remLoader]

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    process: generateLoaders(),
    less: generateLoaders('less')
  }
}

export const styleLoaders = (options) => {
  const output = []
  const loaders = cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]

    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
