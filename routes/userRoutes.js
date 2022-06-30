
const express= require('express');
const router = express.Router();
const { logoutUser, userLogoffCheck, getWageDetails, userExistsCheck } = require('../controller/controller')
var moment = require('moment');  
const { duration } = require('moment');

router.put('/logout', async function(req, res){
    let logoffObj ={
        empId: req.query.empId,
        logoff: new Date()
    }
    ok = await userLogoffCheck(logoffObj)
    if(ok.data.message == "user not found" ){
        res.status(404).send({status:"ok", data:{ message:"User not found"}})
    }
    else if(ok.data.message == "success"){
        ok = await logoutUser(logoffObj)
        if(ok){
            res.status(200).send({status:"ok", data:{ message:"User Logged Out", logoutTime: logoffObj.logoff}})
        }
        else{
            res.status(404).send({status:"ok", data:{ message:"Logout Unsuccessful"}})
        }
    }
    else{
        res.status(422).send({status:"ok", data:{message:"User logged out, please login again"}})
    }
})

router.get('/getWage', async function(req, res){
    empId = req.query.empId
    let duration = 0;
    data = await userExistsCheck(empId)
    if(data){
        result = await getWageDetails(empId)
        for(let i=0; i<= result.logoff.length-1; i++)
            {
                time= Math.abs(result.logoff[i] - result.login[i]) /36e5
                duration += time
            }
        wage = duration*result.wage/24
    res.status(200).send({data:{wage: wage}})
    }
    else res.status(401).send({message:"user not found"})
})

module.exports=router;