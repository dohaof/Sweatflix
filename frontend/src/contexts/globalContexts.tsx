import { createContext } from "react";
import type {User} from "../types.ts";
import * as React from "react";
export const HomeContext = createContext<{
    isSideBarOpen: boolean;
    setIsSideBarOpen:React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);
export const UserContext = createContext<{
    currentUser: User|null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User|null>>;
    isLoggedIn: boolean;
    setIsLoggedIn:React.Dispatch<React.SetStateAction<boolean>>;
    favourList:number[]
    setFavourList:React.Dispatch<React.SetStateAction<number[]>>;
    websocket: WebSocket | null;
    setWebSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
}| null>(null);
export const NotificationContext = createContext<{
    isNewNotice:boolean,
    setIsNewNotice:React.Dispatch<React.SetStateAction<boolean>>;
}|null>(null);