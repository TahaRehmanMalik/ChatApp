
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/Adminlayout'
import Table from '../../components/shared/Table';
import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import { dashboardData } from '../../components/constants/sampleData';
import { formatFile, transformImage } from '../../lib/features';
import moment from 'moment/moment';
import RenderAttachment from "../../components/shared/renderAttachment"
import {useGetDashboardMessagessQuery} from '../../redux/api/api';
import { useErrors } from '../../hooks/hook';
const columns = [
  { field: 'id', headerName: 'ID',headerClassName:"table-header", width: 200 },
  {field: 'attachments',
   headerName: 'Attachments',
   headerClassName:"table-header",
    width: 150,
    renderCell:(params)=>{
      const {attachments}=params.row;
      return attachments?.length>0?
      attachments.map((i)=>{
        const url=i.url;
        const file=formatFile(url);
        return(
          <Box>
            <a href={url}
               download
               target="_blank"
               style={{color:'black'}}
            >
              {RenderAttachment(file,url)}
            </a>
          </Box>
        )
      })
      :"No Attachemnts"
    }
  },

    {field: 'content',
      headerName: 'Content',
      headerClassName:"table-header",
       width: 400 
      },
      {field: 'sender',
        headerName: 'Sent By',
        headerClassName:"table-header",
         width: 150,
         renderCell:(params)=>(
          <Stack>
            <Avatar src={params.row.sender.avatar} alt={params.row.sender.name}/>
            <span>{params.row.sender.name}</span>
          </Stack>
          
         )
       },
      {field: 'chat',
        headerName: 'Chat',
        headerClassName:"table-header",
         width: 220 
        },
        {field: 'groupChat',
          headerName: 'Group Chat',
          headerClassName:"table-header",
           width: 100 
          },
          {field: 'createdAt',
            headerName: 'Time',
            headerClassName:"table-header",
             width: 250 
            },
 
]
const MessageManagement= () => {
  const[rows,setRows]=useState();
  const {isLoading,data,isError,error}=useGetDashboardMessagessQuery();
  useErrors([{isError:isError,error:error}])
 
  useEffect(()=>{
    if(data){
      setRows(data.messages.map((i)=>({
        ...i,
        id:i._id,
        sender:{
          name:i.sender.name,
          avatar:transformImage(i.sender.avatar,50)
        },
        createdAt:moment(i.createdAt).format('MMMM Do YYYY, h:mm:ss a')
      })))
    }
    
  },[data])
  return (
    <AdminLayout>
      {isLoading?<Skeleton height={'100vh'}/>:
       <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}/>
     }
    
    </AdminLayout>
  )
}




export default MessageManagement;