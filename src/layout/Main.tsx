import React, { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased full">
    {props.meta}
    <div className="mainContent">
      {props.children}
    </div>
  </div>
);

export { Main };
