import { Typography,Box } from '@mui/material';
import React, { memo } from 'react'
import { lightBlue } from '../constants/color';
import moment from 'moment';
import { formatFile } from '../../lib/features';
import RenderAttachment from './renderAttachment';
import {motion} from 'framer-motion';
const MessageComponent = ({message,user}) => {
    const {sender,content,attachments=[],createdAt}=message;

    const sameSender=sender?._id===user?._id;

    const timeAgo=moment(createdAt).fromNow();
  return (
    <motion.div
    initial={{opacity:0,x:'-100%'}}
    whileInView={{opacity:1,x:0}}
    style={{
        alignSelf:sameSender?'flex-end':'flex-start',
        backgroundColor:'white',
        color:'black',
        borderRadius:'5px',
        width:'fit-content',
        padding:'0.5rem'
    }}
    >
        {!sameSender&&<Typography
          sx={{color:lightBlue,fontWeight:'600px'}}
        variant='caption'>{sender.name}</Typography>}
        {content&&<Typography>{content}</Typography>}
        {/* attachment */}
         {
            attachments.length>0 &&
                attachments.map((attachment,index)=>{
                    const url=attachment.url;
                    const file=formatFile(url);
                return(
                    <Box key={index}>
                        <a href={url} 
                        target='_blank'
                        download
                        style={{
                            color:"black"
                        }}
                        >
                           {RenderAttachment(file,url)} 
                        </a>
                    </Box>
                )
                })
            
         }

        <Typography variant='caption' color={'text.secondary'}>{timeAgo}</Typography>
        </motion.div>
  )
}

export default memo(MessageComponent)