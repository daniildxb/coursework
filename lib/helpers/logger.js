const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');
const packageJson = require('../../package');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const streams = [
    {
        level: 'debug',
        type: 'raw',
        stream: prettyStdOut
    }
];

const logger = bunyan.createLogger({
    name: packageJson.name,
    streams,
});

module.exports = logger;
