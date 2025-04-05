

 const isAdmin= (req,res,next)=>{
    try {
        const user=req.user;
       
    if(!user){
       
        return res.status(400).json({message:"User required"});
    }
    
    if(user.role==="admin")
    next();
    else
    {
        
        return res.status(401).json({message:"Invalid authorization request"});
    }
    } catch (error) {
       return res.status(400).json({message:error.message});
    }
    }

    module.exports={isAdmin};