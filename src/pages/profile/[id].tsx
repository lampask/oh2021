import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/client";
import React from "react";
import { useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import { ProfileComp } from ".";
import queryClient from "../../../lib/clients/react-query";
import { fetchProfileById } from "../../../lib/queries/user-queries";


export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getSession({ req })
  if (!session?.user) {
    return { 
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  await queryClient.prefetchQuery(["profileid", Number(params?.id) || -1],() => fetchProfileById(Number(params?.id) || -1));
  return {
    props: {
      id: Number(params?.id) || -1,
      dehydratedState: dehydrate(queryClient),
    }
  }
}

const SpecificProfile: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data } = useQuery(["profileid", props.id],() => fetchProfileById(props.id));
  return <ProfileComp user={!isLoading && !isError ? data : null} />
};

export default SpecificProfile;