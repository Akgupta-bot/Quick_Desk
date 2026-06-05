const mongoose=require("mongoose")
const tokenBlacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required for blacklisting"],
        unique:[true,"Token is Already blacklisted"]
    },
},{
    timestamps:true
})

tokenBlacklistSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3})

    const tokenBlackListModel=mongoose.model("tokenBlackList",tokenBlacklistSchema)
    module.exports=tokenBlackListModel;