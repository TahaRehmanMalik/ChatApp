// Create a new  User save in database and save token in cookie
import { compare } from 'bcrypt';
import{User} from '../models/user.js'
import { cookieOptions, emitEvent, sendToken, uploadFileToCloudinary } from '../utils/feaature.js';
import { ErrorHandler } from '../utils/utility.js';
import {Chat}from '../models/chat.js';
import {Request} from '../models/request.js'
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import { getOtherMember } from '../lib/helper.js';
const newUser=async(req,res,next)=>{
  try {
    const{name,username,password,bio}=req.body;
    console.log("req.body",req.body);
 const file=req.file;
 console.log("The file is",file);
 if(!file)
 {
  return next(new ErrorHandler("Please Upload Avatar"))
 }
 const result=await uploadFileToCloudinary([file]);
    const avatar={
        public_id:result[0].public_id,
        url:result[0].url
    }
    const user= await User.create({name,
         bio,
        username,
        password,
        avatar});
      sendToken(res,user,201,"User Created");   
  } catch (error) {
    next(error);
  }
 
 }
// Login user and save them in cookie
const login=async(req,res,next)=>{
   try {
    const {username,password}=req.body;
    const user=await User.findOne({username}).select("+password");
    if(!user)
    {
      return next(new ErrorHandler("Invalid UserName or Password",404))
    }
    const isMatch=await compare(password,user.password);
    if(!isMatch)
    {
      return next(new ErrorHandler("Invalid UserName or Password",404));
    }
    sendToken(res,user,200,` welcome Back${user.name}`);
   } catch (error) {
    next(error);
   }
 }
const getMyProfile=async(req,res,next)=>{
  try {
    const user=await User.findById(req.user);
    if(!user)
    {
      return next(new ErrorHandler("User not found",404))
    }
      res.status(200).json({
      success:true,
      user
      })  
  } catch (error) {
    next(error);
  }
}
const logout=async(req,res,next)=>{
  try {
    return res.status(200).cookie("chatapp-token","",{...cookieOptions,maxAge:0}).json({
      success:true,
      message:"Logged out Successfully"
    })
  } catch (error) {
    next(error);
  }
}
const searchUser=async(req,res,next)=>{
  try {
    const {name}=req.query;
    // finding all my Chats
    const myChats=await Chat.find({groupChat:false,members:req.user});
    // All user from my chat means friend or people i have chat with
    const allUsersFromMyChat=myChats.flatMap((chat)=>chat.members);
    // Finding all users except me and my friends
    const allUsersExpectMeOrFriend=await User.find({_id:{$nin:allUsersFromMyChat},
    name:{$regex:name,$options:"i"}});
    // modify the response
    const users=allUsersExpectMeOrFriend.map(({_id,name,avatar})=>({
      _id,
      name,
      avatar:avatar.url
    }))
    return res.status(200).json({
      success:true,
      users
    })    
  } catch (error) {
    next(error)
  }

}
const sendFriendRequest=async(req,res,next)=>{
  try {
    const {userId}=req.body;
    const request=await Request.findOne({
      $or:[
        {sender:req.user,receiver:userId},
        {sender:userId,receiver:req.user},

      ]
    });
    if(request)
    {
      return next(new ErrorHandler("Request is already sent",400));
    }
    await Request.create({
      sender:req.user,
      receiver:userId
    })
    emitEvent(req,NEW_REQUEST,[userId]);
   return res.status(200).json({
      success:true,
      message:"Friend Request Sent"
    })
  } catch (error) {
    next(error);
  }
}
const acceptFriendRequest=async(req,res,next)=>{
try {
  const {requestId,accept}=req.body;
  const request=await Request.findById(requestId).populate("sender","name").populate("receiver","name");
  console.log(request);
  if(!request)
  {
    return next(new ErrorHandler("Request not found",404));
  }
  if(request.receiver._id.toString()!=req.user.toString())
  {
    return next(new ErrorHandler("You are not authorized to this request",401));
  }
  if(!accept)
  {
    await request.deleteOne();
    return res.status(200).json({
      status:true,
      message:"Friend Request Rejected"
    })
  }
  const members=[request.sender._id,request.receiver._id];
  await Promise.all([Chat.create({
    members,
    name:`${request.sender.name}-${request.receiver.name}`
  }),request.deleteOne()])
  emitEvent(req,REFETCH_CHATS,members);
  return res.status(200).json({
    status:true,
    message:"Friend Request Accepted",
    senderId:request.sender._id
  })
} catch (error) {
  next(error);
}
}
const getMyNotifications=async(req,res,next)=>{
  try {

    const requests=await Request.find({receiver:req.user}).populate("sender","name avatar");
    const allRequests=requests.map(({_id,sender})=>({
      _id,
      sender:{
        _id:sender._id,
        name:sender.name,
        avatar:sender.avatar.url
      }
    }))
    return res.status(200).json({
      status:true,
      allRequests
    })
  } catch (error) {
    next(error);
  }
}
const getMyFriends=async(req,res,next)=>{
  try {
    const chatId=req.query.chatId;
    const chats=await Chat.find({members:req.user,groupChat:false}).populate("members","name avatar");

    const friends=chats.map(({members})=>{
      const otherUser=getOtherMember(members,req.user);
      return{
        _id:otherUser._id,
        name:otherUser.name,
        avatar:otherUser.avatar.url
      }
    });
    if(chatId){
     const chat=await Chat.findById(chatId);
     const availableFriends=friends.filter((friend)=>(!chat.members.includes(friend._id)));
     return res.status(200).json({
      success:true,
      friends:availableFriends
     })
    }
    else{
     return res.status(200).json({
      success:true,
      friends
     })
    }
  } catch (error) {
    next(error);
  }
}
 export{login,newUser,getMyProfile,logout,searchUser,sendFriendRequest,acceptFriendRequest,getMyNotifications,
  getMyFriends
 };