import React from 'react'
import { Layout, Image } from 'antd';
import { Config } from '../utils/Config'
import { Navbar } from '../components/Navbar'
import { Authbar } from '../components/Authbar'
import Link from 'next/link'

type IHeaderProps = {
  type?: string
  description?: boolean
  active?: string
}

 const { Header } = Layout;

const AppHeader: React.FC<IHeaderProps> = (props) => {

  return (
    <Header className="header">
      <Authbar />
      <Link href={`${process.env.NEXTAUTH_URL}`}>
          <div className="titleArea">
            <div className="logo"><Image src={`${process.env.baseUrl}/logo_oh_ciernabielafinal_version.svg`} /></div>
            <div className="logo2"><Image src={`${process.env.baseUrl}/hypnoza_logo.svg`} /></div>
          </div>
      </Link>
      {props.description ? <div className="text-xl">{Config.description}</div> : <></>}
      <Navbar active={props.active!}/>
    </Header>
  )
}

export default AppHeader