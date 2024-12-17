import ChatContainer from '@/component/chat-container';
import ContactContainer from '@/component/contacts-container';
import EmptyChatContainer from '@/component/empty-chat-container';
import { useAppStore } from '@/store';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {
  const { userinfo,slectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userinfo.profileSetUp === false) {
      toast("Please set up your profile to continue.");
      navigate("/profile");
    }
  }, [userinfo, navigate]);

  return (
    <div className='flex h-[100vh] text-white overflow-x-hidden'>
      <ContactContainer/>
      {
        slectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/>
      }
     
    </div>
  );
};

export default Chat;
