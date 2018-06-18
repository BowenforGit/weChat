module.exports = {
  serverPort: '5757',
  expireTime: 24 * 3600,
  appId: 'wx1c12411a8b7b2076',
  appSecret: '80d354a6fb2d3048640dbb1775d521c2',

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