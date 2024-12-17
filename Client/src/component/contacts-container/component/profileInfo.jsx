import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST, LOGOUT_ROUTE } from '@/utils/constant';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiEdit2, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';

const ProfileInfo = () => {
  const { userinfo, setUserinfo } = useAppStore();
  const naviate = useNavigate();

  const logout = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
      if (response.status === 200) {
        naviate("/auth");
        setUserinfo(null);

      }
    } catch (error) {
      console.log(error);

    }
  }
  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userinfo.image ? (
              <AvatarImage
                src={`${HOST}/${userinfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-large border-[1px] flex items-center justify-center rounded-full ${getColor(userinfo.color)}`}
              >
                {userinfo.firstName ? userinfo.firstName.split("").shift() : userinfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userinfo.firstName && userinfo.lastName ? `${userinfo.firstName} ${userinfo.lastName}` : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><FiEdit2 className='text-purple-500 text-xl font-medium' onClick={() => naviate("/profile")} /></TooltipTrigger>
            <TooltipContent className="bg-[#1c1c1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><FiLogOut className='text-red-500 text-xl font-medium' onClick={() => logout()} /></TooltipTrigger>
            <TooltipContent className="bg-[#1c1c1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    </div>
  )
}

export default ProfileInfo;
