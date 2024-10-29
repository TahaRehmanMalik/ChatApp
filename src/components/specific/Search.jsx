import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import { setIsSearch } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'
import { useAsyncMutation } from '../../hooks/hook'
const Search = () => {
  const search=useInputValidation("");
  const dispatch=useDispatch();
  const {isSearch}=useSelector((state)=>state.misc);
  const[searchUser]=useLazySearchUserQuery();
  const [sendFriendRequest,isLoadingSendFriendRequest]=useAsyncMutation(useSendFriendRequestMutation);
const[users,setUsers]=useState([]);


  const addFriendHandler=async(id)=>{
    await sendFriendRequest("Sending Friend Request...",{userId:id})
  }
  const searchCloseHandler=()=>{
    dispatch(setIsSearch(false));
  }
  useEffect(()=>{
    
    const timeOutId=setTimeout(()=>{
       searchUser(search.value).then(({data})=>setUsers(data.users))
       .catch((e)=>console.log(e))
      
    },1000);
    return()=>{
      clearTimeout(timeOutId);
    }
    
  },[search.value])
  return (
      <Dialog open={isSearch} onClose={searchCloseHandler}>
        <Stack p={'2rem'} width={"25rem"} overflow={'auto'}>
          <DialogTitle textAlign={"center"}>Find People</DialogTitle>
          <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
          />

          <List>
            {users.map((i)=>(
              <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))}
          </List>
        </Stack>
      </Dialog>
  )
}

export default Search