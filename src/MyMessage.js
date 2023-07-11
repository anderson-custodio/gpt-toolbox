import React from "react";
import {
  MDBSpinner,
} from "mdb-react-ui-kit";
import userImage from "./images/user.png";

const MyMessage = ({ message, k, isLoading }) => {
  return (
    <tr>
      <td>
        <img
          src={userImage}
          alt="avatar"
          className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
          width="40"
        />
      </td>
      <td>{message}</td>
      <td>{isLoading ? (
            <MDBSpinner grow color="success" size="sm">
              <span className="visually-hidden">Loading...</span>
            </MDBSpinner>
          ) : null}
      </td>
    </tr>
  );
};

export default MyMessage;
