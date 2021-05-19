import React, { ReactNode } from 'react';

type ISidebarProps = {
  content: ReactNode
  toggle?: boolean
  children?: ReactNode
};

const Sidebar: React.FC<ISidebarProps> = (props) => {
  return (
    <div className="flex flex-grow">
      <div className="flex-1 flex overflow-hidden h-full">
        <div className="flex-1 flex flex-col">
          {props.children}
        </div>
      </div>
      {/* Actual sidebar */}
      <div className="hidden md:block w-80">
        {props.toggle ? <div className="absolute right-80">
          <span>H</span>
        </div> : null}
        {props.content}
      </div>
    </div>
  )
}

export { Sidebar };
