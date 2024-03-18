import { AuthContextProvider } from "../_utils/auth-context";
import { UserProvider } from "../_utils/user_services";
 
const Layout = ({ children }) => {
  return <AuthContextProvider><UserProvider>{children}</UserProvider></AuthContextProvider>;
};
 
export default Layout;