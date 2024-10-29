import { Container, Paper, TextField, Typography,Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useInputValidation } from '6pp'
import { Navigate } from 'react-router-dom'
import { bgGradient } from '../../components/constants/color'
import { useSelector,useDispatch} from 'react-redux'
import { adminLogin, getAdmin } from '../../redux/thunks/admin'

const AdminLogin = () => {
const dispatch=useDispatch();
  const {isAdmin}=useSelector((state)=>state.auth)
  const secretKey=useInputValidation("");
  const submitHandler=(e)=>{
   
    e.preventDefault();
   
    dispatch(adminLogin(secretKey.value));
  }
  useEffect(()=>{
    dispatch(getAdmin());

  },[dispatch])
  if(isAdmin)
  {
     return <Navigate to='/admin/dashboard'/>
  }
 
  return (
    <div style={{backgroundImage:bgGradient}}>
      <Container component={'main'} maxWidth={'xs'} sx={{height:'100vh', display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Paper elevation={3} sx={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          padding:4
        }}>
          <Typography variant='h5'>Admin Login</Typography>
          <form style={
            {
               width:'100%',
               marginTop:'1rem'
          }} onSubmit={submitHandler}>
            <TextField
            required
            fullWidth
            label='Secret Key'
            type='password'
            variant='outlined' 
            margin='normal'
            value={secretKey.value}
            onChange={secretKey.changeHandler}
            />
            <Button sx={{
              marginTop:'1rem'
            }}variant='contained'
            color='primary' type='submit' fullWidth>Login</Button>
          </form>
        </Paper>
      </Container>
    </div>
  )
}

export default AdminLogin