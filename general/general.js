var cuid = require('cuid')
var generator = require('generate-password');


async function getEmpId(){
   var empId = cuid.slug()
   return empId
}

async function empPass(){
    var password = generator.generate({
        length: 10,
        numbers: true
    })
    return password
}

module.exports= {
    getEmpId, empPass
}

