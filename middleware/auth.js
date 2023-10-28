const jwt = require('jsonwebtoken')

module.exports  =auth = async (req,res,next)=>{

    try {
       
    const token = req.cookies.jwt
    const verifyuser = jwt.verify(token,process.env.SECREAT_KEY)
    
    next()
    } catch (error) {
        console.log(error)
        res.render('login')
    }
}