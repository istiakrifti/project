import React, { useEffect, useState } from 'react';
import { useUser } from './UserCntxt'; 
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Col, Container, Row, Table } from 'reactstrap'

function UserInfo() {
  const { userId } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (userId) {
        console.log(userId);
      axios.post('http://localhost:3000/userInfo',{userId})
        .then(response => {
          setUserDetails(response.data);
        })
        .catch(error => {
          console.log('Error fetching user details:', error);
        });
    }
  }, [userId]);

  const hasUserDetails = userDetails !== null && Object.keys(userDetails).length > 0;
  //console.log(userDetails);

  return (
    <div>
      
      
      {userDetails ? (
        <div>
          {hasUserDetails ? (
            
            userDetails.map(user=>(
              <>
             <Card className='mt-2 border-0 rounded-0 shadow-sm' >
             <CardBody style={{ backgroundColor: '#696969' }}>
                <h3 className='text-uppercase'style={{color:'yellow'}}>YOUR PROFILE</h3>

                <Container className='text-center'>
                    <img style={{ maxWidth: '200px', maxHeight: '200px' }} src={user.image ? user.image : 'https://cdn.dribbble.com/users/6142/screenshots/5679189/media/1b96ad1f07feee81fa83c877a1e350ce.png?compress=1&resize=400x300&vertical=top'} alt="user profile picture" className='img-fluid  rounded-circle' />
                </Container>
                <Table responsive striped hover bordered={true} className='text-center mt-5'>
                    <tbody>
                        <tr>
                            <td >
                                 User ID
                            </td>
                            <td>
                                {user.ID}
                            </td>
                        </tr>
                        <tr>
                            <td >
                                 NAME
                            </td>
                            <td>
                                {user.ROLE!=='admin'? (user.FIRST_NAME + ' ' + user.LAST_NAME) : (user.FIRST_NAME + ' ' + user.LAST_NAME +' (admin) ')}
                            </td>
                        </tr>
                        <tr>
                            <td >
                                 EMAIL
                            </td>
                            <td>
                                {user.EMAIL}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Phone Number
                            </td>
                            <td>
                                {user.PHONE_NUMBER}
                            </td>
                        </tr>
                        <tr>
                            <td >
                                ADDRESS
                            </td>
                            <td>
                                {user.USER_ADDRESS}
                            </td>

                        </tr>
                    </tbody>
                </Table>

                
                    <CardFooter className='text-center'>
                        <Button  color='warning' onClick={()=>navigate('/updateUserInfo')} >Update Profile</Button>
                    </CardFooter>
               

            </CardBody>
        </Card>

              </>
           ))
              
            
          ) : (
            <p>No user details available.</p>
          )}
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}

export default UserInfo;
