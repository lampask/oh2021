import React from "react";
import Footer from "../layout/AppFooter";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import ResultsHeader from "../layout/ResultsHeader";
import { Layout } from "antd";

const { Content } = Layout

const Results: React.FC = (props) => {
  return (
    <Main
      meta={(
        <Meta
          title="Výsledky"
          description="Celkové výsledky olympiády"
        />
      )}
    >
      <ResultsHeader />
      <Content>
        Výsledky
        {props.children}
      </Content>
      <Footer />
    </Main>
  )
};

export default Results
