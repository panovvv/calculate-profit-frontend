// Dev-server API proxy. The backend URL is sourced only from API_PROXY_TARGET, set in a gitignored
// .env file (see .env.example) or the shell.
require('dotenv').config();

const target = process.env.API_PROXY_TARGET;
if (!target) {
  throw new Error('API_PROXY_TARGET is not set. Define it in .env (see .env.example).');
}

// Drop the browser's Origin header on proxied requests. The dev server already makes calls
// same-origin (localhost:4200), but http-proxy forwards the original Origin, so without this a POST
// would carry `Origin: http://localhost:4200` and a CORS-protected backend would reject it (403
// "Invalid CORS request"). Removing it makes the proxied request a plain, non-CORS request.
const stripOrigin = (proxyReq) => proxyReq.removeHeader('origin');

module.exports = {
  '/api': {
    target,
    changeOrigin: true,
    secure: true,
    // Vite-based dev server (Angular application builder):
    configure: (proxy) => proxy.on('proxyReq', stripOrigin),
    // Fallback for the webpack-based dev server (http-proxy-middleware):
    onProxyReq: stripOrigin,
  },
};
