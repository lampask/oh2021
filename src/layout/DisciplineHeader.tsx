import React from 'react'
import { Layout, Image } from 'antd';
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'
import Link from 'next/link'
import {Discipline} from '.prisma/client';

type IHeaderProps = {
  discipline: Discipline
  type?: string
  description?: boolean
  active?: string
}

 const { Header } = Layout;

const DisciplineHeader: React.FC<IHeaderProps> = (props) => {
 
  return (
    <Header className="header">
      <Authbar />
      <Link href={`${process.env.NEXTAUTH_URL}`}>
          <div className="smalltitleArea">
            <div className="smalllogo"><Image src={`${process.env.baseUrl}/logo_oh_ciernabielafinal_version.svg`} /></div>
            <h1>{Config.title}</h1>
            {props.description ? <div className="text-xl">{Config.description}</div> : <></>}
          </div>
      </Link>
      <div className="discArea">
        <div className="smalllogo"><Image src={`${process.env.baseUrl}/xyz.a`} /></div>
        <h2>{props.discipline.name}</h2>
        <Navbar active={props.active!}/>
      </div>
      
    </Header>
  )
}

export default DisciplineHeader