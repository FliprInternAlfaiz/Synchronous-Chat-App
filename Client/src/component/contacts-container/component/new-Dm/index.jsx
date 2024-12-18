import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog"

  import { ScrollArea } from "@/components/ui/scroll-area"
import Lottie from 'react-lottie'
import { animationDefaultOption, getColor } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import { CONTACT_SEARCH, HOST } from '@/utils/constant'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useAppStore } from '@/store'

  

const NewDm = () => {

  const {setSlectedChatType,setSelectedChatData} = useAppStore();

    const [OpenNewContactModal, setOpenNewContactModal] = useState(false)
    const [SearchContact, setSearchContact] = useState([])
    const createSearchContact = async (SearchTerm)=>{
        try {
            if(SearchTerm.length>0){
                const  response = await apiClient.post(CONTACT_SEARCH,{SearchTerm},{withCredentials:true})
               
                if(response.status===200 && response.data){
                    
                    
setSearchContact(response.data);
                }
            }
            else{
              setSearchContact([]);
            }
        } catch (error) {
            console.log(error);
            
        }
    }


    const SelectNewContact =(contact)=>{
      setOpenNewContactModal(false);
      setSearchContact([]);
setSlectedChatType("contact");
setSelectedChatData(contact)
    }
  return (
    <>
     <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><FaPlus className='text-neutral-400 font-light text-opacity-90 text-small hover:text-neutral-100 transition-all cursor-pointer duration-300' onClick={() =>setOpenNewContactModal(true)} /></TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-2 text-white">
              Select New Contact
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={OpenNewContactModal} onOpenChange={setOpenNewContactModal}>
  <DialogContent className="bg-[#181920] border-none mb-2 p-3 text-white w-[400px] h-[400px] flex flex-col">
    <DialogHeader>
      <DialogTitle>Please Slect a Contact?</DialogTitle>
      <DialogDescription>
      </DialogDescription>
    </DialogHeader>
    <div>
       <Input placeholder="Search Contacts" className="rounded-md p-6 bg-[#2c2e3b] border" onChange={e=>createSearchContact(e.target.value)}></Input>
    </div>
    {
      SearchContact.length>0 && 
      <ScrollArea className="h-[250px]">
      <div className='flex flex-col gap-5'>
    {SearchContact.map((contact)=>
  (
    <div key={contact._id} className='flex gap-3 items-center cursor-pointer' onClick={()=>SelectNewContact(contact)}>
       <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {contact.image ? (
              <AvatarImage
                src={`${HOST}/${contact.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-large border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}
              >
                {contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="flex flex-col">
<span>
{contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email}
</span>   <span className='text-xs'>{contact.email}</span>     </div>
    </div>
  )
    )}
      </div>
    </ScrollArea>
    }

   
    { SearchContact.length<=0 && 
        <div className='flex-1 md:flex mt-5 lg:mt-0 flex-col justify-center items-center duration-1000 transition-all'>
        <Lottie
        isClickToPauseDisabled={true}
        height={100}
        width={100}
        options={animationDefaultOption}
        />
        <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
          <h3 className='poppins-medium'>
            Hi<span className='text-purple-500'> ! </span>Search New<span className='text-purple-500'> Contacts</span>  
          </h3>
        </div>
        </div>
        }
  </DialogContent>
</Dialog>
    </>
  )
}

export default NewDm



