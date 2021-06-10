import { signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type IAuthbarProps = {
  children?: ReactNode
  hide?: boolean
};

const Authbar: React.FC<IAuthbarProps> = (props) => {
  const [session, loading] = useSession()
  
  let binary_data = ""

  let authbar = null
  if (loading) {
    authbar = (
      <li className="ml-3 mr-3">
          <a>Loading...</a>
      </li>
    )
  } else if (session) {
    authbar = (
      <>
       {props.hide ? null : (<li className="ml-3 mr-3">
          <img src={`data:image/jpeg;base64,${binary_data}`} />
          <small>
            <Link href="/profile">{session.user?.name || "Guest"}</Link> ({session.user?.email})
          </small>
        </li>) }
        {props.children}
      </>
    )
  }
  return (
    <div className="absolute right-0 z-10">
      <ul className={`navbar flex flex-wrap text-sm flex-row`}>
        {authbar}
        {loading ? null :
        <li className="ml-3 mr-3">
          <Link href={!session ? "/api/auth/signin" : "/api/auth/signout"}>
            <a href="" onClick={!session ? () => {} : async() => await signOut()}>
              {!session ? "Login" : "Logout"}
            </a>
          </Link>
        </li>}
      </ul>
    </div>
  )
};

export { Authbar };
