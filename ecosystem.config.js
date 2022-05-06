module.exports = {
  apps: [
    {
      script: './current/src/server.js',

      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      user: 'wxfeiang',
      host: ['47.99.93.97'],
      port: '22',
      ref: 'origin/node2',
      repo: 'https://github.com/wxfeiang/node-api.git',
      path: '/home/node2',
      'pre-deploy': 'git fetch --all',
      'pre-deploy-local': '',
      'post-deploy': 'npm install &&  9pm2 startOrRestart ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
