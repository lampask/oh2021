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
            <div className="logo2"><Image preview={false} src={`${process.env.baseUrl}/hypnoza_logo.svg`} /></div>
          </div>
      </Link>
      {props.description ? <div className="text-xl">{Config.description}</div> : <></>}
      <div className="sponsors">
        <Link href={"https://asseco.com"}><Image preview={false} src="/sponzori/Asseco_Poland_Logo.svg" /></Link>
        <Link href={"https://bratislava.sk"}><Image preview={false} src="/sponzori/ba logo.png" /></Link>
        <Link href={"https://www.stilus.sk/sk/"}><Image preview={false} src="/sponzori/LOGO_Stilus_2018.svg" /></Link>
        <Link href={"https://www.sli.do"}><Image preview={false} style={{zIndex: "1000"}} src="/sponzori/slido-logo-c79e792.svg" /></Link>
        <Link href={"https://www.staremesto.sk"}><Image preview={false} style={{margin: "5px -25px", zoom: "2"}} src="/sponzori/SM-Logo-invert.svg" /></Link>
        </div>
      <Navbar active={props.active!}/>
    </Header>
  )
}

export default AppHeader