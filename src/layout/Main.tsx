import React, { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full text-gray-700">
    {props.meta}
    <div className="mx-auto flex flex-col h-screen">
      {props.children}
    </div>
  </div>
);

export { Main };
