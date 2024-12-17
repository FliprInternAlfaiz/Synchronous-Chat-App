import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/lottie-json"
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const colors = [
    "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff06faa]",
    "bg-[#d6d2a6a2] text-[#8b66a0] border-[1px] border-[#4606babb]",
    "bg-[#ff0ea57] text-[#f0660a] border-[1px] border-[#aff0ea6a]",
    "bg-[#ff0ea6a] text-[#f0660a] border-[1px] border-[#8b66a0bb]",
    "bg-[#4c4c9f02a] text-[#f0660a] border-[1px] border-[#4c4c9f0b]"
];

export const getColor = (color) => {
    if (color >= 0 && color < colors.length) {
        return colors[color];
    }
    return colors[0]; // Fallback to the first color if out of range
};


export const animationDefaultOption ={
    loop:true,
    autoplay:true,
    animationData:animationData,
}