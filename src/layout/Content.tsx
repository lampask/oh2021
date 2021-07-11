import React, { ReactNode } from 'react';

type IContentProps = {
  children: ReactNode
  styled?: boolean 
};

const Content = (props: IContentProps) => (
  <div className="mark flex-grow px-5 py-5">
    {props.children}
  </div>
);

export { Content };
