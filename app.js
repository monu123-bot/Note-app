require('dotenv').config()
const express = require('express')
const con = require('./config')
const app = express()
var session = require('express-session')
const auth = require('./middleware/auth')
const path = require('path')
const bcrypt = require('bcryptjs')
const pathname = path.join(__dirname,'views')
const jwt = require('jsonwebtoken') 
const cookieParser = require('cookie-parser')
const multer  = require('multer')
const port  = process.env.PORT || 8000
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const mineextension  = {
          'image/jpeg' : '.jpeg',
          'image/jpg' : '.jpg',
          'image/png' : '.png',
          'image/gif' : '.gif'
      }
      cb(null,Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage} )


app.use(session({
    secret: 'secreatkey',
  resave: false,
  saveUninitialized: true
}))
sessioncheck= (req,res,next)=>{
    if(!req.session.user){
        res.render('login')
    }
    
    else{
        next()
    }
}
app.set('view engine','ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.get('/sql',(req,res)=>{
    con.query("select * from users",(err,result)=>{
        if(!err){
            res.send(result)
        }
    })
})

app.get('/home',(req,res)=>{
    if(req.session.user != null){
        const user = {email:req.session.user,
            name:req.session.username,
            login:true}
        res.render('index',{user})
    }
    else{
        const user = {email:'You are not logged in',
        login:false}
        res.render('index',{user})
    }
    
})
app.get('/secreat',auth,(req,res)=>{
        
    res.render(`secreat`)
})
app.get('/',(req,res)=>{
        
                res.render(`login`)
            })
app.get('/logout',auth,async(req,res)=>{
            res.clearCookie('jwt')
            req.session.destroy()
                res.render('login')
            }) 
app.get('/signin',(req,res)=>{
            
                    res.render(`signin`)
                })    
