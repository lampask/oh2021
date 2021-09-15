import React, {useState} from "react";
import { Discipline } from "@prisma/client";
import DisciplineFilter from "./DisciplineFilter";
import { List, Avatar, Skeleton,  } from 'antd';
import Link from "next/link";
import { useQuery } from "react-query";
import {fetchDisciplines} from "../../lib/queries/discipline-queries";
import DisciplineWidget from "./widgets/DisciplineWidget";
import Item from "antd/lib/list/Item";

const DisciplineList: React.FC = () => { 
  const { isLoading, isError, data, error } = useQuery("disciplines", fetchDisciplines)
  const [discData, setData] = useState(data?.disciplines)

  const setDataFunc = (d: Discipline[]) => {
    setData(d)
  } 

  return (
    <div>
      <DisciplineFilter func={setDataFunc} disciplines={data?.disciplines} categories={data?.categories}/>
      <List
          className="postList"
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={discData}
          renderItem={(item: Discipline & any) => {
            let actions = [
              <p className="m-0">Články {item.posts.length}</p>,
              <p className="m-0">Udalosti {item.events.length}</p>,
              <span><DisciplineWidget discipline={item} /></span>
            ]
            return (
              <List.Item
                actions={actions}
              >
                <Skeleton avatar title={false} loading={isLoading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar><i className={`oma oma-2x ${item.icon ? item.icon : (item.category?.icon ? item.category?.icon : "oma-black-red-question-mark")}`} /></Avatar>
                    }
                    title={<Link href="/discipline/[id]" as={`/discipline/${item.id}`}>{item.name}</Link>}
                    description={<small>{item.category?.name}</small>}
                  />
                </Skeleton>
              </List.Item>
            )
          }}
        />
      </div>)
}

export default DisciplineList;