'use client';
// Import necessary dependencies from Next.js
import { SessionProvider as Provider } from 'next-auth/react';

// Define the SessionProvider function
function SessionProvider({ children }) {
  return (
    <Provider session={null}>
      {children}
    </Provider>
  );
}

// Export the SessionProvider function
export default SessionProvider