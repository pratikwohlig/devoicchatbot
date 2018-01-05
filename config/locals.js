module.exports = {
    hookTimeout: 30000000,
    ssl: {
        key: require('fs').readFileSync(__dirname + '/ssl/newprivatekey.pem'),
        cert: require('fs').readFileSync(__dirname + '/ssl/newcert.pem')
    },
    //explicitHost: process.env.HOST || 'localhost'
};