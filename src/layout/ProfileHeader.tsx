import React from 'react'
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'
import Tag from '../components/Tag'
import { Class, Post, Role } from '@prisma/client'

type IProfileHeaderProps = {
  type?: string
  description?: boolean
  user: {
    class: Class,
    comments: Comment[],
    email: string,
    imageData: any,
    name: string,
    posts: Post[],
    role: Role,
    createdAt: Date,
    publicProfile: boolean,
    aboutMe: string,
    updatedAt: Date
  }
}

const ProfileHeader: React.FC<IProfileHeaderProps> = (props) => {

  let imgData = ""
  if (props.user != null && props.user.imageData != null) {
    imgData = URL.createObjectURL(new Blob([Buffer.from(props.user.imageData!, 'base64')], {type: 'image/jpeg'}))
  }

  return (
    <header className="p-4 border-b border-gray-300">
      <Authbar hide={true} />
      <div className="pl-5 pt-4 mb-12 pb-8">
        <div className="font-semibold text-3xl text-gray-900">{Config.title}</div>
        {props.description ? <div className="text-xl">{Config.description}</div> : <></>}
      </div>
      <div className="absolute top-28 left-20 flex flex-row align-middle">
        <img className="w-32 h-32 mr-4" src={imgData!} onLoad={() => { URL.revokeObjectURL(imgData!) }}></img>
        <div className="flex flex-col mr-4">
          <h1 className="font-bold">{props.user ? props.user.name : ""}</h1>
          <small>{props.user ? props.user.email: ""}</small>
          <br/>
          <h4>O mne</h4>
          <small><i>{props.user ? props.user.aboutMe : "..."}</i></small>
        </div>
        <div>
          <Tag name={props.user ? props.user.role : ""} color="#330000" />
        </div>
      </div>
      <div className="ml-96 absolute">
        <Navbar/>
      </div>
      <div className="h-7"/>
    </header>
  )
}

export default ProfileHeader