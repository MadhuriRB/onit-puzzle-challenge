const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any) {
  app.use(
    '/api/conceptnet',
    createProxyMiddleware({
      target: 'http://api.conceptnet.io',
      changeOrigin: true,
      pathRewrite: {
        '^/api/conceptnet': '/c/en'
      },
      onProxyReq(proxyReq: any) {
        proxyReq.path += `?rel=/r/IsA`;
      }
    })
  );
};
