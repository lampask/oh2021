import React from 'react'
import { Layout, Image, Menu } from 'antd';
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'
import Link from 'next/link'
import {Discipline} from '.prisma/client';

type IHeaderProps = {
  setter: Function
  discipline: Discipline & any
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
        <div className="smalllogo"><i className={`oma oma-5x ${props.discipline.icon ? props.discipline.icon : (props.discipline.category?.icon ? props.discipline.category?.icon : "oma-black-red-question-mark")}`} /></div>
        <h2>{props.discipline.name}</h2>
        <div className="navbar">
          <Navbar active={props.active!}/>
        </div>
        <Menu mode="horizontal">
          <Menu.Item key="info">
            <a onClick={() => props.setter(0)}>Informácie</a>
          </Menu.Item>
          <Menu.Item key="results">
          <a onClick={() => props.setter(1)}>Výsledky</a>
          </Menu.Item>
        </Menu>
      </div>
      
    </Header>
  )
}

export default DisciplineHeader