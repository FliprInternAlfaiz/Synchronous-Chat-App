import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createhcatSlice } from "./slices/chat-slice";

export const useAppStore= create()((...a)=>({
    ...createAuthSlice(...a),
    ...createhcatSlice(...a)
}))