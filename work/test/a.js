// eslint-disable-next-line no-undef
let a = new Worker('/script/b.js')
// eslint-disable-next-line no-undef
let b = new Worker('/script/b.js')

a.postMessage('111')


a.onmessage = function(d){
    console.log(d)
}

console.log(123123213)


document.onload = function () {
    document.getElementById('tt').innerHTML = 'js测试'
    let b = 1
}






