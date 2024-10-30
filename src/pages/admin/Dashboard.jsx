import React from 'react'
import AdminLayout from '../../components/layout/Adminlayout';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon} from '@mui/icons-material';
import moment from 'moment/moment';
import { CurveButton, SearchField } from '../../components/styles/StyledComponent';
import { DoughnutChart, LineChart } from '../../components/specific/Chart';
import { useGetDashboardStatsQuery } from '../../redux/api/api';
import{LayoutLoaders} from '../../components/layout/Loaders';
import {useErrors} from '../../hooks/hook'
const Dashboard = () => {
  const { data, error, isLoading,isError }=useGetDashboardStatsQuery();
  const {stats}=data||{};
  useErrors([{isError:isError,error:error}])
    const AppBar=(
      <Paper elevation={3} sx={{padding:'2rem',margin:'2rem 0'}}>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} borderRadius={'1rem'}>
         <AdminPanelSettingsIcon sx={{fontSize:'3rem'}}/>
         <SearchField placeholder='Search....'/>
         <CurveButton>Search</CurveButton>
         <Box sx={{flexGrow:1}}/>
         <Typography
         sx={{
          display:{xs:'none',md:'block'},
          textAlign:'center',
          color:'rgba(0,0,0,0.7)'
         }}
         >{moment().format("dddd, D MMMM  YYYY")}</Typography>
         <NotificationsIcon/>
      </Stack>
      </Paper>
    )
    


    const Widgets=<Stack
    direction={{xs:'column',sm:'row'}}
    justifyContent={'space-between'}
    alignItems={'center'}
    spacing={'2rem'}
    margin={'2rem 0'}
>
<Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon/>}/>
<Widget title={"Chats"} value={stats?.chatsCount} Icon={<GroupIcon/>}/>
<Widget title={"Messages"} value={stats?.messageCount} Icon={<MessageIcon/>}/>
</Stack>


  return isLoading?<LayoutLoaders/>:(
    <AdminLayout>
     <Container component={'main'}>
     {AppBar}
     <Stack direction={{
      xs:'column',
      lg:'row'
     }} gap={'2rem'}
     flexWrap={'wrap'}
     
     justifyContent={'center'}
     alignItems={{
      xs:'center',
      lg:'stretch'
     }}>
        <Paper elevation={3} 
        sx={{
            padding:'2rem 3.5rem',
            borderRadius:'1rem',
             width:'100%', 
            maxWidth:'45rem',
        }}>
            <Typography sx={{margin:'2rem 0'}} variant='h4'>Last Messages</Typography>
            <LineChart value={stats?.messages||[]}/>
         </Paper>
        <Paper  elevation={3}
        sx={{
            padding:'1rem',
            borderRadius:'1rem',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            width:{xs:'100%',md:'50%'},
            position:'relative',
            width:'100%',
            maxWidth:"25rem",
            

        }}>
            <DoughnutChart labels={["Single Chat","Group Chat"]} value={[
            stats?.chatsCount-stats?.groupsCount||0
            
            ,stats?.groupsCount||0]}/>
          <Stack sx={{
            position:'absolute',
            justifyContent:'center',
            alignItems:'center',
            spacing:'0.5rem',
            height:'100%',
            width:"100%"
          }}
          direction={'row'}
          >
           <GroupIcon/>
           <Typography>Vs</Typography>
           <PersonIcon/>
            </Stack>  
        </Paper>
     </Stack>
     {Widgets}
     </Container>
    
    </AdminLayout>
    
  )
}
const Widget=({title,value,Icon})=>
    <Paper elevation={3}
      sx={{
        padding:'2rem',
        margin:'2rem 0',
        borderRadius:'2rem',
        width:'25rem'
    }}>
        <Stack alignItems={'center'} spacing={'1rem'}>
         <Typography sx={{
            color:'rgba(0,0,0,0.7)',
            borderRadius:'50%',
            width:'5rem',
            height:'5rem',
            border:'5px solid rgba(0,0,0,0.9)',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'

         }}>{value}</Typography>
         <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
            {Icon}
            <Typography>{title}</Typography>
         </Stack>
        </Stack>
    </Paper>

export default Dashboard;


