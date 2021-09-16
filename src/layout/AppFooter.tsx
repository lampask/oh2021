import React from 'react';
import { Config } from '../utils/Config';
import { Image, Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="footer">
      <div className="fcontent">
        <div >
          © Copyright
          {' '}
          {new Date().getFullYear()}
          {' '}
          {Config.title}
        </div>
        <div>
        <Image src="/sponzori/Asseco_Poland_Logo.svg" />
        <Image src="/sponzori/ba logo.png" />
        <Image src="/sponzori/LOGO_Stilus_2018.svg" />
        <Image style={{zIndex: "1000"}} src="/sponzori/slido-logo-c79e792.svg" />
        <Image style={{margin: "-25px", zoom: "2"}} src="/sponzori/SM-Logo-invert.svg" />
        </div>
      </div>
    </Footer>
  )
}  

export default AppFooter