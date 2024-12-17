import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userinfo } = useAppStore();

    useEffect(() => {
        if (userinfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userinfo.id },
            });

            socket.current.on("connect", () => {
                console.log("Connected To Socket Server");
            });

            const handleMessage = (message) => {
                const { slectedChatType, selectedChatData, addMessage } = useAppStore.getState();

                // Check if the message belongs to the selected chat
                if (
                    slectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
                ) {
                    addMessage(message);
                }
            };

            // Listen for both received and sent messages
            socket.current.on("receivedMessage", handleMessage);
            socket.current.on("senderMessage", handleMessage);

            return () => {
                socket.current.disconnect();
            };
        }
    }, [userinfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
