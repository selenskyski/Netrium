// Minimal UV client config
self.__uv$config = {
  prefix: '/service/',          // Path UV will rewrite to
  bare: '/bare/',               // Bare server mount (server.js)
  encodeUrl: self.__uv$encodeUrl,
  decodeUrl: self.__uv$decodeUrl,
  handler: '/uv/uv.handler.js',
  bundle: '/uv/uv.bundle.js',
  config: '/uv/uv.config.js',
  sw: '/uv/uv.sw.js',
};
