const path = require("path");

module.exports = {
  apps: [
    {
      name: "bukit-delight-server",
      script: "./dist/src/server.js",
      cwd: __dirname,
      watch: false,
      env: {
        PORT: 5000,
        NODE_ENV: "production",
      },
    },
  ],
};
