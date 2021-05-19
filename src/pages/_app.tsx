import React from 'react';

import { AppProps } from 'next/app'
import { Provider as AuthProvider } from 'next-auth/client'

import '../styles/main.css'
import '../styles/prism-a11y-dark.css'
import 'react-calendar/dist/Calendar.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps
  
  return (
    <AuthProvider options={{ baseUrl: process.env.NEXTAUTH_URL }} session={session}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp;
