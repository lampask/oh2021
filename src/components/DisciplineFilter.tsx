import { Category, Discipline } from "@prisma/client"
import {ChangeEvent} from "react"
import { Input } from 'antd';
//import { useState } from "react"

type IDisciplineFilterProps = {
  disciplines: Discipline[],
  categories: Category[],
  func: Function
}

const DisciplineFilter: React.FC<IDisciplineFilterProps> = (props: IDisciplineFilterProps) => { 

  const handleInput = (input: ChangeEvent & any) => {
    props.func(props.disciplines.filter(key => { return key.name.toLowerCase().includes(input.target.value.toLowerCase()) }))
  }

  return (
    <div className="filterNav flex flex-col align-middle">
      {/* `<div className="categoryFilter flex flex-row justify-center">
        {props.categories.length > 0 ? props.categories.map(category => {
          return <button key={category.id}>{category.name}</button>
        }) : null}
      </div>` */}
      <div className="queryFilter">
        <Input onChange={handleInput}></Input>
      </div>
    </div>
  )
}

export default DisciplineFilter;