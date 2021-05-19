import { Category } from "@prisma/client"
//import { useState } from "react"

type IDisciplineFilterProps = {
  categories: Category[]
}

const DisciplineFilter: React.FC<IDisciplineFilterProps> = (props: IDisciplineFilterProps) => { 
  //const [query, setQuery] = useState("");
  
  return (
    <div className="filterNav flex flex-col align-middle">
      <div className="categoryFilter flex flex-row justify-center">
        {props.categories.length > 0 ? props.categories.map(category => {
          return <button key={category.id}>{category.name}</button>
        }) : null}
      </div>
      <div className="queryFilter">
        <input></input>
      </div>
    </div>
  )
}

export default DisciplineFilter;