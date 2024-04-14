#!/usr/bin/env node
const { spawn } = require("child_process");
const readline = require("readline");
var kill = require("tree-kill");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("Enter your project name: ", (repoName) => {
  repoName = repoName.trim();
  if (!repoName) {
    repoName = "morph-app";
  }
  const gitCheckoutCommand = `git clone --depth 1 https://github.com/AweSamarth/morph-starter ${repoName}`;


  const gitClone = spawn("sh", ["-c", gitCheckoutCommand]);

  gitClone.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Failed to execute ${gitCheckoutCommand}`);
      return rl.close();
    }



    console.log(`Creating project '${repoName}'`);
    const installDepsCommand = `cd ${repoName} && npm install`;
    const npmInstall = spawn("sh", ["-c", installDepsCommand], {
      stdio: "inherit",
    });

    process.on("SIGINT", () => {
      kill(process.pid);
      npmInstall && kill(npmInstall.pid);
      gitClone && kill(gitClone.pid);
    });

    process.on("SIGQUIT", () => {
      kill(process.pid);
      npmInstall && kill(npmInstall.pid);
      gitClone && kill(gitClone.pid);
    });

    npmInstall.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Failed to execute ${installDepsCommand}`);
        return rl.close();
      }
      console.log(`Installing dependencies for ${repoName}`);
      console.log(
        "Project created successfully! Run the following command to start your project in development mode:"
      );
      console.log(`cd ${repoName} && npm run dev`);
      rl.close();
    });
  });
});
