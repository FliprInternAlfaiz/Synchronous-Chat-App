import { useAppStore } from '@/store';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { colors, getColor } from '@/lib/utils';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Input } from '../../components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE } from '@/utils/constant';

const Profile = () => {
  const navigate = useNavigate();
  const { userinfo, setUserinfo } = useAppStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState(userinfo.image || null); // Initialize with userinfo image
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userinfo.color || 0); // Initialize with userinfo color
  const fileinforef = useRef();

  useEffect(() => {
    if (userinfo.profileSetUp) {
      setFirstName(userinfo.firstName);
      setLastName(userinfo.lastName);
      setSelectedColor(userinfo.color);
    }
    if(userinfo.image){
      setImage(`${HOST}/${userinfo.image}`)
    }
  }, [userinfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error('FirstName is required.');
      return false;
    }
    if (!lastName) {
      toast.error('LastName is required.');
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.put(
          UPDATE_PROFILE,
          { firstName, lastName, selectedColor },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data) {
          setUserinfo({ ...response.data });
          toast.success('Profile updated successfully');
          navigate('/chat');
        }
      } catch (error) {
        console.log(error);
        toast.error('An error occurred while updating the profile');
      }
    }
  };

  const handleNavigate = () => {
    if (userinfo.profileSetUp) {
      navigate('/chat');
    } else {
      toast.error('Please update Profile');
    }
  };

  const handleFileInputClick = () => {
    fileinforef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile-image', file);

      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });


        if (response.status === 200 && response.data.image) {
          setUserinfo({ ...userinfo, image: response.data.image }); // Correct state update
          setImage(response.data.image); // Update local image state
          toast.success('Image updated successfully.');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to upload image.');
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { // Assuming you have a route to delete
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserinfo({ ...userinfo, image: null });
        toast.success('Image deleted successfully.');
        setImage(null); 
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete image.');
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}
                >
                  {firstName ? firstName[0] : userinfo.email[0]}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-1"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}

            <input
              type="file"
              ref={fileinforef}
              className="hidden"
              onChange={handleImageChange} // Correct onChange to pass the function reference
              name="profile-image"
              accept=".png ,.jpg, .jpeg ,.svg ,.webp"
            />
          </div>

          {/* Input here  */}

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userinfo.email}
                className="rounded-lg p-6 bg-[#7C2c3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#7C2c3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#7C2c3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index ? 'outline-white/50 outline-1 ' : ''
                  }`}
                  key={index}
                  onClick={() => {
                    setSelectedColor(index);
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
