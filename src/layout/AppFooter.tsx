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
      </div>
    </Footer>
  )
}  

export default AppFooter