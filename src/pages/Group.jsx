import React, { lazy, Suspense, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import { bgGradient, matBlack} from '../components/constants/color';
import { Backdrop, Box, Button, CircularProgress, Drawer, IconButton,Stack,TextField,Tooltip, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace  as KeyboardBackspaceIcon,Menu as MenuIcon} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '../components/styles/StyledComponent';
import AvatarCard from '../components/shared/AvatarCard';

import UserItem from '../components/shared/UserItem';
import {  useChatDetailsQuery, useMyGroupsQuery, useRenameGroupMutation,
  useRemoveGroupMemberMutation, 
  useDeleteChatMutation} from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { LayoutLoaders } from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import {setIsAddMember} from '../redux/reducers/misc';
const ConfirmDeleteDialog=lazy(()=>import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog=lazy(()=>import('../components/dialogs/AddMemberDialog'));
const Group = () => {
  const {isAddMember}=useSelector((state)=>state.misc);
  const chatId=useSearchParams()[0].get('group');

  const navigate=useNavigate();
  const dispatch=useDispatch();

const myGroups=useMyGroupsQuery("");

const groupDetails=useChatDetailsQuery({chatId,populate:true},{skip:!chatId});

const [updateGroup,isLoadingGroupName]=useAsyncMutation(useRenameGroupMutation);
const [removeMember,isLoadingRemoveMember]=useAsyncMutation(useRemoveGroupMemberMutation);
const [deleteGroup,isLoadingDeleteGroup]=useAsyncMutation(useDeleteChatMutation);

  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false);
  const [isEdit,setIsEdit]=useState(false);
  const [groupName,setGroupName]=useState("");
  const [groupNameUpdatedValue,setGroupNameUpdatedValue]=useState('');
  const [confirmDeleteDialog,setIsConfirmDeleteDialog]=useState(false);
 const [members,setMembers]=useState([]);
  
const errors=[{isError:myGroups.isError,error:myGroups.error},
     {isError:groupDetails.isError,error:groupDetails.error}
];
useErrors(errors);

useEffect(()=>{
if(groupDetails.data)
{  
  setGroupName(groupDetails.data.chat.name);
  setGroupNameUpdatedValue(groupDetails.data.chat.name);
  setMembers(groupDetails.data.chat.members);
  return()=>{
    setGroupName('');
    setGroupNameUpdatedValue('');
    setMembers([]);
    setIsEdit(false);
  }
}
},[groupDetails.data]);
  const navigateBack=()=>{
     navigate('/');
  }
  const handleMobile=()=>{
setIsMobileMenuOpen(prev=>!prev);
  };
  const handleMobileClose=()=>{
    setIsMobileMenuOpen(false);
  }
  const updateGroupName=()=>{
    setIsEdit(false);
    updateGroup("Updating Group Name...",{chatId,name:groupNameUpdatedValue});
    console.log(groupNameUpdatedValue);
  }

  const openConfirmDeleteHandler=()=>{
    setIsConfirmDeleteDialog(true);
  }

  const closeConfirmDeleteHandler=()=>{
    setIsConfirmDeleteDialog(false);
  }

  const openAddMemberHandler=()=>{
 
    dispatch(setIsAddMember(true));
  }

   const deleteHandler=()=>{
     deleteGroup("Delete Group...",chatId);
      closeConfirmDeleteHandler();
      navigate('/group');
   }
 const removeMemberHandler=(userId)=>{
removeMember("Removing Member...",{chatId,userId});
 }


  useEffect(()=>{
    if(chatId)
    {
      setGroupName(`Group Name${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

  return ()=>{
    setGroupName('');
    setGroupNameUpdatedValue('');
    setIsEdit(false);
  }
  },[chatId])

const ButtonGroup=<Stack
direction={{xs:'column-reverse',sm:'row'}}
 spacing={'1rem'}
 padding={{
  xs:'0',
  sm:'1rem',
  md:'1rem 4rem'
 }}

>
<Button size='large' color='error' startIcon={<DeleteIcon/>} onClick={openConfirmDeleteHandler}>Delete Group</Button>
<Button size='large' variant='contained' startIcon={<AddIcon/>}onClick={openAddMemberHandler}>Add Member</Button>
</Stack>

  const IconBtns=
    <>
    <Box sx={{
      position:'fixed',
      top:'1rem',
      right:'1rem',
      display:{sm:'none',xs:'block'}
    }}
   
    >
      <IconButton onClick={handleMobile}>
        <MenuIcon/>
      </IconButton>
    </Box>
    <Tooltip title='back'>
    <IconButton
    sx={{
      position:'absolute',
      top:'2rem',
      left:'2rem',
      bgcolor:matBlack,
      color:'white',
      '&:hover':{
      bgcolor:'rgba(0,0,0,0.6)'
      }
    }}
    onClick={navigateBack}
    >
       <KeyboardBackspaceIcon/>
    </IconButton>
    </Tooltip>
    </>;
    const GroupName=<Stack direction={'row'} 
    sx={{
      justifyContent:'center',
      alignItems:'center',
      spacing:'1rem',
      padding:'3rem'
    }}
    >
  {
    isEdit?(<>
    <TextField value={groupNameUpdatedValue} onChange={(e)=>setGroupNameUpdatedValue(e.target.value)}/>
    <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
      <DoneIcon/>
    </IconButton>
    </>):(   
    <>
    <Typography variant='h4'>{groupName}</Typography>
      <IconButton disabled={isLoadingGroupName}  onClick={()=>setIsEdit(true)}>
         <EditIcon/>
      </IconButton>
    </>
    
    )
  }
    </Stack>;

return myGroups.isLoading?<LayoutLoaders/>: (
    <Grid container height={'100vh'}>
      <Grid size={{sm:4}}
      sx={{
        display:{xs:'none',sm:'block'},
      }}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Grid>
      <Grid 
       size={{xs:12, sm:8}}
      sx={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        padding:'1rem 3rem',
        position:'relative'

      }}>
       {IconBtns}
       {
         groupName&&(<>
         {GroupName}
         <Typography sx={{
          alignSelf:'flex-start',
          margin:'1rem'
         }}variant='body1'>Member</Typography>
         <Stack
         sx={{
          maxWidth:'45rem',
          width:"100%",
          height:'50vh',
          boxSizing:'border-box',
          spacing:'2rem',
          overflow:'auto',
          padding:{
              xs:'1rem',
              sm:'0rem',
              md:'1rem 4rem'
          }
         }}
         >
          {/* Members */}
          {
            isLoadingRemoveMember?<CircularProgress/>:members.map((i)=>(
              <UserItem user={i} 
              key={i._id}
              isAdded 
              styling={{
                boxShadow:'0 0 0.5rem rgba(0,0,0,0.2)',
                borderRadius:'1rem',
                padding: "1rem 2rem"
              }} 
              handler={removeMemberHandler}
              />
            ))
          }
         </Stack>
         {ButtonGroup}
         </>)
       }
      </Grid>
      {/* Mobile View */}
      {isAddMember&&<Suspense fallback={<Backdrop open/>}><AddMemberDialog chatId={chatId}/></Suspense>}
      {
        confirmDeleteDialog&&(<>
        <Suspense fallback={<Backdrop open/>}>
        <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/>

        </Suspense>
       </>)
      }
      <Drawer sx={{display:{xs:"block",sm:'none'}}} open={isMobileMenuOpen} onClose={handleMobileClose}>
      <GroupsList w={'50vw'} myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Drawer>
    </Grid>
  )
}
const GroupsList=({w='100%',myGroups=[],chatId})=>(
 <Stack width={w} sx={{
  backgroundImage:bgGradient,
  height:'100vh',
  overflow:'auto'
 }}>
  {myGroups.length>0?(myGroups.map((group)=>(<GroupListItem group={group} chatId={chatId} key={group._id}/>))):(<Typography textAlign={'center'} padding={'1rem'}>No Groups</Typography>)}
 </Stack>
);
const GroupListItem=({group,chatId})=>{
const {name,avatar,_id}=group;
return(
  <Link to={`?group=${_id}`} onClick={(e)=>{
    if(chatId===_id)e.preventDefault()}}>
   <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
  <AvatarCard avatar={avatar}/>
  <Typography>{name}</Typography>
</Stack>
  </Link>
)
}
export default Group