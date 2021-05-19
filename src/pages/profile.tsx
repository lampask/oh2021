import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React from "react";
import { Content } from "../layout/Content";
import Footer from "../layout/Footer";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import ProfileHeader from "../layout/ProfileHeader";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  if (!session?.user) {
    return { 
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  return {
    props: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image
    }
  }
}

type Props = {
  name: string
  email: string
  image: string
}

const Profile: React.FC<Props> = (props) => {
  
  return (
    <Main
      meta={(
        <Meta
          title={props.name}
          description="Users profile page"
        />
      )}
    >
      <ProfileHeader user={{
        name: props.name,
        email: props.email,
        image: props.image
      }}/> 
      <Content>
        Disciplines
      </Content>
      <Footer />
    </Main>
  )
};

export default Profile
