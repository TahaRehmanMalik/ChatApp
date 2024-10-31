import { Drawer, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { useMyChatsQuery } from '../../redux/api/api';
import { setIsDeleteMenu, setIsMobile, setIsSelectedDeleteChat } from '../../redux/reducers/misc';
import { getSocket } from '../../socket';
import Title from '../shared/Title';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import Header from './Header';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../constants/events';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat';
import { getOrSaveFromStorage } from '../../lib/features';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';
const AppLayout =(WrappedComponent)=>{
    return(props)=>{
    const params=useParams();
  const chatId=params.id;
  const deleteMenuAnchor=useRef(null);
 const navigate=useNavigate();
const dispatch=useDispatch();
const socket=getSocket();

const[onlineUsers,setOnlineUsers]=useState([]);

const {isMobile}=useSelector((state)=>state.misc);
const {user}=useSelector((state)=>state.auth);
const{newMessagesAlert}=useSelector((state)=>state.chat);

  const {isLoading,data,error,isError,refetch}=useMyChatsQuery();
 
  useErrors([{isError,error}]);

  useEffect(()=>{
  getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
  },[newMessagesAlert])

  const handleDeleteChat=(e,chatId,groupChat)=>{
    dispatch(setIsDeleteMenu(true));
    dispatch(setIsSelectedDeleteChat({chatId,groupChat}));
    deleteMenuAnchor.current=e.currentTarget;
   
  }
  const handleMobileClose=()=>{
    dispatch(setIsMobile(false));
  }
  const newMessagesListener=useCallback((data)=>{
   if(data.chatId===chatId)return;
    dispatch(setNewMessagesAlert(data));
  },[chatId]);

  const newRequestListener=useCallback(()=>{
    dispatch(incrementNotification());
  },[]);

const refetchListener=useCallback(()=>{
  refetch();
  navigate('/');
},[refetch]);

const onlineUsersListener=useCallback((data)=>{
setOnlineUsers(data);

},[]);

  const eventHandlers={[NEW_MESSAGE_ALERT]:newMessagesListener,
    [NEW_REQUEST]:newRequestListener,
    [REFETCH_CHATS]:refetchListener,
    [ONLINE_USERS]:onlineUsersListener
  };
  useSocketEvents(socket,eventHandlers);

      return(
    <>
    <Title/>
     <Header/>
     <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor}/>
     {
      isLoading?<Skeleton/>:(
        <Drawer open={isMobile}onClose={handleMobileClose}>
         <ChatList
         width='70vw'
        chats={data?.chats} 
        chatId={chatId}
        handleDeleteChat={handleDeleteChat}
        newMessagesAlert={newMessagesAlert}
        onlineUsers={onlineUsers}
        />
        </Drawer>
      )
     }
     <Grid container height={"calc(100vh - 4rem)"}>
      <Grid size={{sm:4,md:3}} sx={{display:{xs:'none',sm:'block'}}} height={'100%'}>
       {isLoading?<Skeleton/>:
       <ChatList 
       chats={data?.chats} 
       chatId={chatId}
       handleDeleteChat={handleDeleteChat}
       newMessagesAlert={newMessagesAlert}
       onlineUsers={onlineUsers}
       />
       }
  </Grid>
    <Grid size={{xs:12,sm:8,md:5,lg:6}} height={'100%'}> <WrappedComponent {...props} chatId={chatId} user={user}/></Grid>
    <Grid size={{md:4,lg:3}} height={'100%'}  sx={{display:{xs:'none',md:'block'},padding:'2rem',bgcolor:"rgba(0,0,0,0.85)"}}>
      <Profile user={user}/>
      </Grid>
     </Grid>
    </>
    )
  }
}

export default AppLayout;