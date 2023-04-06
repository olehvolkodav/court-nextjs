module.exports = {
  apps: [
    {
      name: 'courtbox',
      exec_mode: 'cluster',
      instances: 2, // Or a number of instances
      script: './node_modules/next/dist/bin/next',
      args: 'start'
    }
  ]
}