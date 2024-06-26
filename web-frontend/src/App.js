// react
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// context
import { AppProvider } from './context/AppContext';

// pages 
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UpdatePassword from './pages/UpdatePassword';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Channel from './pages/Channel';
import Channels from './pages/Channels';
import Chat from './pages/Chat';
import CreateChannel from './pages/CreateChannel';
import CreateGroup from './pages/CreateGroup';
import Discussion from './pages/Discussion';
import Group from './pages/Group';
import Groups from './pages/Groups';
import Notification from './pages/Notification';
import Profile from './pages/Profile';
import Search from './pages/Search';
import UpdateProfile from './pages/UpdateProfile';
import CreateVideo from './pages/CreateVideo';
import EditChannel from './pages/EditChannel';
import EditGroup from './pages/EditGroup';
import VideoChat from './pages/VideoChat';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-channel/:id" element={<EditChannel />} />
          <Route path="/create-channel" element={<CreateChannel />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/channels/:id" element={<Channel />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/update-pass/:id" element={<UpdatePassword />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/edit-group/:id" element={<EditGroup />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/discussion/:id" element={<Discussion />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<Group />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/search/:cat/:search" element={<Search />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/video-chat" element={<CreateVideo />} />
          <Route path="/video-chat/:id" element={<VideoChat />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
