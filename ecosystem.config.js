module.exports = {
  apps: [
    {
      script: 'ts-node ./src/server.ts',
      name: 'app',
      autorestart: true,
      exec_mode: 'fork',
      watch_delay: 5000,
    },
  ],
};
