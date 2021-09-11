import React from "react";
import { useRouter } from "next/router";
import {Meta} from "../../layout/Meta";
import {Main} from "../../layout/Main";
import {useSession} from "next-auth/client";

const qr: React.FC = (props) => {
  const [session, loading] = useSession()
  const router = useRouter()
  const { id } = router.query

  let content = <></>
  if (loading) {
    content = <div>Loading...</div>
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(latitude)
        console.log(longitude)
      });
    } else {
      
    }
    content = <div>{id}</div>
  }

  return (
    <Main
      meta={(
        <Meta
          title="QR Source"
          description=""
        />
      )}
    >
      {content}
    </Main>
  )
}

export default qr;