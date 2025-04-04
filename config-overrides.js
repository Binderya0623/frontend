module.exports = {
    webpack: (config) => {
      config.resolve.fallback = {
        https: require.resolve('https-browserify'),
      };
      return config;
    },
  };
  