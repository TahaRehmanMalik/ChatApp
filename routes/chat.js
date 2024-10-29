import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroup, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from '../controllers/chat.js';
import { attachmentsMulter } from '../middlewares/multer.js';
import { addMemberValidator, chatIdValidator, 
newGroupChatValidator, removeMemberValidator, renameGroupValidator, sendAttachmentsValidator, validateHandler } from '../lib/validators.js';

const app=express.Router();


// After here user must be login to access routes
app.post('/new',isAuthenticated,newGroupChatValidator(),validateHandler,newGroupChat);
app.get('/my',isAuthenticated,getMyChats);
app.get('/my/groups',isAuthenticated,getMyGroup);
app.put('/addmembers',isAuthenticated,addMemberValidator(),validateHandler,addMembers);
app.put('/removemember',isAuthenticated,removeMemberValidator(),validateHandler,removeMember);
app.delete('/leave/:id',isAuthenticated,chatIdValidator(),validateHandler,leaveGroup);
// send Attachment
app.post('/message',isAuthenticated,attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments);
// get messages
app.get('/message/:id',isAuthenticated,chatIdValidator(),validateHandler,getMessages);
// get chat details,rename,delete
app.route("/:id").get(isAuthenticated,chatIdValidator(),validateHandler,getChatDetails)
.put(isAuthenticated,renameGroupValidator(),validateHandler,renameGroup)
.delete(isAuthenticated,chatIdValidator(),validateHandler,deleteChat);

export default app;