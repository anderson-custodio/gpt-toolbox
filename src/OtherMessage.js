import React from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBCardHeader } from "mdb-react-ui-kit";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

function getCodeAndText(message) {
  const [codeStart, codeEnd] = message.split("```");
  const code = codeEnd ? codeEnd.trim() : null;
  const text = codeStart.trim();
  return { code, text };
}

const GptMessage = ({ message, ...props }) => {
  const { code, text } = getCodeAndText(message);

  return (
    <li key={props.k} className="d-flex justify-content-between mb-4">
      <MDBCard className="w-100">
        <MDBCardHeader className="d-flex justify-content-between p-3">
          <p className="fw-bold mb-0">Chat GPT</p>
          <p className="text-muted small mb-0">
            <MDBIcon far icon="clock" /> 13 mins ago
          </p>
        </MDBCardHeader>
        <MDBCardBody>
          {text && <p className="mb-0">{text}</p>}
          {code ? (
            <SyntaxHighlighter language="jsx" style={vs} className="mb-0">
              {code}
            </SyntaxHighlighter>
          ) : null}
        </MDBCardBody>
      </MDBCard>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/800px-ChatGPT_logo.svg.png"
        alt="gpt icon"
        className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
        width="60"
      />
    </li>
  );
};

export default GptMessage;
