import React, {useState} from "react";
import { useRouter } from "next/router";
import {Meta} from "../../layout/Meta";
import {Main} from "../../layout/Main";
import {signIn, useSession} from "next-auth/client";
import {Button, Layout, Spin, Typography, Image} from "antd";
import Link from 'next/link';
import {fetchQR} from "../../../lib/queries/event-queries";
import {useQuery} from "react-query";
import { Class as Cl } from ".prisma/client";
import queryClient from "../../../lib/clients/react-query";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import { dehydrate } from 'react-query/hydration'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await queryClient.prefetchQuery(["SQR", params?.id], () => fetchQR(params?.id?.toString() || ""));
  return {
    props: {
      id: (params?.id)?.toString() || "",
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const qr: React.FC<{id: string}> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session, loading] = useSession()
  const router = useRouter()
  const [error, setError] = useState('');
  const [signin, setSignin] = useState(<>Prihlásiť sa</>);
  const [lregister, setRregister] = useState(<>Zaregistrovať</>);
  const [lactivate, setActivate] = useState(<>Aktivovať pre všetkých</>);
  const { id } = router.query
  const { isLoading, data } = useQuery(["SQR", props.id],() => fetchQR(props.id));

  const activate = async() => {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(async(position) => {
        const { latitude, longitude } = position.coords;
        try {
          await fetch('/api/q', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: id,
              latitude: latitude,
              longitude: longitude
            }),
          })
          setActivate(<Spin />)
          queryClient.refetchQueries("SQR")
        } catch (error) {
          console.error(error)
        }
      }, error => {
        setError("Nepodarilo sa získať údaje o aktivačnej lokácií")
      },{timeout:10000});
    } else {
      console.log("rip")
    }
  }

  const register = async() => {
    try {
      await fetch('/api/q', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id
        }),
      })
      setRregister(<Spin />)
      queryClient.refetchQueries("SQR")
    } catch (error) {
      console.error(error)
    }
  }

  const classesFound = data?.classes.map((x: Cl) => x.name);

  let info = <Typography>Našiel/a si qr kód, ktorý je súčasťou hry v rámci OH Gamča 2021 (Hypnóza). Akcia končí 15 Decembra. Ak máte otázky viete nás kontaktovať na emailovej adrese: <Link href="mailto:ohgamca2021@gamca.sk"><a>ohgamca2021@gamca.sk</a></Link></Typography>
  let content = <></>
  if (loading || isLoading) {
    content = <Spin />
  } else {
    content = <div>
      <Image src={`${process.env.baseUrl}/logo_oh_ciernabielafinal_version.svg`} />
    {data?.id && data?.active ? 
    <>{session ? <>
      <h2>Vitaj {session.user.name} z triedy {session.user.class}</h2>
      <h3>QR kód: {id}</h3>
      {!classesFound.includes(session.user.class) ? <Button onClick={register}>{lregister}</Button> : <Typography> Tento qr kód už vaša trieda zaregistrovala</Typography>}
    </>: <>
      {info}
      <Typography>Zaregistrovať kód pre svoju triedu vieš po prihlásení</Typography>
      <Button onClick={() => {signIn("gamca", { callbackUrl: window.location.toString() }); setSignin(<Spin />)}}>{signin}</Button>
    </>}</>
    : 
    <>{session?.user.role == 'ADMIN' || session?.user.role == 'EDITOR' ? <>
      <h2>Vitaj organizátor {session.user.name}</h2>
      <h3>QR kód: {id}</h3>
      {data?.active ? <Typography>Aktívny QR kód</Typography> : <Button onClick={activate}>{lactivate}</Button>}
    </>: <>
      {info}
      <Typography style={{color: "red"}}>Tento QR kód neexistuje v databáze. Ak si myslíš, že toto je chyba, skús kontaktovať organizátorov.</Typography>
    </>}</>
    }
    
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
      <div className="QR">
        <Layout> 
          {content}
          <div style={{color: "orange"}}>{error}</div>
        </Layout>
      </div>
    </Main>
  )
}

export default qr;