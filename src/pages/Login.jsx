import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { bgGradient } from '../components/constants/color';
import { server } from '../components/constants/config';
import { userExists } from '../redux/reducers/auth';
import { useState } from 'react';
const Login = () => {
  const dispatch=useDispatch();
  const {register,handleSubmit,formState:{errors},reset}=useForm();
  const [isLoading,setIsLoading]=useState(false);
  const handleLogin=async(info)=>{
    setIsLoading(true);
    const toastId=toast.loading("Logging In...")
    const config={
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      },
    };
    try {
  
   const {data}=await axios.post(`${server}/api/v1/user/login`,{
        username:info.Username,
        password:info.Password
      },config);

      dispatch(userExists(data.user));
      toast.success(data.message,{id:toastId});
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message||"Some thing went wrong",{id:toastId})
    } finally{
      setIsLoading(false);
    }

       }
  return (
    <div style={{backgroundImage:bgGradient}}>
    <Container component={"main"} maxWidth="xs"
    sx={{height:"100vh", display:"flex",justifyContent:"center",alignItems:"center"
    }}>
    <Paper elevation={3}
        sx={{
          padding:4,
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
        }}
        >
          <Typography variant='h5'>
            Login
          </Typography>
          <form style={{width:'100%',marginTop:'1rem'}} onSubmit={handleSubmit(handleLogin)}>
            <TextField 
            required
            fullWidth
            label='Username'
            margin='normal'
            variant='outlined'
            {...register("Username", { required:true })}
            />
             <TextField 
            required
            fullWidth
            type='password'
            label='Password'
            margin='normal'
            variant='outlined'
            {...register("Password",{ required:"Please Enter your Password",
            })}
            />
            {errors.Password&&<Typography color='error' variant='caption'>{errors.Password.message}</Typography>}
            <Button sx={{marginTop:'1rem'}}
            fullWidth
            variant='contained' color='primary' type='submit'disabled={isLoading}>Login</Button>
            <Typography textAlign={'center'} m={'1rem'}>OR</Typography>
           <Link to='/signup'><Button fullWidth variant='text' disabled={isLoading}>
              Signup
            </Button>
            </Link>
          </form>
        </Paper>
    </Container>
    </div>
  )
}

export default Login;


