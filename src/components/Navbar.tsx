import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { Menu } from 'antd';

type INavbarProps = {
  children?: ReactNode;
  active?: string
};

const Navbar: React.FC<INavbarProps> = (props) => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname
  return (
    <Menu mode="horizontal" defaultSelectedKeys={[props.active!]}>  
      <Menu.Item key={"home"}>
        <Link href="/">
          <a className="text-bold" data-active={isActive('/')}>Home</a>
        </Link>
      </Menu.Item>
      <Menu.Item key={"disciplines"}>
        <Link href="/disciplines">
          <a className="text-bold" data-active={isActive('/')}>Disciplines</a>
        </Link>
      </Menu.Item>
      <Menu.Item key={"results"}>
        <Link href="/results">
          <a className="text-bold" data-active={isActive('/')}>Results</a>
        </Link>
      </Menu.Item>
      {props.children}
    </Menu>
  )
};

export { Navbar };
