import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";

let command;
let args;

if (isWindows) {
    command = "cmd.exe";
    args = ["/c", "scripts\\docs-make.bat"];
} else {
    command = "bash";
    args = ["scripts/docs-make.sh"];
}

const child = spawn(command, args, {
    stdio: "inherit"
});

child.on("exit", (code) => {
    process.exit(code ?? 1);
});

child.on("error", (err) => {
    console.error("Failed to start docs script:", err);
    process.exit(1);
});
