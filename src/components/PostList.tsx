import React from 'react';
import Link from 'next/link';
import { useQuery } from "react-query";
import { Discipline, Post } from '@prisma/client';
import { List, Avatar, Tag, Skeleton, Pagination } from 'antd';
import { TagsOutlined } from '@ant-design/icons';

const PostList: React.FC<{ data?: any, query?: any, qkey?: string }> = (props) => {
  var loading = false;
  var pdata;
  if (props.data == undefined) {
    const { isLoading, isError, data, error } = useQuery(props.qkey!, props.query);
    loading = isLoading
    pdata = data
  } else {
    pdata = props.data
  }

  return (
    <List
        className="postList"
        loading={loading}
        itemLayout="horizontal"
        dataSource={pdata}
        pagination={{ position: 'bottom', pageSize: 10 }}
        renderItem={(item: Post & any) => {
          let actions = []
          if (item.disciplines.length > 0) {
            actions.push(<span key="disciplines">{item.disciplines.map((disc: Discipline) => (
              <Tag key={disc.id}>{disc.name}</Tag> 
            ))}</span>)
          }
          if (item.tags.length > 0) {
            actions.push(<span key="tags"><TagsOutlined />{item.tags.map((tag: any) => (
              <Tag key={tag.id}>{tag.name}</Tag> 
            ))}</span>)
          }
          return (
            <List.Item
              actions={actions}
            >
              <Skeleton avatar title={false} loading={loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar><i className={`oma oma-2x ${item.categories[0]?.icon ? item.categories[0]?.icon : "oma-black-red-question-mark"}`} /></Avatar>
                  }
                  title={<Link href="/post/[id]" as={`/post/${item.id}`}>{item.title}</Link>}
                  description={item.description}
                />
              </Skeleton>
            </List.Item>
          )
        }}
      />
  )
};

export { PostList };
