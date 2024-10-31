import { Error as ErrorIcon } from '@mui/icons-material'
import { Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
     <Container maxWidth='lg' sx={{height:'100vh'}}>
      <Stack alignItems={'center'}spacing={'2rem'} justifyContent={'center'}
      height={'100%'}
      >
        <ErrorIcon sx={{fontSize:"10rem"}}/>
        <Typography variant='h1'>404</Typography>
        <Typography variant='h3'>Page Not found</Typography>
        <Link to="/">Go back to home</Link>
      </Stack>
     </Container>
  )
}

export default PageNotFound