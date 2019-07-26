// https://codepen.io/chiragbhansali/pen/EWppvy
let lib = {}
let verbs, nouns, adjectives, adverbs, preposition;
    nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"]
    verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"]
    adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"]
    adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"]
    preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"]

lib.randGen = () => {
    return Math.floor(Math.random() * 5);
}

lib.sentence =  () => {
    var rand1 = Math.floor(Math.random() * 10)
    var rand2 = Math.floor(Math.random() * 10)
    var rand3 = Math.floor(Math.random() * 10)
    var rand4 = Math.floor(Math.random() * 10)
    var rand5 = Math.floor(Math.random() * 10)
    var rand6 = Math.floor(Math.random() * 10)
          
    var content = `${verbs[rand2]} ${preposition[rand6]} ${adjectives[rand5]} ${nouns[rand1]}.`
    let final_sentence = content
    return final_sentence
};
module.exports = lib