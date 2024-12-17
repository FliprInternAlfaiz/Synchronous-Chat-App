import React from 'react';
import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from './ui/avatar';
import { HOST } from '@/utils/constant';
import { getColor } from '@/lib/utils';

interface ContactListProps {
  contacts: any[];
  isChannel?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, isChannel = false }) => {
  const {
    setSlectedChatType,
    setSelectedChatData,
    selectedChatData,
    setSelectedChatMessage,
  } = useAppStore();

  const handleClick = (contact: any) => {
    if (isChannel) {
      setSlectedChatType('channel');
    } else {
      setSlectedChatType('contact');
    }

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessage([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? 'bg-[#8417ff] hover:bg-[#8417ff]'
              : 'hover:bg-[#f1f111]'
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 text-large border-[1px] flex items-center justify-center rounded-full ${
                      selectedChatData && selectedChatData._id === contact._id
                        ? 'bg-[#ffffff22] border-white/50'
                        : getColor(contact.color)
                    }`}
                  >
                    {contact.firstName
                      ? contact.firstName.charAt(0)
                      : contact.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 items-center flex justify-center rounded-full">
                #
              </div>
            )}
            <span>
              {isChannel ? contact.name : `${contact.firstName} ${contact.lastName}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
