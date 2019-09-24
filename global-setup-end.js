const { spawn } = require("child_process");
module.exports = async function globalSetup() {
  console.log("END!!");
  try {
    const { stdout, stderr } = await spawn("ls");
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  } catch (err) {
    console.error("err", err);
  }
};
