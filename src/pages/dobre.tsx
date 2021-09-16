import React from "react";
import {Meta} from "../layout/Meta";
import {Main} from "../layout/Main";
import Link from 'next/link';

const sifrovacka: React.FC = (props) => {
  return (
    <Main
      meta={(
        <Meta
          title="Dobre"
          description=""
        />
      )}
    >
      <Link href="/sifrovacka"><button color="#00FF00">Je to dobre, chcem sa vrátiť</button></Link>
    </Main>
  )
}

export default sifrovacka;