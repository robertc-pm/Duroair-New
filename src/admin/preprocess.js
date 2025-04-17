var pp = require('preprocess');
if (process.env.NODE_ENV !== 'production') {
process.env.NODE_ENV = 'development';
}
var NODE_ENV = process.env.NODE_ENV;
if (!process.env.BRANCH) {
    process.env.BRANCH = 'master';
}
pp.preprocessFileSync(process.argv[2], process.argv[3], process.env, {});
