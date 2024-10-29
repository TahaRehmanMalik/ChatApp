import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { transformImage } from '../../lib/features'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { setIsNotification } from '../../redux/reducers/misc'
const Notification = () => {
  const {isLoading,isError,data,error} =useGetNotificationsQuery();
  const {isNotification} =useSelector((state)=>state.misc);
  const [acceptRequest]=  useAsyncMutation(useAcceptFriendRequestMutation);
  const dispatch=useDispatch();
  const friendRequestHandler=async({_id,accept})=>{
    // add friend request handler
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...",{requestId:_id,accept});
  }
 
  const closeNotificationHandler=()=>{
 dispatch(setIsNotification(false));
  }
  useErrors([{isError,error}])
  return (
    
    <Dialog open={isNotification} onClose={closeNotificationHandler}>
    <Stack p={{xs:'1rem',sm:"2rem"}}maxWidth={'25rem'}> 
        <DialogTitle>Notifications</DialogTitle>
       {
        isLoading?<Skeleton/>
        : 
        <>
        {
          data?.allRequests.length>0?(
           data?.allRequests.map((i)=>(
           <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>
         ))
         ):
         (<Typography textAlign={'center'}>0 Notifications</Typography>)
       }
        </>
       }
      </Stack>
    </Dialog>
  )
}
const NotificationItem=memo(({sender,_id,handler})=>{
  const {name,avatar}=sender;
  return(
    <ListItem >
        <Stack direction={'row'}
        sx={{
            alignItems:'center',
            spacing:"1rem",
           width:'100%',
        }}
        >
            <Avatar src={transformImage(avatar)} />
            <Typography variant='body1'
            sx={{
                flexGrow:1,
                display:'-webkit-box',
                WebkitLineClamp:1,
                WebkitBoxOrient:"vertical",
                overflow:'hidden',
                textOverflow:'ellipsis',
                width:'100%'

            }}
            >{`${name} Send you a freind Request`}</Typography>
            <Stack direction={{xs:'column',sm:'row'}}>
              <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
              <Button color='error' onClick={()=>handler({_id,accept:true})}>Reject</Button>
            </Stack>

        </Stack>
    </ListItem>
  )
})
export default Notification
