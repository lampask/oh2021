import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { Menu, Spin, Avatar } from 'antd';
import PPicture from './PPicture';

type IAuthbarProps = {
  children?: ReactNode
  hide?: boolean
  hideAdmin?: boolean
};

const Authbar: React.FC<IAuthbarProps> = (props) => {
  const [session, loading] = useSession()
  let authbar = null

  if (loading) {
    authbar = (
      <Spin/>
    )
  } else if (session) { 
    authbar = (<>
      { (session?.user.role == 'EDITOR' || session?.user.role == 'ADMIN') && !props.hideAdmin ? (
        <Menu.Item key={"admin"}>
          <Link href="/admin">ADMIN DASHBOARD</Link>
        </Menu.Item>
      ) : null}
      {!props.hide ? <>
        <Menu.Item key={"profile"}>
        <Avatar
          shape="square"
          size={25}
          src={<PPicture />}
        />
        <span> </span>
        <Link href="/profile"><span>{session.user?.name || "Guest"} ({session.user?.email})</span></Link> 
        </Menu.Item>
      </> : null}
    </>)
  }
  return (
    <div className="menuContainer">
      <Menu mode="horizontal">
        {authbar}
        {loading ? null :
        <Menu.Item key={"session"}>
          <Link href={!session ? '/api/auth/signin' : '/api/auth/signout'}>
            <a href="" onClick={!session ? null : () => signOut()}>
              {!session ? "Login with gamca account" : "Logout"}
            </a>
          </Link>
        </Menu.Item>}
      </Menu>
    </div>
  )
};

export { Authbar };
