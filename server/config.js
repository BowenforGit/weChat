module.exports = {
  serverPort: '5757',
  expireTime: 24 * 3600,
  appId: 'wx1c12411a8b7b2076',
  appSecret: 'ba9780053ca3dfcc66503c4663fa17d4',

  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'mini-program',
    pass: 'wx1c12411a8b7b2076',
    char: 'utf8mb4'
  },

  cos: {
    region: 'ap-guangzhou',
    fileBucket: 'mini-program'
  }
};