import readline from "readline";
import { stdin, stdout } from "process";
import axios from "axios";
import { join, dirname } from "path";
import fs from "fs";

readline
	.createInterface({
		input: stdin,
		output: stdout,
	})
	.question("Type a URL: ", (url: string) => {
		const fileName = url.split("/").pop();
		if (!fileName) {
			console.log("Invalid URL");
			return;
		}
		axios.get(url).then((r) => {
			if (
				!Array.isArray(r.data.sources) ||
				!Array.isArray(r.data.sourcesContent)
			)
				return console.error("Invalid response");
			let completed = 0;
			r.data.sources.forEach((source: string, i: number) =>
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
