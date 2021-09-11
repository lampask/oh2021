import React from 'react';
import { Config } from '../utils/Config';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="footer">
      <div >
        © Copyright
        {' '}
        {new Date().getFullYear()}
        {' '}
        {Config.title}
      </div>
    </Footer>
  )
}  

export default AppFooter