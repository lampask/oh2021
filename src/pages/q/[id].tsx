import React from "react";
import { useRouter } from "next/router";
import {Meta} from "../../layout/Meta";
import {Main} from "../../layout/Main";
import {useSession} from "next-auth/client";
import {Button} from "antd";

const qr: React.FC = (props) => {
  const [session, loading] = useSession()
  const router = useRouter()
  const { id } = router.query

  const activate = async() => {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(latitude)
        console.log(longitude)
      }, error => {
        console.log(error)
      },{timeout:10000});
    } else {
      console.log("rip")
    }
  }

  let content = <></>
  if (loading) {
    content = <div>Loading...</div>
  } else {
    content = <div>QR kód: {id}
    {session ? <Button onClick={activate}>Aktivovať</Button> : null}
    </div>
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