import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Typography,Box } from '@mui/material';
import { greyColor } from '../components/constants/color';

const Home = () => {
  return (
    <Box sx={{bgcolor:greyColor,height:'100%'}}>
        <Typography p={'2rem'} variant='h5' textAlign={'center'}>Select a Friend to chat</Typography>
    </Box>
  )
}

export default AppLayout(Home);
