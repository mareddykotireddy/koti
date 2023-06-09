import React, { useState, useEffect } from 'react';
import { Table, Tag, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Input } from 'reactstrap';


const Sku = () => {
  const [skus, setSkus] = useState([]);
  const [clientId, setClientId] = useState(localStorage.getItem('selectedClient'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const baseUrl = `http://216.230.74.17:8013/api/Sku?clientId=${clientId}`;
    console.log(clientId)
    setIsLoading(true);

    axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setSkus(res?.data?.data);
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setError('Error fetching SKU data');
      });
  }, [clientId]);

  const handleClientIdChange = (value) => {
    setClientId(value);
    localStorage.setItem('selectedClient', value);
  };
<Input.search placeholder="search here..."   style={{ width: 200, float: 'right', margin: '10px' }}/>
const columns = [
  {
    title: 'sku1',
    dataIndex: 'sku1',
    key: '2',
    sorter: (a, b) => a.sku1.localeCompare(b.sku1),
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: '3',
    sorter: (a, b) => a.description.localeCompare(b.description),
  },
  {
    title: 'purchasecost',
    dataIndex: 'purchasecost',
    key: '4',
    sorter: (a, b) => a.purchasecost - b.purchasecost,
  },
  {
    title: 'itemtype',
    dataIndex: 'itemtype',
    key: '5',
    sorter: (a, b) => a.itemtype.localeCompare(b.itemtype),
    render: (_, { itemtype }) => {
      let color = 'green'; // Set color to green
      let tags = itemtype ? itemtype.toUpperCase() : ''; // Convert itemtype to uppercase or set an empty string if it's null
      return (
        <Tag color={color} key={tags}>
          {tags}
        </Tag>
      );
    },
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: '6',
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (_, { status }) => {
      let color = 'green'; 
      let tags = status ? status.toUpperCase() : '';
      return (
        <Tag color={color} key={tags}>
          {tags}
        </Tag>
      );
    },
  },
  {
    title: 'entrydate',
    dataIndex: 'entrydate',
    key: '7',
    render: (text) => moment(text).format('MM/DD/YYYY'),
    sorter: (a, b) => moment(a.entrydate).diff(moment(b.entrydate)),
  },
];


  return (
    <div>
      <input type="text" value={clientId} onChange={(e) => handleClientIdChange(e.target.value)} />
      <Table
  dataSource={skus}
  columns={columns}
  loading={isLoading ? <Spin size="large" /> : false}
  sorter={true}
/>

    </div>
  );
}

export default Sku