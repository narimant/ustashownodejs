const jwt=require("jsonwebtoken");
const User=require('../models/User')
module.exports=async function(req,res,next){
let token=req.cookies.auth;

if(!token){
    token=req.headers.auth;

}

if(!token){
    res.status(401).json({msg:"لطفا لاگین کنید"});
}else{
  
    const adminEmail=process.env.ADMIN_EMAIL

    const amdinData=await User.findOne({email:adminEmail})

    try {
        const verrifyed=jwt.verify(token,process.env.TOKEN_SECRET);
     
        if(verrifyed._id===amdinData._id.toString() ){
            
            req.user=verrifyed;
            next();
        }else{
            res.status(422).json({msg:"شما اجازه دسترسی ندارید  " }); 
        }
        
    } catch (error) {
        console.log(error);
        res.status(200).json({msg:"لطفا لاگین کنید" , router:"/login"})
    }
}
}