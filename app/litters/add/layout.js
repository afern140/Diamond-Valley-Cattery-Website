"use client"
//import { AuthContextProvider } from "../_utils/auth-context";
import ApiDataProvider from '@/app/_utils/api_provider';
 
const Layout = ({ children }) => {
  return <ApiDataProvider>{children}</ApiDataProvider>;
};
 
export default Layout;