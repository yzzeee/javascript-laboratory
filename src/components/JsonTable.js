import React from 'react';
import JsonTable from 'ts-react-json-table';
import { firewallList, firewallListColumn } from '@dummys/firewall';

export default function () {
  return (
    <>
      <JsonTable
        className='tbData'
        rows={firewallList}
        columns={firewallListColumn}
      />
    </>
  );
}
