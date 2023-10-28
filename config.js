
// const mysql = require('mysql')

// const con = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     database:'notes'
// })
// con.connect((err)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('no error')
//     }
// })
// module.exports = con


const mysql = require('mysql')

const con = mysql.createConnection({
    host:'b0bchu0skvkkuxiwpn8x-mysql.services.clever-cloud.com',
    user:'udjvkr10jph9rvw0',
    database:'b0bchu0skvkkuxiwpn8x',
    password:'J8wBuMMHGbZuxxVeHqcj'
})
con.connect((err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('no error')
    }
})
module.exports = con