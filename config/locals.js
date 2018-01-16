module.exports = {
    hookTimeout: 30000000,
    ssl: {
        key: require('fs').readFileSync(__dirname + '/ssl/newprivatekey1.pem'),
        cert: require('fs').readFileSync(__dirname + '/ssl/newcert1.pem')
    },
    //explicitHost: process.env.HOST || 'localhost'
};