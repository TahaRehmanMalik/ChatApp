import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import {Message} from "../models/message.js"
import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken'
import {cookieOptions} from '../utils/feaature.js'
import { adminSecretKey } from "../app.js";

const adminLogin=(req,res,next)=>{
    try {
        
        const{secretKey}=req.body;
       
        const isMatched=secretKey===adminSecretKey;
        if(!isMatched)
        {
            next(new ErrorHandler("Invalid Admin key",401))
        }
        const token=jwt.sign(secretKey,process.env.JWT_SECRET);
        return res.status(200).cookie("chatApp-admin-token",token,{...cookieOptions,maxAge:1000*60*15})
        .json({
            success:true,
            message:"Authenticated Successfully"
        })
    } catch (error) {
        next(error);
    }
}
const adminLogout=async(req,res,next)=>{
    try {
       return res.status(200).cookie("chatApp-admin-token","",{...cookieOptions,maxAge:0}).json({
        success:true,
        message:"You are Logout Successfully"
       }) 
    } catch (error) {
        next(error);
    }
}
const getAdminData=async(req,res,next)=>{
    try {
        return res.status(200).json({
           admin:true 
        })
    } catch (error) {
        next();
    }
}
const allUsers=async(req,res,next)=>{
    try {
        const users=await User.find();
        const transformedUsers=await Promise.all(
            users.map(async({_id,name,username,avatar})=>{
            const [groups,friends]=await Promise.all([
                Chat.countDocuments({groupChat:true,members:_id}),
                Chat.countDocuments({groupChat:false,members:_id})
            ]);
                return {
                    _id,
                    name,
                    username,
                    avatar:avatar.url,
                    groups,
                    friends
                }
            })
        )
        return res.status(200).json({
            success:true,
            transformedUsers
        })
    } catch (error) {
        next(error);
    }
}
const allChats=async(req,res,next)=>{
    try {
        const chats=await Chat.find().populate("members","name avatar").populate("creator","name avatar");
        const transformedChats=await Promise.all(
            chats.map(async({members,_id,groupChat,name,creator})=>{
             const totalMessages=await Message.countDocuments({chat:_id})
                return {
                    _id,
                    groupChat,
                    name,
                    avatar:members.slice(0,3).map((member)=>member.avatar.url),
                    members:members.map(({_id,name,avatar})=>({
                        _id,
                        name,
                        avatar:avatar.url
                    })),
                    creator:{
                        name:creator?.name||"None",
                        avatar:creator?.avatar.url||""
                    },
                    totalMembers:members.length,
                    totalMessages

                }
            })
        )
        return res.status(200).json({
            success:true,
            transformedChats
        })
    } catch (error) {
        next(error);
    }
}
const allMessages=async(req,res,next)=>{
    try {
        const messages=await Message.find().populate("sender","name avatar").populate("chat","groupChat");
        console.log("messages",messages);
        console.count("Messages1");
        const transformedMessages=messages.map(({_id,content,sender = {}, chat = {},attachemnt,createdAt})=>({
         _id,
        content,
        attachemnt,
        createdAt,
        chat:chat?._id,
        groupChat:chat?.groupChat,
        sender:{
            _id:sender?._id,
            name:sender?.name,
            avatar:sender?.avatar?.url,
        },



        }))
        console.count("Messages");
        return res.status(200).json({
            success:true,
            messages:transformedMessages
        })
    } catch (error) {
        next(error);
        console.log("error",error);
    }
}
const getDashBoardStats=async(req,res,next)=>{
    try {
        const [groupsCount,usersCount,messageCount,chatsCount]=await Promise.all([
            Chat.countDocuments({groupChat:true}),
            User.countDocuments(),
            Message.countDocuments(),
            Chat.countDocuments()
        ])
        const today=new Date();
        const last7Days=new Date();
        last7Days.setDate(last7Days.getDate()-7);
        const last7DaysMessages=await Message.find({
            createdAt:{
                $gte:last7Days,
                $lte:today
            }
        }).select("createdAt")
    
        const messages=new Array(7).fill(0);
        const daysInMilliseconds=1000*60*60*24;
        last7DaysMessages.forEach((message)=>{
            const indexApprox=(today.getTime()-message.createdAt.getTime())/(daysInMilliseconds);
            const index=Math.floor(indexApprox);
            messages[6-index]++;
        }

        )
        const stats={
            groupsCount,
            usersCount,
            messageCount,
            chatsCount,
            messages
        }
        return res.status(200).json({
         success:true,
         stats
        })
    } catch (error) {
        next(error);
    }
}
export {allUsers,allChats,allMessages,getDashBoardStats,adminLogin,adminLogout,getAdminData};