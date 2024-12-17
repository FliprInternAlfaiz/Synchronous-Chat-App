export const createhcatSlice = (set, get) => ({
    slectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessage: [],
    directMessageContact:[],
    setSlectedChatType: (slectedChatType) => set({ slectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessage: (selectedChatMessage) => set({ selectedChatMessage }),
    setDirectMessageContact: (directMessageContact) => set({ directMessageContact }),
    closeChat: () => set({ slectedChatType: undefined, selectedChatData: undefined, selectedChatMessage: [] }),
    addMessage: (message) => {
        const selectedChatMessage = get().selectedChatMessage;
        const slectedChatType = get().slectedChatType;

        set({
            selectedChatMessage: [
                ...selectedChatMessage, {
                    ...message,
                    recipient: slectedChatType === "channel" ? message.recipient : message.recipient._id,
                    sender: slectedChatType === "channel" ? message.sender : message.sender._id,
                }
            ]
        })
    }
})