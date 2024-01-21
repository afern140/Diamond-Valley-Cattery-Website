// Import necessary modules
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from "@/app/firebase";

// Define authentication options
const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: '/signin',
    signUp: '/signup'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email || '',
            credentials.password || ''
          );

          if (userCredential.user) {
            return userCredential.user;
          }

          return null;
        } catch (error) {
          console.log(error);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          return null;
        }
      }
    })
  ],
};

// Export NextAuth instance with the defined options
module.exports = NextAuth(authOptions);
