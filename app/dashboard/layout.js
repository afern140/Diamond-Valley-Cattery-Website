import { AuthContextProvider } from "../_utils/auth-context";

export const metadata = {
	title: 'Diamond Valley Cattery - Dashboard',
	description: 'Diamond Valley Cattery',
	}
 
const Layout = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};
 
export default Layout;