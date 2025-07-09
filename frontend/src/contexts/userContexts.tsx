import { createContext } from "react";
import type {User} from "../types.ts";
import * as React from "react";
export const GlobalContext = createContext<{
    isLoggedIn: boolean;
    setIsLoggedIn:React.Dispatch<React.SetStateAction<boolean>>;
    isSideBarOpen: boolean;
    setIsSideBarOpen:React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User|null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User|null>>;
} | null>(null);