import React from "react";
import { MDBBadge, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";

const Question = (
  message,
  setMessage,
  setMessages,
  promptTokens,
  setPromptTokens,
  setCompletionTokens,
  setTotalTokens,
  addItem,
  completionTokens,
  totalTokens,
  setMessages
) => {
  const onChangeHandler = (event) => {
    setMessage(event.target.value);
  };

  const updateMessage = (key, _value) => {
    addItem({ role: "user", content: key });
    setMessage("");
  };

  const clearMessages = () => {
    const newChat = "Olá, vamos começar uma nova conversa.";
    setMessages([]);
    setMessage("");

    setPromptTokens(0);
    setCompletionTokens(0);
    setTotalTokens(0);

    addItem({ role: "system", content: newChat });
  };

  return (
    <>
      <li key="quen" className="bg-white mb-3">
        <MDBTextArea
          label="Faça uma pergunta"
          id="textAreaExample"
          rows={4}
          onChange={onChangeHandler}
          value={message}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              updateMessage(message);
            }
          }}
        />
      </li>
      <MDBBtn color="info" rounded onClick={() => clearMessages()}>
        Limpar
      </MDBBtn>
      <MDBBtn
        color="info"
        rounded
        className="float-end"
        onClick={() => updateMessage(message)}
      >
        Enviar
      </MDBBtn>
      <br />
      <br />
      <MDBBadge className="ms-2">Prompt Tokens: {promptTokens}</MDBBadge>
      <MDBBadge className="ms-2">
        Completion Tokens: {completionTokens}
      </MDBBadge>
      <MDBBadge className="ms-2">Total Tokens: {totalTokens}</MDBBadge>
    </>
  );
};
export default Question;
