
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
    host:process.env.DATABASEHOSTNAME,
    user:process.env.DATABASEUSER,
    database:process.env.DATABASENAME,
    password:process.env.DATABASEPASSWORD
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