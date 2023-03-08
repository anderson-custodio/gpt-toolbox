import React, { useEffect, useState } from "react";
import { MDBCol, MDBBtn, MDBTypography, MDBTextArea } from "mdb-react-ui-kit";
import MyMessage from "./MyMessage";
import GptMessage from "./OtherMessage";
import { Configuration, OpenAIApi } from "openai";

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    organization: process.env.REACT_APP_ORGANIZATION_ID,
    apiKey: process.env.REACT_APP_OPENAI_KEY,
  });

  const updateMessage = (key, _value) => {
    addItem({ role: "user", content: key });
    setMessage("");
  };

  const clearMessages = () => {
    const newChat = "Olá, vamos começar uma nova conversa.";
    setMessages([]);
    setMessage("");
    addItem({ role: "system", content: newChat });
  };

  const addItem = (item) => {
    setMessages((prevMessages) => [...prevMessages, item]);
  };

  const onChangeHandler = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (
      messages.length === 0 ||
      messages[messages.length - 1].role === "assistant"
    )
      return;

    const openai = new OpenAIApi(configuration);

    const getDavinciResponse = async () => {
      setLoading(true);

      const options = {
        model: "gpt-3.5-turbo",
        messages: messages,
      };

      try {
        await openai.createChatCompletion(options).then((response) => {
          let botResponse = "";
          response.data.choices.forEach(({ message }) => {
            botResponse += message.content;
          });
          addItem({ role: "assistant", content: botResponse });
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    getDavinciResponse();
  }, [messages]);

  useEffect(() => {
    console.log(JSON.stringify(messages));
  }, [messages]);

  const renderMessages = () => {
    return messages.map((m, index) => {
      if (m.role === "assistant") {
        return <GptMessage key={`assistant-${index}`} message={m.content} />;
      } else {
        return (
          <MyMessage
            key={`user-${index}`}
            k={`user-${index}`}
            message={m.content}
            userName="Usuário"
            userMail="user@gmail.com"
            isLoading={loading}
          />
        );
      }
    });
  };

  return (
    <MDBCol md="6" lg="7" xl="12">
      <MDBTypography listUnStyled>
        {renderMessages()}
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
        <MDBBtn
          color="info"
          rounded
          className="float-end"
          onClick={() => updateMessage(message)}
        >
          Enviar
        </MDBBtn>
        <MDBBtn color="info" rounded onClick={() => clearMessages()}>
          Limpar
        </MDBBtn>
      </MDBTypography>
    </MDBCol>
  );
};

export default ChatMessages;
