const mysql = require('mysql')

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Monu@123',
    database:'notes'
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