const jwt=require("jsonwebtoken");
module.exports=function(req,res,next){
let token=req.cookies.auth;

if(!token){
    token=req.headers.auth;

}
if(!token){
    res.status(401).json({msg:"لطفا لاگین کنید"});
}else{

    try {
        const verrifyed=jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verrifyed;
        next();
    } catch (error) {
        console.log(error);
        res.status(200).json({msg:"لطفا لاگین کنید" , router:"/login"})
    }
}
}