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
          <a className="text-bold" data-active={isActive('/')}>Novinky</a>
        </Link>
      </Menu.Item>
      <Menu.Item key={"disciplines"}>
        <Link href="/disciplines">
          <a className="text-bold" data-active={isActive('/')}>Disciplíny</a>
        </Link>
      </Menu.Item>
      <Menu.Item key={"results"}>
        <Link href="/albums">
          <a className="text-bold" data-active={isActive('/')}>Fotky</a>
        </Link>
      </Menu.Item>
      {props.children}
    </Menu>
  )
};

export { Navbar };