app.get('/notes',async (req,res)=>{
    con.query(`select * from note,cust_note,users where note.note_id = cust_note.note_id and cust_note.cust_id = users.cust_id and users.email  = '${req.session.user}' ` ,(err,result,next)=>{
        if(!err){
            if(req.session.user != null){
                const user = {email:req.session.user,
                    name:req.session.username,
                    notes:result,
                message:'Please add some notes',
                login:true}
                res.render('notes',{user})
            }
            else{
                const user = {email:'You are not logged in',
            message:'Login again..',
        notes:[],
        login:false}
                res.render('notes',{user})
            }

           
            }
        else{
            console.log(err)
        } } )


            
                   
} )
app.get('/documents',async (req,res)=>{
    con.query(`select * from doc,cust_doc,users where doc.doc_id = cust_doc.doc_id and cust_doc.cust_id = users.cust_id and users.email  = '${req.session.user}' ` ,(err,result,next)=>{
        if(!err){

            if(req.session.user != null){
                const user = {email:req.session.user,
                    name:req.session.username,
                    docs:result,
                message:'Please add some docs',
            login:true}
                res.render('documments',{user})
            }
            else{
                const user = {email:'You are not logged in',
            message:'Login again..',
        docs:[],
        login:false}
                res.render('documments',{user})
            }
            }
        else{
            console.log(err)
        } } )


            
                   
} )
// app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.get('/fetchdoc',async (req,res)=>{
    console.log(req.query)
    const file = {filename:req.query.name,filepath:req.query.pathname}

    res.render('showfile',{file})


            
                   
} )



                                    
app.post('/registration',async (req,res)=>{
    const password =await bcrypt.hash(req.body.password1,10)
    const token  = jwt.sign({_id:req.body.email},process.env.SECREAT_KEY)
    res.cookie('jwt',token,{
        expires: new Date(Date.now() + 30000000),
        httpOnly:true
    })
    con.query('select cust_id from users order by cust_id desc limit 1 ',(err,result,next)=>{
        if(!err){
            const _id = result[0].cust_id + 1
        

    

    const data = [_id,req.body.fName,req.body.lName,req.body.phno,req.body.email,req.body.dob,req.body.city,req.body.state,req.body.locality,req.body.street,password,token]
    
    con.query('INSERT INTO users set cust_id =  ?, fName = ?, lName = ?, phno = ?, email = ?, dob = ?, city = ? , state = ? , locality = ? , street = ? , password = ? , token = ? ', data,(err,result,feilds)=>{
        if(!err){ 
           
          res.render('signin')
        }
        else{
           console.log(err)
  res.render('signin')
        }
    })  }
    else{
        console('error in findin next id..')
    }
})
})  
app.post('/adddoc',upload.single('document'),async (req,res)=>{
    console.log(req.file.path)
   
    let dob = new Date()
    let date  = dob.getDate()
    let month = dob.getMonth()
    let year = dob.getFullYear()
    let date1 = `${year}-${month}-${date}`
    
  
    con.query('select doc_id from doc order by doc_id desc limit 1 ',(err,result,next)=>{
        if(!err){
            var _id = result[0].doc_id + 1
            const data = [_id,req.body.name,req.body.remark,req.file.path,date1]
            const data2 = [_id,req.session.userid]
            
    
            con.query('INSERT INTO doc set doc_id = ? , name = ? , remark = ?, path = ? , date_time = ? ', data,(err,result,feilds)=>{
                if(!err){ 
                    con.query('INSERT INTO cust_doc set doc_id = ? , cust_id = ? ', data2,(err,result,feilds)=>{
                        if(!err){ 
                           
                            res.redirect('/documents')
                        }
                        else{
                           res.send(err)
                 
                        }
                    }) 
                   
                    
                }
                else{
                    res.send(err)
          
                }
            })  
        }
        else{
            res.send(err)
           
        }

    })

 
})
app.post('/addnote',async (req,res)=>{
    
    let dob = new Date()
    let date  = dob.getDate()
    let month = dob.getMonth()
    let year = dob.getFullYear()
    let date1 = `${year}-${month}-${date}`
    
  
    con.query('select note_id from note order by note_id desc limit 1 ',(err,result,next)=>{
        if(!err){
            var _id = result[0].note_id + 1
            const data = [_id,req.body.title,req.body.description,req.body.tag,req.body.name,date1]
            const data2 = [_id,req.session.userid]
            
    
            con.query('INSERT INTO note set note_id = ? , title = ? , description = ?, tag = ? , name = ? , date_time = ? ', data,(err,result,feilds)=>{
                if(!err){ 
                    con.query('INSERT INTO cust_note set note_id = ? , cust_id = ? ', data2,(err,result,feilds)=>{
                        if(!err){ 
                           
                            res.redirect('/notes')
                        }
                        else{
                           console.log(err)
                  res.send('can not add in cust_note ')
                        }
                    }) 
                   
                    
                }
                else{
                   console.log(err)
          res.send('can not add in note')
                }
            })  
        }
        else{
            console.log(err)
            res.send('error in finding id')
        }

    })

 
})
app.post('/login',async (req,res)=>{
    const token  = jwt.sign({_id:req.body.email},process.env.SECREAT_KEY)
    let temptoken = ''
    
    res.cookie('jwt',token,{
        expires: new Date(Date.now() + 30000),
        httpOnly:true
        // secure:true
    })
    
  
    con.query("select * from users",(err,result)=>{
         
   
        if(!err){
             
        result.forEach((item)=>{

            
            
        // const passwordmatch = bcrypt.compare(item.password,req.body.password)
            if(item.email == req.body.email || item.token == token)    {
                temppass = item.password
                temptoken = item.token
                req.session.username = item.fName 
                
                req.session.userid = item.cust_id
                
                
               
                
            
            }
        } )
        const passwordmatch = bcrypt.compareSync(req.body.password,temppass)
       
        if(passwordmatch == true || temptoken == token){
            req.session.user = req.body.email
            

            const user = {email:req.session.user}
            res.render('index',{user})

        }
        else{
            res.render('login')
        }
       
    }
    else{
        console.log('error aa rha h >>.')
    }
    
     } )
  
    } )
app.get('/test',(req,res)=>{
    res.send('working')
})    
// res.send(`${pathname}/index.html`)
app.listen(port,()=>{
    console.log(`app is running on port : ${port}`)
})