module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{woff,woff2,js,css,png,jpg,svg,html}'],
  /* pass array of globs to exclude from caching */
  globIgnores: [],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'dist/service-worker.js',

  runtimeCaching: [
    {
      urlPattern: /\/api\/schedule$/, // /api/schedule
      handler: 'NetworkFirst',
      options: {
        cacheName: 'schedule-cache',
        expiration: {
          maxAgeSeconds: 30, // Данные будут считаться устаревшими через 30 секунд
        },
        networkTimeoutSeconds: 5, // Если сеть недоступна 5 сек, загрузится кеш
      },
    },
  ],
};
