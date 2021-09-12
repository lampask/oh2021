import React from "react";
import Footer from "../layout/AppFooter";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import Header from "../layout/AppHeader";
import { Layout } from "antd";

const { Content } = Layout

const Results: React.FC = (props) => {
  return (
    <Main
      meta={(
        <Meta
          title="Results"
          description="Overall results of the competition"
        />
      )}
    >
      <Header /> 
      <Content>
        Results
        {props.children}
      </Content>
      <Footer />
    </Main>
  )
};

export default Results
