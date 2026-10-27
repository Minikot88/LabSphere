import {createContext,useContext} from 'react';
import type {Me} from '../lib/api';
export const AuthContext=createContext<{me?:Me;refresh:()=>Promise<void>}>({refresh:async()=>{}});
export const useAuth=()=>useContext(AuthContext);
