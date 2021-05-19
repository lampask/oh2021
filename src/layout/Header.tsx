import React from 'react'
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'

type IHeaderProps = {
  type?: string
  description?: boolean
}

const Header: React.FC<IHeaderProps> = (props) => {
  return (
    <header className="p-4 border-b border-gray-300">
      <Authbar />
      <div className="pl-5 pt-12 pb-8">
        <div className="font-semibold text-6xl text-gray-900">{Config.title}</div>
        {props.description ? <div className="text-xl">{Config.description}</div> : <></>}
      </div>
      <Navbar />
    </header>
  )
}

export default Header