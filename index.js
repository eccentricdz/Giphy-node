#!/usr/bin/env node

//Modules
const program = require('commander');
const request = require('superagent');
const chalk = require('chalk');
const spawn = require('child_process').spawn;
const imgcat = require('imgcat');

//Global variables
const GIPHY_SEARCH_URL = 'http://api.giphy.com/v1/gifs/search';
const API_KEY = 'dc6zaTOxFJmzC';

let query;
let offset = 0;
let count = 3;

program
	.option('-s, --search <query>', "The search query")
	.option('-o, --offset <offset>', "The search offset number")
	.option('-c, --count <count>', "The result count")
	.parse(process.argv);

if (!program.search) {
	program.help();
}
else {
	query = program.search;
	offset = program.offset ? program.offset : offset;
	count = program.count ? program.count : count;
	getSearchResults();
}

function getSearchResults() {
	request
		.get(GIPHY_SEARCH_URL)
		.query({
			q: query,
			api_key: API_KEY,
			limit: count,
			offset: offset
		})
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				error('Error response from the server: ' + err);
				process.exit(1);
			}
			else if(res && res.ok) {
				displaySearchResults(res.body.data);
			}
		});
}

function displaySearchResults(gifList) {
	for (let gif of gifList) {
		imgcat(gif.images.original.url, {log:true});
	}
}

function error(message) {
	console.log(chalk.red(message));
}