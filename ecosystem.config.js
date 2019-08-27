module.exports = {
  apps : [{
    name: 'GridGame',
    script: './server',
    instances: "max",
    exec_mode : "cluster"
  }]
};
