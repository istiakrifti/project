import React from 'react';

export default function Footer()
{
    return(
        <div className="align-bottom" style={{color:'white',background:'black'}}>
        <hr />
        <div className="d-flex justify-content-center card-color">
          <div className="align-middle mt-4">
            <div className="text-center">
             <h3> Created by <span className="badge bg-warning text-black">Rakesh</span> and <span className="badge bg-danger text-black">Rifti</span> </h3>
            </div>
            <div className="text-center align-middle">
              <b>Contact us - 
              01903041177,
              01776039843</b>
             <p> <h3>Thank you! </h3></p>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
    )
}