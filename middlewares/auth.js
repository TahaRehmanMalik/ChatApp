import { adminSecretKey } from "../app.js";
import { CHATAPP_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken';

const isAuthenticated=(req,res,next)=>{
   const token=req.cookies[CHATAPP_TOKEN];
    if(!token)
    {
        return next(new ErrorHandler("please Login to access this route",401));
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
     req.user=decodedData._id;
  
    next();
}
const adminOnly=(req,res,next)=>{
    const token=req.cookies["chatApp-admin-token"];
     if(!token)
     {
         return next(new ErrorHandler("Only Admin can access this route",401));
     }
     const secretkey=jwt.verify(token,process.env.JWT_SECRET);
     const isMatched=secretkey===adminSecretKey;
        if(!isMatched)
            {
                next(new ErrorHandler("Only Admin can access this route",401))
            }
     next();
 }
 const socketAuthenticator=async(err,socket,next)=>{
    try {
        if(err)
        {
            return next(err);
        }
        const authToken= socket.request.cookies[CHATAPP_TOKEN];
       if(!authToken)
        {
            return next(new ErrorHandler("Please Login to access this route",401));
        } 
       const decodedData= jwt.verify(authToken,process.env.JWT_SECRET);
       const user=await User.findById(decodedData._id);
       if(!user)
       {
        return next(new ErrorHandler("Please Login to access this route",401));
       }
       socket.user=user;
       return next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Please Login to access this route",401))
    }
 };
export {isAuthenticated,adminOnly,socketAuthenticator};