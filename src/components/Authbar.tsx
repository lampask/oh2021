import { signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { useQuery } from "react-query";
import { fetchProfilePicture } from '../../lib/queries/user-queries';

type IAuthbarProps = {
  children?: ReactNode
  hide?: boolean
  hideAdmin?: boolean
};

const Authbar: React.FC<IAuthbarProps> = (props) => {
  const [session, loading] = useSession()
  const { isLoading, isError, data } = useQuery("picture", fetchProfilePicture);
  
  let authbar = null
  if (loading) {
    authbar = (
      <li className="ml-3 mr-3">
          <a>Loading...</a>
      </li>
    )
  } else if (session) { 
    let userPart = null;
    if (!props.hide) { 
      let imgData = ""
      if (!isLoading && !isError) imgData = URL.createObjectURL(new Blob([Buffer.from(data!, 'base64')], {type: 'image/jpeg'}))
      
      userPart = (
        <>
        {!isLoading && !isError ? <li>
            <img className="w-7" src={imgData!} onLoad={() => URL.revokeObjectURL(imgData)}/> 
        </li> : null}
        <li className="ml-3 mr-3">
          <small>
            <Link href="/profile">{session.user?.name || "Guest"}</Link> ({session.user?.email})
          </small>
        </li>
        </>
      )
    }
    authbar = (
      <>
        { (session?.user.role == 'EDITOR' || session?.user.role == 'ADMIN') && !props.hideAdmin ? (
          <li className="ml-3 mr-3">
            <button>
              <Link href="/admin">ADMIN DASHBOARD</Link>
            </button>
          </li>
        ) : null}
        {userPart}
        {props.children}
      </>
    )
  }
  return (
    <div className="absolute right-0 z-10">
      <ul className={`navbar flex flex-wrap text-sm flex-row items-center`}>
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
