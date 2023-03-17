import "./App.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import ChatMessages from "./ChatMessages";

export default function App() {
  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <ChatMessages key="messages" />
    </MDBContainer>
  );
}
