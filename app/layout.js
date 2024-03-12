import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from "./navbar/page"
import Footer from "./footer/page"
import { AuthContextProvider } from './_utils/auth-context'
import { UserProvider } from './_utils/user_services'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
title: 'Diamond Valley Cattery',
description: 'Diamond Valley Cattery',
}

export default function RootLayout({ children }) {
return (
	<AuthContextProvider>
		<UserProvider>
			<html lang="en">
				<body className={inter.className}>
					<Navigation />
						{children}
					<Footer />
				</body>
			</html>
		</UserProvider>
	</AuthContextProvider>
)
}
