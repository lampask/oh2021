import { GetStaticProps, InferGetStaticPropsType } from "next";
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
      <Sidebar
        content={
          <div className="flex flex-col">
            
          </div>
        }
      >
        <Content>
          <DisciplineList disciplines={props} />
        </Content>
      </Sidebar>
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
