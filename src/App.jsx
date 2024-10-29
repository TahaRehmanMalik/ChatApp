import React,{lazy,Suspense, useEffect} from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute';
import { LayoutLoaders } from './components/layout/Loaders';
import axios from 'axios';
import {server} from './components/constants/config'
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNoExists } from './redux/reducers/auth';
import {SocketProvider} from '../src/socket';
const Home=lazy(()=>import('./pages/Home'));
const Login=lazy(()=>import('./pages/Login'));
const Chat=lazy(()=>import('./pages/Chat'));
const Group=lazy(()=>import('./pages/Group'));
const SignUp=lazy(()=>import('./pages/Signup'));
const PageNotFound=lazy(()=>import('./pages/PageNotFound'));
const AdminLogin=lazy(()=>import('./pages/admin/AdminLogin'));
const DashBoard=lazy(()=>import('./pages/admin/Dashboard'));
const UserManagement=lazy(()=>import('./pages/admin/UserManagement'));
const ChatManagement=lazy(()=>import('./pages/admin/ChatManagement'));
const MessageManagement=lazy(()=>import('./pages/admin/MessageManagement'));
import {Toaster} from 'react-hot-toast';
const App = () => {
  const dispatch=useDispatch();
const {user,loader}=useSelector((state)=>state.auth);
  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`, { withCredentials: true })
    .then(({data})=>dispatch(userExists(data.user))).catch((err)=>dispatch(userNoExists()));
  },[dispatch])
  return loader?(<LayoutLoaders/>):(
   <BrowserRouter>
   <Suspense fallback={<LayoutLoaders/>}>
   <Routes>
    <Route element={
      <SocketProvider>
         <ProtectedRoute user={user}/>

      </SocketProvider>
      
      }>
    <Route path='/' element={
      <Home/>
      }/>
    <Route path='/group' element={
      <Group/>

      }/>
    <Route path='/chat/:id' element={
      <Chat/>
      }/>
    </Route>

    <Route path='/login' element={
      <ProtectedRoute user={!user}redirect='/'>
      <Login/>
      </ProtectedRoute>
    }
      />
    <Route path='/signup' element={
      <ProtectedRoute user={!user} redirect='/'>
         <SignUp/>
      </ProtectedRoute>
     }/>

     <Route path='/admin' element={
      <AdminLogin/>        
      }/>
       <Route path='/admin/dashboard' element={
      <DashBoard/>        
      }/>
      <Route path='/admin/users' element={
      <UserManagement/>        
      }/>
       <Route path='/admin/chats' element={
      <ChatManagement/>        
      }/>
       <Route path='/admin/messages' element={
      <MessageManagement/>        
      }/>
     <Route path='*' element={
      <PageNotFound/>
      }
      />
   </Routes>
   </Suspense>
   <Toaster position='bottom-center'/>
   </BrowserRouter>
  )
}

export default App
