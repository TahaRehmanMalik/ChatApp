import { ErrorHandler } from "../utils/utility.js";
import {Chat} from '../models/chat.js';
import {deleteFilesFromCloudinary, emitEvent, uploadFileToCloudinary} from '../utils/feaature.js';
import {ALERT,NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS} from '../constants/events.js';
import { getOtherMember } from "../lib/helper.js";
import {User} from '../models/user.js';
import {Message} from '../models/message.js';
const newGroupChat=async(req,res,next)=>{
    try {
     const{name,members}=req.body;

        const allMembers=[...members,req.user];
        await Chat.create({
            name,
            groupChat:true,
            creator:req.user,
            members:allMembers
        })
        emitEvent(req,ALERT,allMembers,`welcome to ${name} group`);
        emitEvent(req,REFETCH_CHATS,members);
        return res.status(201).json({
            success:true,
            message:"Group Created"
        })
    } catch (error) {
        next(error);
    }
}
const getMyChats=async(req,res,next)=>{
    try {
       const chats=await Chat.find({members:req.user}).populate(
        "members",
        "name  avatar" 
       )
       
       const transformedChats=chats.map(({_id,name,members,groupChat})=>{
    
        const otherMember=getOtherMember(members,req.user);
       
        return{
            _id,
            avatar:groupChat?members.slice(0,3).map(({avatar})=>(avatar.url)):[otherMember.avatar?.url],
            name:groupChat?name:otherMember.name,
            members:members.reduce((prev,curr)=>{
                if(curr._id.toString()!==req.user.toString())
                 {
                    prev.push(curr._id);
                 } 
                 return prev;
        },[]),
        groupChat
        }
       })

        return res.status(200).json({
            success:true,
            chats:transformedChats
        })
    } catch (error) {
        console.log("my Chat error is",error);
        next(error);
    }
}
const getMyGroup=async(req,res,next)=>{
    try {
        const chats=await Chat.find({members:req.user,
            groupChat:true,
            creator:req.user
        }).populate("members","name avatar");
        const groups=chats.map(({members,_id,groupChat,name})=>({
         _id,
         groupChat,
         name,
         avatar:members.slice(0,3).map(({avatar})=>avatar.url)   
        }))
        return res.status(200).json({
            success:true,
            groups
        })
    } catch (error) {
        next(error);
    }
}
const addMembers=async(req,res,next)=>{
    try {
       const {chatId,members}=req.body;
    
       const chat=await Chat.findById(chatId);
       if(!chat){
        return next(new ErrorHandler("Chat not found",404));
       }
       if(!chat.groupChat)
       {
        return next(new ErrorHandler("This is not a group chat",400));
       }
       if(chat.creator.toString()!=req.user.toString())
       {
        return next(new ErrorHandler("You are not allowed to add members",403));
       }
       const allNewMembersPromise=members.map((i)=>User.findById(i,"name"));
    
       const allNewMembers =await Promise.all(allNewMembersPromise);

       const uniqueMembers=allNewMembers.filter((i)=>(
          !chat.members.includes(i._id.toString())
       )).map((i)=>i._id)
       
       chat.members.push(...uniqueMembers);
       if(chat.members.length>100)
       {
        return next(new ErrorHandler("Group Member Limit reached",400))
       }
       await chat.save();
       const allUserName=allNewMembers.map((i)=>i.name).join(",");
       emitEvent(req,ALERT,chat.members,`${allUserName} has been added to the group`);
       emitEvent(req,REFETCH_CHATS,chat.members);
        return res.status(200).json({
            success:true,
            message:"Members added Successfully"
        })
    } catch (error) {
        next(error);
    }
}
const removeMember=async(req,res,next)=>{
    try {
        const{userId,chatId}=req.body;
        const[chat,userThatwillBeRemoved]=await Promise.all([
            Chat.findById(chatId),
            User.findById(userId,'name')
        ]);
        if(!chat){
            return next(new ErrorHandler("Chat not found",404));
           }
           if(!chat.groupChat)
           {
            return next(new ErrorHandler("This is not a group chat",400));
           }
           if(chat.creator.toString()!=req.user.toString())
           {
            return next(new ErrorHandler("You are not allowed to add members",403));
           }
           if(chat.members.length<=3)
           {
            return next(new ErrorHandler("Group must have at least 3 members",400));
           }
   
            const allChatMembers=chat.members.map((i)=>i.toString());
           chat.members=chat.members.filter((member)=>member.toString()!=userId.toString());
           await chat.save();
        emitEvent(req,ALERT,chat.members,{message:`${userThatwillBeRemoved.name} has been removed from group`,chatId});
        emitEvent(req,REFETCH_CHATS,allChatMembers);
        return res.status(200).json({
            success:true,
            message:"Member Removed Successfully"
        })
    } catch (error) {
        next(error);
    }
}
const leaveGroup=async(req,res,next)=>{
    try {
        const chatId=req.params.id;

        const chat =await Chat.findById(chatId);
       
        if(!chat)
        {
            return next(new ErrorHandler("Chat not found",404));
        }
        if(!chat.groupChat)
        {
            return next(new ErrorHandler("There is not group Chat",400));
        }
        
       const remainingMembers=chat.members.filter((member)=>member.toString()!==req.user.toString());
       if(remainingMembers.length<3)
       {
        return next(new ErrorHandler("Group must have at leats 3 members",400))
       }
       if(chat.creator.toString()===req.user.toString())
       {
        const randomElement=Math.floor(Math.random()*remainingMembers.length);
        const newCreator=remainingMembers[randomElement];
        chat.creator=newCreator;
       }
        chat.members=remainingMembers;
        const [user]=await Promise.all([User.findById(req.user,"name"),chat.save()])
        emitEvent(res,ALERT,chat.members,{message:`User ${user.name} has left the group`,chatId});
        return res.status(200).json({
            success:true,
            message:"Leave Group Successfully"
        })
    } catch (error) {
        next(error);
    }
}
const sendAttachments=async(req,res,next)=>{
    try {
        const {chatId}=req.body;
        const files=req.files||[];
        if(files.length<1)
        {
            return next(new ErrorHandler("Please Upload Attachment",400));
        }
        if(files.length>5)
            {
                return next(new ErrorHandler("Files can't be more than",400));
            }
        const [chat,user]=await Promise.all([Chat.findById(chatId),User.findById(req.user,"name")]);
        if(!chat){
            return next(new ErrorHandler("Chat Not Found",404));
        }
        if(files.length<1)
        {
            return next(new ErrorHandler("Please Provide Attachment",400));
        }
        // Upload files here through cloudinary
        const attachments=await uploadFileToCloudinary(files);
        
        const  messageForDB={content:" ",
            attachments,
            sender:user._id,
            chat:chatId,
        };

        const messageForRealTime={
            ...messageForDB,
            sender:{
                _id:user._id,
                name:user.name
            },
        };

        const message=await Message.create(messageForDB);
        emitEvent(req,NEW_MESSAGE,chat.members,{
            message:messageForRealTime,
            chatId
        })
        emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId});
              
        return res.status(200).json({
            success:true,
            message
        })
    } catch (error) {
        next(error);
    }
}
const getChatDetails=async(req,res,next)=>{
    try {
        if(req.query.populate==="true")
        {
           const chat=await Chat.findById(req.params.id).populate("members","name avatar").lean();
           if(!chat)
           {
            return next(new ErrorHandler("Chat not found",404));
           }
           chat.members=chat.members.map(({_id,name,avatar})=>({
            _id,
            name,
            avatar:avatar.url
           }))
           return res.status(200).json({
            success:true,
           chat
           })
        }
        else{
            const chat=await Chat.findById(req.params.id);
            if(!chat)
            {
             return next(new ErrorHandler("Chat not found",404));
            }
            return res.status(200).json({
                success:true,
               chat
               })
        }
        
    } catch (error) {
        next(error);
    }
}
const renameGroup=async(req,res,next)=>{
    try {
       const chatId=req.params.id;
       const  {name}=req.body; 
       const chat=await Chat.findById(chatId);
       if(!chat)
       {
        return next(new ErrorHandler("Chat not found",404));
       }
       if(!chat.groupChat)
       {
        return next(new ErrorHandler("This is not a group chat",400));
       }
       if(chat.creator.toString()!==req.user.toString())
       {
        return next(new ErrorHandler("You are not allowed to rename the group",403));
       }
       chat.name=name;
       await chat.save();
       emitEvent(req,REFETCH_CHATS,chat.members);
       return res.status(200).json({
        success:true,
        message:"Group renamed Successfully"
       })
    } catch (error) {
        next(error);
    }
}
const deleteChat=async(req,res,next)=>{
    try {
     const chatId=req.params.id;
     console.log("chatId",chatId);
     console.log("request user",req.user);
     const chat =await Chat.findById(chatId);
     if(!chat)
        {
            return next(new ErrorHandler("Chat not found",404));
        }   
        const members=chat.members;
        if(chat.groupChat&&chat.creator.toString()!==req.user.toString())
        {
            return next(new ErrorHandler("You are not allowed to delete the group",403));
        }
        if(!chat.groupChat&& !chat.members.includes(req.user.toString()))
        {
            return next(new ErrorHandler("You are not allowed to delete the group",403));
        }
        // Here we delete all Messages and attachements or file from cloudinary
        const messageWithAttachment=await Message.find({
            chat:chatId,
            attachments:{$exists:true,$ne:[]},
        
        })
        const public_ids=[];
        messageWithAttachment.forEach(({attachments})=>
            attachments.forEach(({public_id})=>public_ids.push(public_id))
        )
 
            await Promise.all([
                // DeleteFile from Cloudinary
                deleteFilesFromCloudinary(public_ids),
                Chat.deleteOne({_id:chatId}),
                Message.deleteMany({chat:chatId})
            ])
            emitEvent(req,REFETCH_CHATS,members);
            return res.status(200).json({
                success:true,
                message:"Chat Deleted Successfully"

            })

    } catch (error) {
        next(error);
        console.log("delete Chat Error",error);
    }
}
const getMessages=async(req,res,next)=>{
    try {
        const chatId=req.params.id;
        const{page=1}=req.query;
        const resultPerPage=20;
        const skip=(page-1)*resultPerPage;
        
        const chat=await Chat.findById(chatId);
        if(!chat)
        {
            return next(new ErrorHandler("Chat not found",404));
        }
        if(!chat.members.includes(req.user.toString()))
        {
          return next(new ErrorHandler("You are not allowed to see that chat",403));
        }
        const[messages,totalMessageCount]=await Promise.all([
            Message.find({chat:chatId}).sort({createdAt:-1})
        .skip(skip).limit(resultPerPage).populate("sender","name").lean(),
        Message.countDocuments({chat:chatId})
        ])
      const totalPages=Math.ceil(totalMessageCount/resultPerPage);
      res.status(200).json({
        success:true,
        messages:messages.reverse(),
        totalPages
      })
    } catch (error) {
        next(error);
    }
}
export {newGroupChat,getMyChats,getMyGroup,addMembers,removeMember,
leaveGroup,sendAttachments,getChatDetails,renameGroup,deleteChat,getMessages};