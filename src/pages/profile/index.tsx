import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/client";
import React from "react";
import { fetchProfile, fetchProfilePosts} from "../../../lib/queries/user-queries";
import Footer from "../../layout/AppFooter";
import { Main } from "../../layout/Main";
import { Meta } from "../../layout/Meta";
import dynamic from 'next/dynamic'
import { useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import queryClient from "../../../lib/clients/react-query";
import {PostList} from "../../components/PostList";
import {Class,Post,Role} from "@prisma/client";
import { Layout } from "antd";

const { Content } = Layout;

const ProfileHeader = dynamic(() => import("../../layout/ProfileHeader"), {
  ssr: false
});


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
  await queryClient.prefetchQuery("profile", fetchProfile);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

const Profile: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data } = useQuery("profile", fetchProfile);
  return <ProfileComp user={!isLoading && !isError ? data : null} />
};

type ProfileProps = {
  user: {
    class: Class,
    comments: Comment[],
    email: string,
    imageData: any,
    name: string,
    posts: Post[],
    role: Role,
    createdAt: Date,
    publicProfile: boolean,
    aboutMe: string,
    updatedAt: Date
  }
}

export const ProfileComp: React.FC<ProfileProps> = (props) => {
  return (
    props.user ?
    (<Main
      meta={(
        <Meta
          title={props.user.name}
          description="Profil používateľa"
        />
      )}
    >
      <ProfileHeader user={props.user}/>
      <Content>
        <div className="mt-10">
        Príspevky zverejnené používateľom:
        <PostList qkey="profPosts" query={fetchProfilePosts} />
        </div>
      </Content>
      <Footer />
    </Main>) : null
  )
};

export default Profile
