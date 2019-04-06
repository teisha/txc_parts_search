module.exports = {
  apps : [{
    name: 'TXC PARTS SEARCH',
    script: 'app.js',
	output: './logs/out.log',
    error: './logs/error.log',
	log: './logs/combined.outerr.log',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
  	  PORT: '8082',
  	  MYSQL_HOST:'localhost',
  	  MYSQL_USER:'txc_app_user',
  	  MYSQL_PASSWORD:'viewtxc8554957',
  	  MYSQL_SCHEMA:'txc_inventory',
      SESSION_SECRET: ':f>9w?73Bu^DK5O*On_?SFX^mUSz?2'
    },
    env_production: {
      NODE_ENV: 'production',
  	  PORT: '8082',
  	  MYSQL_HOST:'localhost',
  	  MYSQL_USER:'txc_app_user',
  	  MYSQL_PASSWORD:'viewtxc8554957',
  	  MYSQL_SCHEMA:'txc_inventory',
      SESSION_SECRET: ':f>9w?73Bu^DK5O*On_?SFX^mUSz?2'
    }
  }],

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
