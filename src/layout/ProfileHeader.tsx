import React from 'react'
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'
import Tag from '../components/Tag'

type IProfileHeaderProps = {
  type?: string
  description?: boolean
  user: {
    name: string
    email: string
    image: string
  }
}

const ProfileHeader: React.FC<IProfileHeaderProps> = (props) => {
  return (
    <header className="p-4 border-b border-gray-300">
      <Authbar hide={true} />
      <div className="pl-5 pt-4 mb-12 pb-8">
        <div className="font-semibold text-3xl text-gray-900">{Config.title}</div>
        {props.description ? <div className="text-xl">{Config.description}</div> : <></>}
      </div>
      <div className="absolute top-28 left-20 flex flex-row align-middle">
        <img className="w-32 h-32 mr-4" src={props.user.image}></img>
        <div className="flex flex-col mr-4">
          <h1>{props.user.name}</h1>
          <small>{props.user.email}</small>
          <br/>
        </div>
        <div>
          <Tag name="User" color="#330000" />
        </div>
      </div>
      <div className="ml-96">
        <Navbar/>
      </div>
    </header>
  )
}

export default ProfileHeader