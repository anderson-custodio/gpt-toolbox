import React from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBCardHeader } from "mdb-react-ui-kit";
// import Gravatar from "react-gravatar";

const MyMessage = ({ message, userName, userMail, k, isLoading }) => {
  return (
    <li key={k} className="d-flex justify-content-between mb-4">
      {/* <Gravatar
        email={userMail}
        className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
        size={60}
      /> */}
      <img
        src="https://img.icons8.com/ios/256/user.png"
        alt="avatar"
        className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
        width="60"
      />
      <MDBCard>
        <MDBCardHeader className="d-flex justify-content-between p-3">
          <p className="fw-bold mb-0">{userName}</p>
          <p className="text-muted small mb-0">
            <MDBIcon far icon="clock" /> 12 mins ago
          </p>
        </MDBCardHeader>
        <MDBCardBody>
          <p className="mb-0">{message}</p>
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : null}
        </MDBCardBody>
      </MDBCard>
    </li>
  );
};

export default MyMessage;
