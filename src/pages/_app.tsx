import React from 'react';

import { QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { AppProps } from 'next/app'
import { Provider as AuthProvider } from 'next-auth/client'
import queryClient from "../../lib/clients/react-query";

import '../styles/main.css'
import '../styles/prism-a11y-dark.css'
import 'react-calendar/dist/Calendar.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider options={{ baseUrl: `${process.env.NEXTAUTH_URL}` }} session={session}>
          <Component {...pageProps} />
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}


export default MyApp;
