const UserSchema = require('../models/model')

async function registerUser(userObj){
    request = new UserSchema(userObj)
    try{
        await request.save()
        return true
    }
    catch(ex){
        return false
    }
}

async function loginUser(loginObj){
    try{
        data = await UserSchema.findOne({ empId : loginObj.empId , password : loginObj.password});
        if(data) return true
        else return false
    }
    catch(e){
        console.log("an error occured"+ e)
        return false
    }
}

async function addLoginTime(loginObj){
    try{
        loginTime = await UserSchema.updateOne({ empId : loginObj.empId},{$set : {token: loginObj.token},$push: {login: loginObj.login}})
        return true
    }catch(ex){
        console.log(ex)
        return false
    }
}

async function logoutUser(logoffObj){
    try{
        logoffStatus = await UserSchema.updateOne({ empId : logoffObj.empId},{$set : {token: null},$push: {logoff: logoffObj.logoff}})
        if(logoffStatus.modifiedCount) return true
        else return false
    }
    catch(ex){
        console.log(ex)
        return false
    }
}

async function userLoginCheck(loginObj){
    try{
        loginCheck = await UserSchema.findOne({empId: loginObj.empId})
        if(!loginCheck.token) return false
        else return true
    }
    catch(e){
        console.log(e)
        return false
    }
}

async function userLogoffCheck(logoffObj){
    try{
        logoffCheck = await UserSchema.findOne({empId : logoffObj.empId })
        if(logoffCheck){
            if(logoffCheck.token) return {data:{message:"success"}}
            else return {data:{message:"failure"}}
        }
        else return {data:{message:"user not found"}}
    }
    catch(e){
        return {data:{message:"failure"}}
    }
}

async function getWageDetails(empId){
    try{
        var result = await UserSchema.findOne({ empId:empId }, { _id:0 ,  empId:empId, login: 1, logoff:1, wage: 1 });
        return result
    }
    catch(e){{
        console.log(e)
    }}
}

async function tokenDeleteFunction(empId){
    try{
        tokenExpire = await UserSchema.updateOne({ empId : empId},{$set : {token: null}, $push :{logoff : new Date()}})
        if(tokenExpire.modifiedCount) return true
        else return false
    }
    catch(ex){
        console.log(ex)
        return false
    }
}

async function userExistsCheck(empId){
    try{
        ok = await UserSchema.findOne({empId : empId })
        if(ok) return empId
        else return false
    }
    catch(e) {
        console.log(e)
        return false
    }
}



module.exports= {
    registerUser,
    loginUser,
    addLoginTime,
    userLoginCheck,
    logoutUser,
    userLogoffCheck,
    getWageDetails,
    tokenDeleteFunction,
    userExistsCheck
}
