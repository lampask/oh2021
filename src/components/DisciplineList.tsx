import React from "react";
import { Category, Discipline, Post, Tag } from "@prisma/client";
import { IPaginationProps, Pagination } from "./Pagination";
import DisciplineWidget from "./widgets/DisciplineWidget";
import DisciplineFilter from "./DisciplineFilter";


export type IDisciplinesProps = {
  disciplines: (Discipline & {
      category: Category | null
      events: Event[]
      posts: Post[]
      tags: Tag[]
    })[];
  categories: Category[]
  pagination: IPaginationProps
}

const DisciplineList: React.FC<{ disciplines: IDisciplinesProps  }> = ({ disciplines }) => { 
  return (
    <div className="flex flex-col">
      <DisciplineFilter categories={disciplines.categories}/>
      <div className="w-4/5 xl:w-2/3 m-auto">
        <hr className="mb-3"/>
        {disciplines.disciplines.map((discipline) => {
          return <DisciplineWidget key={discipline.id} discipline={{
            id: discipline.id,
            name: discipline.name,
            category: discipline.category,
            events: discipline.events,
            posts: discipline.posts,
            tags: discipline.tags,
            deadline: undefined
          }}/>
        })}
      </div>
      <Pagination previous={disciplines.pagination.previous} next={disciplines.pagination.next} />
    </div>
  )
}

export default DisciplineList;