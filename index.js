"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const process_1 = require("process");
const axios_1 = __importDefault(require("axios"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
readline_1.default
    .createInterface({
    input: process_1.stdin,
    output: process_1.stdout,
})
    .question("Type a URL: ", (url) => {
    const fileName = url.split("/").pop();
    if (!fileName) {
        console.log("Invalid URL");
        return;
    }
    axios_1.default.get(url).then((r) => {
        if (!Array.isArray(r.data.sources) ||
            !Array.isArray(r.data.sourcesContent))
            return console.error("Invalid response");
        let completed = 0;
        r.data.sources.forEach((source, i) => fs_1.default.mkdir((0, path_1.join)(__dirname, fileName, (0, path_1.dirname)(source)), { recursive: true }, (err) => {
            if (err) {
                completed++;
                if (completed === r.data.sources.length) {
                    console.log("Done");
                    process.exit();
                }
                console.log(err);
            }
            else
                fs_1.default.writeFile((0, path_1.join)(__dirname, fileName, source), r.data.sourcesContent[i], (err) => {
                    if (err)
                        console.log(err);
                    completed++;
                    if (completed === r.data.sources.length) {
                        console.log("Done");
                        process.exit();
                    }
                });
        }));
    });
});
//# sourceMappingURL=index.js.map