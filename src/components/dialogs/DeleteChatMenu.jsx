
import { Menu,Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'
import { useNavigate } from 'react-router-dom'

const DeleteChatMenu = ({dispatch,deleteMenuAnchor}) => {
    const navigate=useNavigate();
    const {isDeleteMenu,selectedDeleteChat}=useSelector((state)=>state.misc);
    const [deleteChat,_,deleteChatData]=useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup,__,leaveGroupData]=useAsyncMutation(useLeaveGroupMutation);
   
    const closeHandler=()=>{
      dispatch(setIsDeleteMenu(false));
      deleteMenuAnchor.current=null;
    }
    const isGroup=selectedDeleteChat.groupChat;

 const leaveGroupHandler=()=>{
closeHandler();
leaveGroup("Leaving Group...",selectedDeleteChat.chatId);
 }
 const deleteChatHandler=()=>{
closeHandler();
console.log("chatId",selectedDeleteChat.chatId)
deleteChat("Deleting Chat...",selectedDeleteChat.chatId);
 }
 useEffect(()=>{
if(deleteChatData||leaveGroupData)
{
    navigate("/");
}
 },[deleteChatData,leaveGroupData])
  return (
    <Menu open={isDeleteMenu}
    anchorEl={deleteMenuAnchor.current}
    onClose={closeHandler}
    anchorOrigin={{
        vertical:"bottom",
        horizontal:'right'
    }}
    transformOrigin={{
        vertical:"center",
        horizontal:'center'
    }}
    >
        <Stack
        sx={{
            width:'10rem',
            padding:'0.5rem',
            cursor:'pointer'
        }}
        direction={'row'}
        alignItems={'center'}
        spacing={'0.5rem'}
        onClick={isGroup?leaveGroupHandler:deleteChatHandler}
        >
        {isGroup?<><ExitToAppIcon/><Typography>Leave Group</Typography></>
        :
        <><DeleteIcon/><Typography>Delete Chat</Typography></>}
        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu