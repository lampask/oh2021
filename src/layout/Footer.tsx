import React from 'react';
import { Config } from '../utils/Config';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="border-t border-gray-300 text-center py-8 text-sm">
        © Copyright
        {' '}
        {new Date().getFullYear()}
        {' '}
        {Config.title}
      </div>
    </footer>
  )
}  

export default Footer