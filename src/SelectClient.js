import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spin } from 'antd';

function Dropdown() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [skus, setSkus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = token;
    const baseUrl = `http://216.230.74.17:8013/api/Client`;
    axios
      .get(baseUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setClients(res?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!selectedClient) {
      setSkus([]);
      return;
    }
    setIsLoading(true);
    const accessToken = token;
    const skuClientData = `http://216.230.74.17:8013/api/Sku?clientId=${selectedClient}`;
    axios
      .get(skuClientData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setSkus(res.data);
        console.log(res.data?.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        navigate('/admin');
      });
    localStorage.setItem('selectedClient', selectedClient);
  }, [selectedClient]);

  return (
    <div style={{ marginTop: '-15px', width: '200px' }}>
      <select
        value={selectedClient}
        onChange={(event) => setSelectedClient(event.target.value)}
        style={{ width: '100%' }}
      >
        <option value="">Select a client</option>
        {clients?.map((c) => (
          <option value={c?.uniqueid} key={c?.uniqueid}>
            {c?.clientname}
          </option>
        ))}
      </select>

      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Spin size="large" />
        </div>
      )}
      {skus.length > 0 && !isLoading && (
        <>
          <hr />
          <h3>SKUs for selected client:</h3>
          <ul>
            {skus.map((sku) => (
              <li key={sku.id}>{sku.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Dropdown;
