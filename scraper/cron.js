const { exec } = require("child_process");

exec("node src/index.js", (err, stdout) => {
  if (err) console.error(err);
  console.log(stdout);
});