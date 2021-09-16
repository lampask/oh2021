import React from "react";
import Footer from "../layout/AppFooter";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import Header from "../layout/AppHeader";
import { Layout } from "antd";
import {fetchAlbums} from "../../lib/queries/user-queries";
import {useQuery} from "react-query";
import {Album} from ".prisma/client";

const { Content } = Layout

const Results: React.FC = (props) => {
  const { isLoading, isError, data, error } = useQuery("albums", fetchAlbums);
  return (
    <Main
      meta={(
        <Meta
          title="Fotky"
          description="Albumy fotografií z OH"
        />
      )}
    >
      <Layout className="mainContent">
        <Header /> 
        <Content className="content">
          <ul>
            {data?.map((x: Album) => <li key={x.id}><a href={x.link}>{x.name}</a></li>)}
          </ul>
        </Content>
        <Footer />
      </Layout>
    </Main>
  )
};

export default Results
