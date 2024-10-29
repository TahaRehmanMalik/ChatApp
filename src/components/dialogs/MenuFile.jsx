import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setIsUploadingLoader } from '../../redux/reducers/misc';
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../../redux/api/api';

const MenuFile = ({anchorE1,chatId}) => {
  const {isFileMenu}=useSelector((state)=>state.misc);
  const dispatch=useDispatch();

  const imageRef=useRef(null);
  const audioRef=useRef(null);
  const videoRef=useRef(null);
  const fileRef=useRef(null);


   const [sendAttachments]=useSendAttachmentsMutation();

  const closeFileMenu=()=>{
    dispatch(setIsFileMenu(false));
  }
 const selectImage=()=>imageRef.current?.click();
 const selectAudio=()=>audioRef.current?.click();
 const selectVideo=()=>videoRef.current?.click();
 const selectFile=()=>fileRef.current?.click();


  const fileChangeHandler=async(e,key)=>{
const files=Array.from(e.target.files);
if(files.length<0)return;
if(files.length>5)
{
  return toast.error(`You can only send 5${key} at a time`);
}
dispatch(setIsUploadingLoader(true));
const toastId=toast.loading(`Sending ${key}...`);
closeFileMenu();
try {
  //fetching here
  const myForm=new FormData();
  myForm.append("chatId",chatId);
  files.forEach((file)=>myForm.append("files",file));
  const res=await sendAttachments(myForm);
  if(res.data)
  {
    toast.success(`${key} Sent Successfully`,{id:toastId});
  }
  else{
    toast.error(`Failed to send ${key}`,{id:toastId});
  }

} catch (error) {
  toast.error(error,{id:toastId});
}finally{
  dispatch(setIsUploadingLoader(false));
}
  };
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div style={{
        width:'10rem'
      }}>
       <MenuList>
        <MenuItem onClick={selectImage}>
        <Tooltip title="Image">
          <ImageIcon/>
        </Tooltip>
        <ListItemText sx={{marginLeft:'0.5rem'}}>Image</ListItemText>
        <input type='file' multiple accept='image/jpeg, image/png, image/gif'
        style={{display:'none'}}
        onChange={(e)=>fileChangeHandler(e,"Images")}
        ref={imageRef}
        />
        </MenuItem>
       
        <MenuItem onClick={selectAudio}>
        <Tooltip title="Audio">
          <AudioFileIcon/>
        </Tooltip>
        <ListItemText sx={{marginLeft:'0.5rem'}}>Audio</ListItemText>
        <input type='file' multiple accept='audio/mpeg,audio/wav'
        style={{display:'none'}}
        onChange={(e)=>fileChangeHandler(e,"Audios")}
        ref={audioRef}
        />
        </MenuItem>
       
        <MenuItem onClick={selectVideo}>
        <Tooltip title="Video">
          <VideoFileIcon/>
        </Tooltip>
        <ListItemText sx={{marginLeft:'0.5rem'}}>Video</ListItemText>
        <input type='file'multiple accept='video/mp4,video/webm,video/ogg'
        style={{display:'none'}}
        onChange={(e)=>fileChangeHandler(e,"Videos")}
        ref={videoRef}
        />
        </MenuItem>
    
        <MenuItem onClick={selectFile}>
        <Tooltip title="File">
          <UploadFileIcon/>
        </Tooltip>
        <ListItemText sx={{marginLeft:'0.5rem'}}>File</ListItemText>
        <input type='file'multiple accept='*'
        style={{display:'none'}}
        onChange={(e)=>fileChangeHandler(e,"Files")}
        ref={fileRef}
        />
        </MenuItem>
       </MenuList>
      </div>
    </Menu>
  )
}

export default MenuFile