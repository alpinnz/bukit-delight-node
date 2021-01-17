module.exports = {
  apps: [
    {
      name: "bukit-delight-server",
      script: "./src/app.js",
      watch: true,
      env: {
        PORT: 5000,
        NODE_ENV: "production",
      },
    },
  ],
};
