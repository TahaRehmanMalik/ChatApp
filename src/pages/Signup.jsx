import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { bgGradient } from '../components/constants/color';
import { server } from '../components/constants/config';
import { userExists } from '../redux/reducers/auth';

const Signup = () => {
    const[profileImage,setProfileImage]=useState(null);
    const[uploadImage,setUploadImage]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    const {register,handleSubmit,formState:{errors},reset}=useForm();
   const dispatch=useDispatch();


   const handleImageChange=(event)=>{
    const file=event.target.files[0];
    setUploadImage(file);
    if(file)
    {
     const imageURL=URL.createObjectURL(file);
     console.log("the image url is",imageURL);
     setProfileImage(imageURL);
    }
     }

    const handleSignup=async(data)=>{
      const toastId=toast.loading("Signing up...")
        setIsLoading(true);
        data.Avatar=uploadImage;
        const formData=new FormData();
        formData.append("avatar",data.Avatar);
        formData.append("name",data.Name);
        formData.append("bio",data.Bio);
        formData.append("username",data.Username);
        formData.append("password",data.Password);
    const config={
      withCredentials:true,
      headers:{
        "Content-Type":"multipart/form-data"
      },
    };
    try {
      const {data}=await axios.post(`${server}/api/v1/user/new`,formData,config);
      dispatch(userExists(data.user));
      toast.success(data.message,{id:toastId});
    } catch (error) {
      toast.error(error?.response?.data?.message||"Some Thing went wrong",{id:toastId})
    } finally{
      setIsLoading(false);
    }
        }
       
  return (
    <div style={{backgroundImage:bgGradient}}>
        <Container component={"main"} maxWidth="xs" 
        sx={{display:"flex",justifyContent:"center",alignItems:"center",padding:"2rem"
    }}>
    <Paper elevation={3}
        sx={{
          padding:4,
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
        }}
        >
         <>
             <Typography variant="h5">
               SignUp
             </Typography>
             <form style={{width:"100%",marginTop:"1rem"}} onSubmit={handleSubmit(handleSignup)}>
             <Stack position={"relative"} width={"10rem"} margin={"auto"}>
               <Avatar 
               src={profileImage}
      
               sx={{width:"10rem", height:"10rem",objectFit:"contain"}}/>
                   
              <IconButton sx={{position:'absolute', bottom:"0",right:'0',color:'white',
               bgcolor:'rgba(0,0,0,0.5)',
              ":hover":{
               bgcolor:'rgba(0,0,0,0.7)',
             }
              }}
              component="label"
              >
               <>
               <CameraAltIcon/>
               <input  type='file' name="avatar" accept='image/*' hidden 
                onChange={(e) => {
                handleImageChange(e);
              }} 
                 />
               </>
              </IconButton>
                
                </Stack>
             <TextField 
               required
               fullWidth
               label='Name'
               margin='normal'
               variant='outlined'
               {...register("Name",{required:true})}
               />
                <TextField 
               required
               fullWidth
               label='Bio'
               margin='normal'
               variant='outlined'
               {...register("Bio",{required:true})}
               />
               <TextField 
               required
               fullWidth
               label='Username'
               margin='normal'
               variant='outlined'
               {...register("Username",{required:true})}
               />
                <TextField 
               required
               fullWidth
               type='password'
               label='Password'
               margin='normal'
               variant='outlined'
               {...register("Password",{required:"Please Enter your Password",
                pattern:{
                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                message: "The  min 8 letter password, with at least a symbol, upper and lower case letters and a number"
                },
               })}
               />
               {errors.Password&&<Typography color='error' variant='caption'>{errors.Password.message}</Typography>}
               <Button sx={{marginTop:'1rem'}}
               fullWidth
               variant='contained' color='primary' type='submit' disabled={isLoading}>SignUp</Button>
               <Typography textAlign={'center'} m={'1rem'}>OR</Typography>
              <Link to='/login'><Button fullWidth variant='text' disabled={isLoading}>
                 Login Instead
               </Button>
               </Link>
             </form>
             </>
      </Paper>
      </Container>
    </div>
   
  )
}

export default Signup