import { Button, Dialog, Skeleton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react'
import { sampleUsers } from '../constants/sampleData';
import UserItem from '../shared/UserItem';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';
const AddMemberDialog = ({chatId}) => {
  const {isAddMember}=useSelector((state)=>state.misc);
  const dispatch=useDispatch();
  const [addMembers,isLoadingAddMembers]=useAsyncMutation(useAddGroupMembersMutation);
  const {isLoading,data,isError,error}=useAvailableFriendsQuery(chatId);

  const [selectMembers,setSelectMembers]=useState([]);

    const selectMemberHandler=(id)=>{
        setSelectMembers((prev)=>prev.includes(id)?
         prev.filter((currElement)=>currElement!==id)
         :[...prev,id]
    );
    }

    const closeHandler=()=>{
   
    dispatch(setIsAddMember(false));
    }
    const addMemberSubmitHandler=()=>{
      addMembers("Adding Members...",{members:selectMembers,chatId})
           closeHandler();
    }
    
    useErrors([{isError,error}]);
  return (
    <div>
     <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack width={'20rem'} padding={'2rem'} spacing={'2rem'}>
      <Typography textAlign={'center'}>Add Member</Typography>
      <Stack spacing={'1rem'}>
        {isLoading?<Skeleton/>:data?.friends?.length>0?data?.friends?.map((i)=>(
            <UserItem  key={i._id} user={i} handler={selectMemberHandler} isAdded={selectMembers.includes(i._id)} />
        )
        ):<Typography textAlign={'center'}>No Friends</Typography>}
        </Stack>   
        <Stack direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}>
        <Button color="error" onClick={closeHandler}>Cancel</Button>
        <Button variant='contained' disabled={isLoadingAddMembers} onClick={addMemberSubmitHandler}>Submit Changes</Button>    
        </Stack>   
      </Stack>  
     </Dialog>
    </div>
  )
}

export default AddMemberDialog;
