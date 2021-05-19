import React from "react";
import { Content } from "../layout/Content";
import Footer from "../layout/Footer";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import ResultsHeader from "../layout/ResultsHeader";


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
      <ResultsHeader /> 
      <Content>
        Results
        {props.children}
      </Content>
      <Footer />
    </Main>
  )
};

export default Results
