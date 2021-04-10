[
    'spinner',
    'logger',
    'env',
    'exit',
    'config'
].forEach(m => {
    Object.assign(exports, require(`./${m}`))
})