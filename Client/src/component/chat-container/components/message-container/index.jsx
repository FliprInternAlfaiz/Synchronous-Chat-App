import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { GET_ALL_MESSAGE, HOST } from '@/utils/constant';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatData, slectedChatType, selectedChatMessage, setSelectedChatMessage } = useAppStore();
  const [isShowImage,setIsShowImage] = useState(false);
  const [imageURL,setimageURL] = useState(null);

  const getMessage = async () => {
    try {
      const response = await apiClient.post(GET_ALL_MESSAGE, { id: selectedChatData._id }, { withCredentials: true });

      if (response) {
        setSelectedChatMessage(response.data);
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedChatData._id && slectedChatType === 'contact') {
      getMessage();
    }
  }, [selectedChatData, slectedChatType, setSelectedChatMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage]);

  const imageregex = (filepath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imageRegex.test(filepath);
  };

  const downloadFile = async (url) => {
    try {
      // Fetch the file as a blob
      const response = await apiClient.get(`${HOST}/${url}`, { responseType: "blob" });
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(response.data);
      
      // Create a link element and set its href to the blob URL
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", url.split("/").pop()); // Use the filename from the URL
      document.body.appendChild(link);
      link.click(); // Trigger the download
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  const renderMessages = () => {
    const { userinfo } = useAppStore();
    let lastDate = null;

    return selectedChatMessage.map((message, index) => {
    

      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {slectedChatType === "contact" && renderDMMessage(message)}
        </div>
      );
    });
  };

  const renderDMMessage = (message) => {
   
    return (
      <div
        className={`${
          message.sender === selectedChatData._id
            ? "text-left"
            : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#212b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#212b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {imageregex(message.fileUrl) ? (
              <div className='cursor-pointer'
              onClick={()=>{
                setIsShowImage(true);
                setimageURL(message.fileUrl);
              }}>
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="image"
                  style={{ maxHeight: '300px', maxWidth: '300px', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className='flex items-center justify-center gap-4'>
                <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3'>
                  <MdFolderZip />
                </span>
                <span>
                  {message.fileUrl.split("/").pop()}
                </span>
                <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300' onClick={() => downloadFile(message.fileUrl)}>
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">{moment(message.timestamp).format("LT")}</div>
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
      {renderMessages()}
      <div ref={scrollRef} />
      {
  isShowImage && (
    <div className='fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg bg-black/50'>
      <div>
        <img src={`${HOST}/${imageURL}`} alt="" className='h-[90vh] w-full object-cover'/>
      </div>
      <div className='flex gap-5 fixed top-0 mt-5'>
        <button 
          className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300" 
          onClick={() => downloadFile(imageURL)}
        >
          <IoMdArrowRoundDown/>
        </button>
        <button 
          className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300" 
          onClick={() => {
            setIsShowImage(false);
            setimageURL(null);
          }}
        >
          <IoCloseSharp/>
        </button>
      </div>
    </div>
  )
}

    </div>
  );
};

export default MessageContainer;
