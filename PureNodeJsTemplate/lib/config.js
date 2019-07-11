const environtments = {}
globalTokens= {
    appName: 'Http/Https template',
    author: 'AndrUsM',
    yearCreated: new Date().getFullYear(),
    licence: 'MIT'
}
environtments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    globalTokens
}
environtments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    globalTokens
}
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : ''
const env_to_export = typeof environtments[currentEnv] === 'object' ? environtments[currentEnv] : environtments.staging
module.exports = env_to_export