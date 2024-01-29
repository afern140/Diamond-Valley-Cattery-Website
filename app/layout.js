import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from "./navbar/page"
import Footer from "./footer/page"
import Home from "./page"
/*import About from "./pages/about/page"
import Cats from "./pages/cats/page"
import CatProfile from "./pages/cats/addcat/page"
import Contact from "./pages/contact/page"
import Litters from "./pages/litters/page"
import Registry from "./pages/registry/page"
import Vets from "./pages/vets/page"*/

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
title: 'Diamond Valley Cattery',
description: 'Diamond Valley Cattery',
}

export default function RootLayout({ children }) {
return (
	<html lang="en">
		<body className={inter.className}>
			<Navigation />
				{children}
			<Footer />
		</body>
	</html>
)
}
