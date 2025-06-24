const User = require("../models/User");

const getAllUsers = async(req,res)=>{ 

    const users = await User.find().select("").lean({ virtuals: true });

    if (!users){
        return res.status(400).json({message: "No users found"});
    }
    res.json(users);
}
module.exports = {
    getAllUsers}