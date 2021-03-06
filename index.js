#!/usr/bin/env node

const readline = require("readline");
const { stdin, stdout } = require("process");
const axios = require("axios");
const { join, dirname } = require("path");
const fs = require("fs");

const run = (url) => {
	const fileName = url.split("/").pop();
	if (!fileName) return console.log("Invalid URL");
	axios.default
		.get(url)
		.then((r) => {
			if (
				!Array.isArray(r.data.sources) ||
				!Array.isArray(r.data.sourcesContent)
			) {
				console.error("Invalid response");
				process.exit();
			}
			let completed = 0;
			r.data.sources.forEach((source, i) =>
				fs.mkdir(
					join(__dirname, fileName, dirname(source)),
					{ recursive: true },
					(err) => {
						if (err) {
							completed++;
							if (completed === r.data.sources.length) {
								console.log("Done");
								process.exit();
							}
							console.log(err);
						} else
							fs.writeFile(
								join(__dirname, fileName, source),
								r.data.sourcesContent[i],
								(err) => {
									if (err) console.log(err);
									completed++;
									if (completed === r.data.sources.length) {
										console.log("Done");
										process.exit();
									}
								}
							);
					}
				)
			);
		})
		.catch(() => {
			console.log("Failed to connect");
			process.exit();
		});
};

if (process.argv.length < 3) {
	readline
		.createInterface({
			input: stdin,
			output: stdout,
		})
		.question("Type a URL: ", (url) => {
			run(url);
		});
} else {
	run(process.argv[2]);
}
