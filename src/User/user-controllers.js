// Setting up the controllers
async function loginUser(req,res){
    const {username, password} = req.body
    res.send({username, password})  
}


module.exports = {
    loginUser
}