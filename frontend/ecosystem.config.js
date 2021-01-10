module.exports = {
  apps: [
    {
      name: "bukit-delight-client",
      script: "npm",
      env_production: {
        PORT: 80,
        NODE_ENV: "production",
      },
    },
  ],
};
