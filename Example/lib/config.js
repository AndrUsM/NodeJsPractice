const environtments = {}
globalTokens= {
    appName: 'Http/Https application',
    author: 'AndrUsM',
    yearCreated: new Date().getFullYear(),
    licence: 'MIT',
    baseUrl: 'http://localhost:3000/',
    company: 'NotRealCompany'
}
environtments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    globalTokens,
    secret: "I am author"
}
environtments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    globalTokens,
    secret: "I am author"
}
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : ''
const env_to_export = typeof environtments[currentEnv] === 'object' ? environtments[currentEnv] : environtments.staging
module.exports = env_to_export
