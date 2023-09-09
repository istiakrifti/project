import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardFooter, Col, Container, Row, Table } from 'reactstrap';

export default function CheckUsers() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3000/checkUsers')
      .then(res => {
        setUsers(res.data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  };

  const handleOperation = (userId,userEmail,selectedOperation) => {
    console.log(selectedOperation);
    axios.post('http://localhost:3000/checkUsers', { userId,userEmail, selectedOperation })
      .then(res => {
        console.log(res.data);
        fetchUsers(); 
      })
      .catch(error => {
        console.error('Error', error);
      });
  };

  const hasUsers = users !== null && Object.keys(users).length > 0;
  
  return (
    <>
      {users ? (
        <div>
          <Card className='mt-2 border-0 rounded-0 shadow-sm'>
            <CardBody style={{ backgroundColor: '#696969' }}>
              <h3 className='text-uppercase'>Users Information</h3>

              <Table responsive striped hover bordered={true} className='text-center mt-5'>
                <tbody>
                  <tr>
                    <td style={{ backgroundColor: 'red' }}>USER ID</td>
                    <td style={{ backgroundColor: 'red' }}>NAME</td>
                    <td style={{ backgroundColor: 'red' }}>EMAIL</td>
                    <td style={{ backgroundColor: 'red' }}>PHONE NUMBER</td>
                    <td style={{ backgroundColor: 'red' }}>ADDRESS</td>
                    <td style={{ backgroundColor: 'red' }}>ROLE</td>
                    <td style={{ backgroundColor: 'red' }}>OPERATION</td>
                  </tr>

                  {hasUsers ? (
                    users.map(user => (
                      <tr key={user.ID}> 
                        <td>{user.ID}</td>
                        <td>{user.FIRST_NAME + ' ' + user.LAST_NAME}</td>
                        <td>{user.EMAIL}</td>
                        <td>{user.PHONE_NUMBER}</td>
                        <td>{user.USER_ADDRESS}</td>
                        <td>{user.ROLE}</td>
                        <td>
                        <select defaultValue="Choose" onChange={(e) => {handleOperation(user.ID,user.EMAIL,e.target.value);e.target.value = "Choose";}}>
                        <option disabled hidden value="Choose">Choose</option>
                        <option value="Ban">Ban</option>
                        {user.ROLE==='customer'?(
                          <option value="admin">Make Admin</option>
                        ):(
                          <option value="customer">Remove Admin</option>
                        )}
                        
                      </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No user details available.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </>
  );
}
