import  Grid  from '@mui/material/Grid2'
import React, { useState } from 'react'
import { greyColor } from '../constants/color'
import { Box, Drawer, IconButton, Stack, styled, Typography} from '@mui/material';
import { Menu as MenuIcon,Close as CloseIcon, ManageAccounts as ManageAccountsIcon,Dashboard as DashboardIcon,
 Group as GroupIcon,
 Message as MessageIcon,
 ExitToApp as ExitToAppIcon} from '@mui/icons-material'
import { useLocation,Link as LinkComponent, Navigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../redux/thunks/admin';
const Link=styled(LinkComponent)`
text-decoration:none;
border-radius:2rem;
color:black;
padding:1rem 2rem;
&:hover{
color:rgba(0,0,0,0.54)}
`

const adminTabs=[
    {
    name:'Dashboard',
    path:'/admin/dashboard',
    icon:<DashboardIcon/>
},
{
    name:'Users',
    path:'/admin/users',
    icon:<ManageAccountsIcon/>
},
{
    name:'Chats',
    path:'/admin/chats',
    icon:<GroupIcon/>
},
{
    name:'Messages',
    path:'/admin/messages',
    icon:<MessageIcon/>
},
]
const SideBar=({w='100%'})=>{
    const location=useLocation();
    const dispatch=useDispatch();
    const logoutHandler=()=>{
        console.log("logout");
        dispatch(adminLogout());
        
    }
    return (
    <Stack width={w} direction={'column'} spacing={'3rem'} padding={'3rem'}>
      <Typography variant='h5'textTransform={'uppercase'}>ChatMe</Typography>
      <Stack spacing={'1rem'}>
        {adminTabs.map((tab)=>(
         <Link key={tab.path} to={tab.path} sx={
            location.pathname===tab.path&&({bgcolor:'black',color:'white',"&:hover":{color:'white'}})}>
            <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
              {tab.icon}
            <Typography>{tab.name}</Typography>
            </Stack>
         </Link>     
        ))}
        <Link onClick={logoutHandler}>
        <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
         <ExitToAppIcon/>
         <Typography>Logout</Typography>
        </Stack>
        </Link>
    </Stack>
    </Stack>

    
    
)}
const AdminLayout = ({children}) => {
    const {isAdmin}=useSelector((state)=>state.auth)
    const [isMobile,setIsMobile]=useState(false);
    const handleMobile=()=>{
        setIsMobile(!isMobile);
    }
    const handeClose=()=>{
        setIsMobile(false);
    }
    if(!isAdmin){
        return <Navigate to='/admin'/>
    }
  return (
    <Grid container minHeight={'100vh'}>
    <Box sx={{display:{xs:'block',md:'none'},
         position:'fixed',
         top:'1rem',
         right:'1rem'
        }}>
         <IconButton onClick={handleMobile}>
            {isMobile?<CloseIcon/>: <MenuIcon/>}
            
           
         </IconButton>
        </Box>
    <Grid size={{md:4,lg:3}} sx={{ display:{xs:'none',md:'block'}}}>
     <SideBar/>
    </Grid>
    <Grid size={{xs:12,md:8,lg:9}} bgcolor={greyColor}>
       {children}
    </Grid>
    <Drawer open={isMobile} onClose={handeClose}>
       <SideBar w={'50vw'}/>
    </Drawer>
    </Grid>
   
  )
}

export default AdminLayout