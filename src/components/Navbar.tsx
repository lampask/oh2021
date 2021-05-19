import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

type INavbarProps = {
  children?: ReactNode;
};

const Navbar: React.FC<INavbarProps> = (props) => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname
  return (
    <ul className="navbar flex flex-wrap text-xl flex-row">
       <li className="mr-6">
            <Link href="/">
              <a className="text-bold" data-active={isActive('/')}>Home</a>
            </Link>
          </li>
          <li className="mr-6">
            <Link href="/disciplines">
              <a className="text-bold" data-active={isActive('/')}>Disciplines</a>
            </Link>
          </li>
          <li className="mr-6">
            <Link href="/results">
              <a className="text-bold" data-active={isActive('/')}>Results</a>
            </Link>
          </li>
          {props.children}
    </ul>
  )
};

export { Navbar };
