import {Button, Card, FormInstance, Popconfirm, Space, Tree} from "antd";
import request from "@/utils/request";
import {API_CATEGORY, API_CATEGORY_LIST} from "@/services/api";
import GeekProTable from "@/components/GeekProTable/GeekProTable";
import {ActionType, ProColumns} from "@ant-design/pro-table";
import {PlusOutlined} from "@ant-design/icons";
import useGeekProTablePopup from "@/components/GeekProTable/useGeekProTablePopup";
import CategoryForm from "@/pages/nav/Category/CategoryForm";
import {useRef, useState} from "react";


function transformCategoryList(list: any) {
  const newList: any = []
  list.map(item=> {
    const listItem: any = { key: item._id, ...item, children: [] }
    if (Array.isArray(item.children)) {
      item.children.map(subItem=> {
        listItem.children.push({ key: subItem._id, ...subItem })
      })
    }
    newList.push(listItem)
  })
  return newList
}

export default function NavAuditListPage() {
  const formProps = useGeekProTablePopup()
  const tableRef = useRef<ActionType>(null);
  const [categoryList, setCategoryList] = useState([]);

  async function onRequestData() {
    const res = await request({
      url: API_CATEGORY_LIST,
      method: 'GET'
    })
    const data = transformCategoryList(res.data)
    setCategoryList(data)
    return {
      data,
    }
  }

  async function onDelete(id: string, action: any) {
    await request({
      url: API_CATEGORY,
      method: 'DELETE',
      data: {
        id,
      },
      msg: '删除成功',
    })
    action.reload()
  }

  const columns: ProColumns[] = [
    {
      title: '分类名',
      dataIndex: 'name'
    }
  ]
  return (
      <div>
        <GeekProTable
          actionRef={tableRef}
          columns={columns}
          pageHeaderProps={{
            extra: <Button type='primary' onClick={()=> formProps.show()}><PlusOutlined />添加分类</Button>
          }}
          search={false}
          request={onRequestData}
          renderOptions={(text, record, _, action)=> ([
            <a onClick={()=> formProps.show({type: 'edit', data: record, action})}>编辑</a>,
            <Popconfirm title={'确定删除吗？'} onConfirm={() => onDelete(record._id, action)}>
              <a>删除</a>
            </Popconfirm>,
          ])}
        />
        <CategoryForm {...formProps} tableRef={tableRef.current} categoryList={categoryList} />
      </div>
  );
}