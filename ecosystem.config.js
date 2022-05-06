module.exports = {
  apps: [
    {
      script: './src/server.js',
      autorestart: true,
      watch: true,
      ignore_watch: [
        // 不⽤监听的⽂件
        'node_modules',
        'logs'
      ],

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
      key: '~/.ssh/wxfeiang',
      user: 'root',
      host: ['47.99.93.97'],
      port: '22',
      ssh_options: 'StrictHostKeyChecking=no',
      ref: 'origin/node2',
      repo: 'https://github.com/wxfeiang/node-api.git',
      path: '/home/node2', // path 指定项目目录
      //'pre-deploy': 'git fetch --all',
      // Pre-setup 在 setup 之前执行，如安装 git
      // 'pre-setup': 'apt-get install git ; ls -la',
      // Post-setup 在 setup 之后执行
      // 'post-setup': 'ls -la',
      // 每次 update 都会执行
      'pre-deploy-local': "echo '生产环境部署中'",
      'post-deploy': 'npm install &&  pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
