const express = require('express');
const app=express();
const { createDBConn } = require('./config/db')
const bodyParser = require('body-parser')
const { registerUser, loginUser, addLoginTime, userLoginCheck, tokenDeleteFunction } = require('./controller/controller')
const {getEmpId, empPass} = require('./general/general')
const jwt = require('jsonwebtoken')
require(`dotenv`).config()
const userRouter = require('./routes/userRoutes');
var moment = require('moment');  


app.use(bodyParser.json())

createDBConn();


app.use('/users',async function(req,res,next){
    authHeader = req.headers["authorization"]
    var token = req.headers.authorization.split(' ')[1];
    if(!token) res.status(401).send({status:"ok", message:"Please Send JWT Token"})
    try{
        let empId = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.empId = empId
        next()
    }catch(e){
        if(e.message =="jwt expired")
        {
            let data = await tokenDeleteFunction(req.query.empId)
            if(data) res.status(401).send({status:"ok", data:{message:"Token expired"}})
            else res.status(404).send({status:"ok", data:{message:"User not found"}})
        }
        else{
        console.log(e.message)
        res.status(401).send({status:"ok", data:{message:"Unauthorized"}})
        }
    }
})

app.use('/users',userRouter)


app.get('/', function(req, res) {
    res.status(200).send({status:true, message:"wrong path"})
})

app.post('/register', async(req, res)=>{
    let userObj= {
        name: req.body.name,
        dep: req.body.dep,
        phnNo: req.body.phnNo,
        dob: new Date(req.body.dob),
        email: req.body.email,
        empId: await getEmpId(),
        password: await empPass(),
        wage: req.body.wage,
        login: [],
        logoff: []
    }
    ok = await registerUser(userObj)
    if (ok) res.status(200).send({status:ok , data:{message:"user registered successfully", empId: userObj.empId, password: userObj.password}})
    else res.status(404).send({status:ok, message:"user not registered"})
})

app.post('/login', async(req, res)=>
{
    let loginObj= {
        empId: req.body.empId,
        password: req.body.password,
        login: new Date()
    }
    ok = await loginUser(loginObj)
    if (ok){
        // let accessToken
        userLoggedIn = await userLoginCheck(loginObj)
            if(userLoggedIn){
                res.status(422).send({status:"ok", data:{message:"user already logged in"}})
            }
            else{
                try{
                    accessToken = jwt.sign( {empId: loginObj.empId }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn : '1h'})
                }catch(ex){
                    console.log(ex)
                }
                loginObj.token = accessToken
                ok = await addLoginTime(loginObj)
                res.status(200).send({status:ok, data:{message: "user logged in successfully", lastLogin: loginObj.login, token: accessToken}})    
            }
        }
    else res.status(404).send({status:ok, data:{message:"user does not exist, please signup first"}})
})



app.listen(3000, ()=> {
    console.log('listening on port 3000')
})