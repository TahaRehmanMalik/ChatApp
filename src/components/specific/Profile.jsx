import { Avatar, Stack, Typography} from '@mui/material'
import { Face as FaceIcon,AlternateEmail as UserNameIcon,CalendarMonth as CalenderIcon } from '@mui/icons-material'
import React from 'react'
import moment from 'moment/moment'
import { transformImage } from '../../lib/features'

const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} alignItems={'center'}>
        <Avatar 
        src={transformImage(user?.avatar?.url)}
        sx={{
            width:'200px',
            height:'200px',
            objectFit:'contain',
            border:'5px solid white',
            marginBottom:'1rem'
        }}/>
             <ProfileCard heading={"Bio"} text={user?.bio}/>
             <ProfileCard heading={"UserName"} text={user?.username}Icon={<UserNameIcon/>} />
             <ProfileCard heading={"Name"}  text={user?.name} Icon={<FaceIcon/>}/>
             <ProfileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalenderIcon/>}/>
    </Stack>
  )
}

const ProfileCard=({text,Icon,heading})=>(

    <Stack  direction={"row"} sx={{
       spacing:'1rem',
       textAlign:'center',
       color:'white',
       alignItems:'center' 
    }}>
       {Icon && Icon}

       <Stack>
         <Typography variant='body1'>{text}</Typography>
         <Typography color='grey' variant='caption'>{heading}</Typography>
       </Stack>

    </Stack>

)
export default Profile
