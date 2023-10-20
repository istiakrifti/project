import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, Col, Container, Row, Table } from 'reactstrap';

export default function CheckUsers(props) {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .post('http://localhost:3000/pendingPurchase')
      .then((res) => {
        console.log(res.data);
        const uniquePurchaseIds = [...new Set(res.data.map((user) => user.PURCHASE_ID))];
        const uniquePurchaseInfo = uniquePurchaseIds.map((purchaseId) => {
          const purchaseInfo = res.data.filter((user) => user.PURCHASE_ID === purchaseId);
          return {
            PURCHASE_ID: purchaseId,
            DETAILS: purchaseInfo.map((info) => ({
              NAME: info.NAME,
              PURCHASE_DATE: info.PURCHASE_DATE,
              PAYMENT_INFO: info.PAYMENT_INFO,
              CUSTOMER_NAME: info.FIRST_NAME,
              PRODUCT_QUANTITY: info.PRODUCT_COUNT,
              ID: info.ID,
            })),
          };
        });
        setPending(uniquePurchaseInfo);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  };

  const handleApprove = (purchaseId,userId) => {
    setPending((prevPending) => prevPending.filter((purchase) => purchase.PURCHASE_ID !== purchaseId));
    localStorage.setItem('newMsg','true');
    let str='';
    const currentPurchase = pending.find((purchase) => purchase.PURCHASE_ID === purchaseId);
    if (currentPurchase) {
      str = currentPurchase.DETAILS.map((info) => info.NAME).join(', ');
    }
    const msg = `Your order for ${str} request has been approved...`;
    axios.post('http://localhost:3000/pendingPurchase1',{purchaseId,userId,msg})
    .then((res)=>{
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
    })
    alert('Approved successfully');
  };

  return (
    <>
      <div>
        <Card className="mt-2 border-0 rounded-0 shadow-sm">
          <CardBody style={{ backgroundColor: '#696969' }}>
            <h3 className="text-uppercase">Pending For Approval</h3>

<Table responsive striped hover bordered={true} className="text-center mt-5">
              <thead>
                <tr>
                  <th style={{ backgroundColor: 'red' }}>PURCHASE ID</th>
                  <th style={{ backgroundColor: 'red' }}>PRODUCT NAME</th>
                  <th style={{ backgroundColor: 'red' }}>PURCHASE DATE</th>
                  <th style={{ backgroundColor: 'red' }}>PAYMENT INFO</th>
                  <th style={{ backgroundColor: 'red' }}>CUSTOMER NAME</th>
                  <th style={{ backgroundColor: 'red' }}>PRODUCT QUANTITY</th>
                  <th style={{ backgroundColor: 'red' }}>APPROVE</th>
                </tr>
              </thead>
              <tbody>
                {pending.length > 0 ? (
                  pending.map((purchase, index) => (
                    <React.Fragment key={purchase.PURCHASE_ID}>
                      <tr>
                        <td rowSpan={purchase.DETAILS.length}>{purchase.PURCHASE_ID}</td>
                        <td>{purchase.DETAILS[0].NAME}</td>
                        <td>{purchase.DETAILS[0].PURCHASE_DATE}</td>
                        <td>{purchase.DETAILS[0].PAYMENT_INFO}</td>
                        <td>{purchase.DETAILS[0].CUSTOMER_NAME}</td>
                        <td>{purchase.DETAILS[0].PRODUCT_QUANTITY}</td>
                        <td rowSpan={purchase.DETAILS.length}>
                            <Button
                              color="success"
                              onClick={() => handleApprove(purchase.PURCHASE_ID,purchase.DETAILS[0].ID)}
                            >
                              Approve
                            </Button>
                          </td>
                      </tr>
                      {purchase.DETAILS.slice(1).map((info, infoIndex) => (
                        <tr key={infoIndex}>
                          <td>{info.NAME}</td>
                          <td>{info.PURCHASE_DATE}</td>
                          <td>{info.PAYMENT_INFO}</td>
                          <td>{info.CUSTOMER_NAME}</td>
                          <td>{info.PRODUCT_QUANTITY}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No purchase details available.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}