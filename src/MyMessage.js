import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBSpinner,
} from "mdb-react-ui-kit";
// import Gravatar from "react-gravatar";
import userImage from "./images/user.png";

const MyMessage = ({ message, userName, userMail, k, isLoading }) => {
  return (
    <li key={k} className="d-flex justify-content-between mb-4">
      {/* <Gravatar
        email={userMail}
        className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
        size={60}
      /> */}
      <img
        src={userImage}
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
            <MDBSpinner grow color="success" size="sm">
              <span className="visually-hidden">Loading...</span>
            </MDBSpinner>
          ) : null}
        </MDBCardBody>
      </MDBCard>
    </li>
  );
};

export default MyMessage;
