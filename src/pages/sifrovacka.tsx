import React from "react";
import {Meta} from "../layout/Meta";
import {Main} from "../layout/Main";
import Link from 'next/link';

const sifrovacka: React.FC = (props) => {
  return (
    <Main
      meta={(
        <Meta
          title="Sifrovacka"
          description="OH Sifra time"
        />
      )}
    >
      <Link href="https://susi.trojsten.sk/ulohy/"><button>Chcem sifrit</button></Link>
    </Main>
  )
}

export default sifrovacka;