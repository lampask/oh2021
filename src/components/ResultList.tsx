import React from 'react';
import { EventResult, Event } from '@prisma/client';
import { List, Card, Table  } from 'antd';

const ResultList: React.FC<{ data: Event[] }> = (props) => {

  const columns = [
    {
      title: 'Umiestnenie',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Trieda',
      dataIndex: 'class',
      key: 'class',
    },
  ];

  return (
    <List
        className="resultList"
        loading={false}
        itemLayout="horizontal"
        dataSource={props.data.filter((a: Event & any) => a.results.length != 0)}
        pagination={{ position: 'bottom', pageSize: 1 }}
        renderItem={(item: Event & any) => {
          return (
           <Card title={item.name}>
              <Table pagination={false} dataSource={item.results.map((r: EventResult & any, i: number) => {
                return {
                  key: i,
                  place: r.place,
                  class: r.class.name,
                }
              })} columns={columns}></Table>
           </Card>
          )
        }}
      />
  )
};

export { ResultList };
