import React from "react";
import {Meta} from "../layout/Meta";
import {Main} from "../layout/Main";
import Link from 'next/link';

const sifrovacka: React.FC = (props) => {
  return (
    <Main
      meta={(
        <Meta
          title="Zle"
          description=""
        />
      )}
    >
      <Link href="/sifrovacka"><button color="#FF0000">Je to zle, chcem sa vrátiť</button></Link>
    </Main>
  )
}

export default sifrovacka;