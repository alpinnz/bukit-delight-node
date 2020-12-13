module.exports = {
  apps: [
    {
      name: "bukit-delight-server",
      script: "./src/bin/www.js",
      watch: true,
      env: {
        PORT: 5000,
        NODE_ENV: "production",
      },
    },
  ],
};
