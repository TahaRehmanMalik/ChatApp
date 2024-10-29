import { AttachFile as AttachFileIcon, Flag, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { greyColor, orange } from '../components/constants/color';
import AppLayout from '../components/layout/AppLayout';
import { InputBox } from '../components/styles/StyledComponent';

import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../components/constants/events';
import MessageComponent from '../components/shared/MessageComponent';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import {useInfiniteScrollTop} from '6pp'
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import MenuFile from '../components/dialogs/MenuFile'
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';
const Chat = ({chatId,user}) => {
  const containerRef=useRef(null);
  const bottomRef=useRef(null);

  const socket=getSocket();
  const dispatch=  useDispatch();
  const navigate=useNavigate();

  const[message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const [page,setPage]=useState(1);
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null);
 const [IamTyping,setIamTyping]=useState(false);
 const [userTyping,setUserTypiing]=useState(false);
 const typingTimeout=useRef(null);
 
  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId});

  const oldMessageChunk=useGetMessagesQuery({chatId,page})

   const {data:oldMessages,setData:setOldMessages}=useInfiniteScrollTop(
   containerRef,
   oldMessageChunk.data?.totalPages,
   page,
   setPage,
   oldMessageChunk.data?.messages

   )
  const members =chatDetails?.data?.chat?.members;

  const messageOnChange=(e)=>{
    setMessage(e.target.value);
    if(!IamTyping)
    {
      socket.emit(START_TYPING,{members,chatId})
    }
  setIamTyping(true);
  if(typingTimeout.current)clearTimeout(typingTimeout.current);
  typingTimeout.current=setTimeout(()=>{
    socket.emit(STOP_TYPING,{members,chatId})
setIamTyping(false);
  },[2000])
  }

  const errors=[{isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessageChunk.isError,error:oldMessageChunk.error}
  ]
  const submitHandler=(e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    //Emitting Message to a Server
    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage("");
  }
useEffect(()=>{
  dispatch(removeNewMessagesAlert(chatId))
return ()=>{
  setMessages([]);
 setMessage("");
 setOldMessages([]);
setPage(1);
}
},[chatId])

useEffect(()=>{
if(bottomRef.current) 
{
  bottomRef.current.scrollIntoView({behaviour:"smooth"})
}
},[messages])

useEffect(()=>{
if(chatDetails.isError)
{
 return  navigate("/");
}
},[chatDetails.isError])

  const newMessagesListener=useCallback((data)=>{
     if(data.chatId!==chatId)return ;
  setMessages((prev)=>[...prev,data.message]);

  },[chatId])

  const startTypingListener=useCallback((data)=>{
  if(data.chatId!==chatId)return;

  setUserTypiing(true);
  },[chatId]);

  const stopTypingListener=useCallback((data)=>{
    if(data.chatId!==chatId)return;
    
    setUserTypiing(false);
    },[chatId])

    const alertListener=useCallback((data)=>{
      if(data.chatId!==chatId)return ;
      const messageForAlert={
        content:data.message,
        sender:{
            _id:"abcdfefghijklmnopqrst",
            name:"Admin"
        },
        chat:chatId,
        createdAt:new Date().toISOString()
    }
    setMessages((prev)=>[...prev,messageForAlert])
    },[chatId])
  const eventHandler={
    [ALERT]:alertListener,
    [NEW_MESSAGE]:newMessagesListener,
    [START_TYPING]:startTypingListener,
    [STOP_TYPING]:stopTypingListener,

  };
        useSocketEvents(socket,eventHandler);
        useErrors(errors);
  
  const fileOpenMenu=(e)=>{
  dispatch(setIsFileMenu(true));
  setFileMenuAnchor(e.currentTarget)
  }
  const allMessages=[...oldMessages, ...messages];
  return chatDetails.isLoading?(<Skeleton/>):(
   <>
   <Stack ref={containerRef}
   boxSizing={'border-box'}
   padding={'1rem'}
   spacing={'1rem'}
   bgcolor={greyColor}
   height={'90%'}
   sx={{
    overflowX:'hidden',
    overflowY:'auto'
   }}
   >
     {/* Render Message */}
      
    {allMessages.map((i)=>(
    <MessageComponent  key={i._id} message={i} user={user} /> 
     ))}
     {
      userTyping&&<TypingLoader/>
     }
     <div ref={bottomRef}/>
   </Stack>
   <form
   style={{
    height:'10%'
   }}
   onSubmit={submitHandler}
   >
    <Stack direction={'row'} height={'100%'}
      padding={"0.5rem"}
    alignItems={'center'}
    position={'relative'}
    >
      <IconButton sx={{
        position:'absolute',
        left:'1.5rem',
        rotate:'30deg',
      }}
      onClick={fileOpenMenu}
      >
      <AttachFileIcon/>
      </IconButton>
   <InputBox placeholder='Type Message Here...' value={message} onChange={messageOnChange}/>
   <IconButton type='submit' sx={{
    rotate:'-20deg',
    bgcolor:orange,
    marginLeft:'1rem',
    padding:'0.5rem',
    "&:hover":{
      bgcolor:'error.dark'
    }
   }}>
    <SendIcon/>
   </IconButton>
    </Stack>
    <MenuFile anchorE1={fileMenuAnchor} chatId={chatId}/> 
   </form>
   </>
  )
}

export default AppLayout(Chat) ;
