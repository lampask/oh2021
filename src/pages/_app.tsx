import React from 'react';

import { QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { AppProps } from 'next/app'
import { Provider as AuthProvider } from 'next-auth/client'
import queryClient from "../../lib/clients/react-query";
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/main.scss'
import 'antd/dist/antd.css';
import '../styles/openmoji-black-awesome.css'
import "easymde/dist/easymde.min.css"
import {ConfigProvider} from 'antd';
import skSK from 'antd/lib/locale/sk_SK';
import {locale} from 'moment';
import 'moment/locale/sk';
locale('sk');


const MyApp = ({ Component, pageProps }) => {
  const { session } = pageProps
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider options={{ baseUrl: `${process.env.NEXTAUTH_URL}` }} session={session}>
          <ConfigProvider locale={skSK}>
            <Component {...pageProps} />
          </ConfigProvider>
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}


export default MyApp;
