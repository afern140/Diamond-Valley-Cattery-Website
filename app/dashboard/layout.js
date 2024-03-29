import { AuthContextProvider } from "../_utils/auth-context";
import { UserProvider } from "../_utils/user_services";

export const metadata = {
	title: 'Diamond Valley Cattery - Dashboard',
	description: 'Diamond Valley Cattery',
	}
 
const Layout = ({ children }) => {
  return <AuthContextProvider><UserProvider>{children}</UserProvider></AuthContextProvider>;
};
 
export default Layout;