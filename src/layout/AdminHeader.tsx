import React from 'react'
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'

type IAdminHeaderProps = {
  type?: string
  description?: boolean
}

const AdminHeader: React.FC<IAdminHeaderProps> = (props) => {
  return (
    <header className="p-4 border-b border-gray-300">
      <Authbar />
      <div className="pl-5 pt-8 pb-3">
        <div className="font-semibold text-xl text-gray-900">{Config.title} Admin Dashboard</div>
        {props.description ? <div className="text-md">{Config.description}</div> : <></>}
      </div>
      <Navbar />
    </header>
  )
}

export default AdminHeader