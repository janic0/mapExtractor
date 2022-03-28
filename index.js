#!/usr/bin/env node

const readline = require("readline");
const { stdin, stdout } = require("process");
const axios = require("axios");
const { join, dirname } = require("path");
const fs = require("fs");
readline
	.createInterface({
		input: stdin,
		output: stdout,
	})
	.question("Type a URL: ", (url) => {
		const fileName = url.split("/").pop();
		if (!fileName) {
			console.log("Invalid URL");
			return;
		}
		axios.default.get(url).then((r) => {
			if (
				!Array.isArray(r.data.sources) ||
				!Array.isArray(r.data.sourcesContent)
			)
				return console.error("Invalid response");
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
		});
	});
