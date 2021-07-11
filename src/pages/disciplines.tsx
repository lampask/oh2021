import { GetStaticProps, InferGetStaticPropsType } from "next";
import {useSession} from "next-auth/client";
import React from "react";
import prisma from "../../lib/clients/prisma";
import DisciplineList, { IDisciplinesProps } from "../components/DisciplineList";
import { IPaginationProps } from "../components/Pagination";
import { Content } from "../layout/Content";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import { Sidebar } from "../layout/Sidebar";
import { Config } from "../utils/Config";

const Disciplines: React.FC<IDisciplinesProps> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [session, loading] = useSession()

  let mainContent = (
    <Content>
      <DisciplineList disciplines={props} />
    </Content>
  )

  return (
    <Main
      meta={(
        <Meta
          title="Disciplines"
          description="List of all the disciplines"
        />
      )}
    >
      <Header /> 
      {session ? <Sidebar
          content={
            <div className="flex flex-col">
              <h1>{session.user.class}</h1>
            </div>
          }
        >{mainContent}</Sidebar> 
      : mainContent}
      <Footer />
    </Main>
  )
};

export const getStaticProps: GetStaticProps<IDisciplinesProps> = async () => {
  const pagination: IPaginationProps = {};
  const disciplines = await prisma.discipline.findMany({
    include: {
      category: true,
      events: true,
      posts: true,
      tags: true
    },
  })

  const categories = await prisma.category.findMany()

  if (disciplines.length > Config.pagination_size) {
    pagination.next = '/page2';
  }

  return {
    props: {
      disciplines: disciplines,
      categories: categories,
      pagination: pagination
    },
  };
};

export default Disciplines
