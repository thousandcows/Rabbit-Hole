module.exports = {
  apps: [
    {
      script: 'npm start',
      name: 'app',
      autorestart: true,
      exec_mode: 'fork',
      watch_delay: 5000,
    },
  ],
};
