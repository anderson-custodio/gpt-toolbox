import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBBadge,
  MDBSwitch,
} from "mdb-react-ui-kit";
import MyMessage from "./MyMessage";
import GptMessage from "./OtherMessage";
import { Configuration, OpenAIApi } from "openai";

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [promptTokens, setPromptTokens] = useState(0);
  const [completionTokens, setCompletionTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(-1);

  const [code, setCode] = useState(false);

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

    setPromptTokens(0);
    setCompletionTokens(0);
    setTotalTokens(0);

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
      setLoadingMessageIndex(messages.length - 1);
      setLoading(true);

      try {
        if (code) {
          let response = await openai.createCompletion(getOptions("code"));
          let botResponse = "```";
          response.data.choices.forEach((message) => {
            botResponse += message.text;
          });
          botResponse += "```";
          console.log(botResponse);
          addItem({
            role: "assistant",
            content: botResponse.replace(/^[\s\t]*\+/gm, ""),
          });
          setPromptTokens(promptTokens + response.data.usage.prompt_tokens);
          setCompletionTokens(
            completionTokens + response.data.usage.completion_tokens
          );
          setTotalTokens(totalTokens + response.data.usage.total_tokens);
        } else {
          await openai
            .createChatCompletion(getOptions("chat"))
            .then((response) => {
              let botResponse = "";
              response.data.choices.forEach(({ message }) => {
                botResponse += message.content;
              });
              addItem({ role: "assistant", content: botResponse });
              setPromptTokens(promptTokens + response.data.usage.prompt_tokens);
              setCompletionTokens(
                completionTokens + response.data.usage.completion_tokens
              );
              setTotalTokens(totalTokens + response.data.usage.total_tokens);
            });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setLoadingMessageIndex(-1);
      }
    };

    getDavinciResponse();
  }, [messages]);

  // useEffect(() => {
  //   console.log(JSON.stringify(messages));
  // }, [messages]);

  const getOptions = (type) => {
    if (type === "code") {
      return {
        model: "code-davinci-002",
        prompt: messages[messages.length - 1].content,
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      };
    } else {
      return {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
      };
    }
  };

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
            isLoading={index === loadingMessageIndex && loading}
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
        <MDBSwitch
          id="genCode"
          label="Gerar código"
          checked={code}
          onChange={() => setCode(!code)}
        />
        <br />
        <br />
        <MDBBadge className="ms-2">Prompt Tokens: {promptTokens}</MDBBadge>
        <MDBBadge className="ms-2">
          Completion Tokens: {completionTokens}
        </MDBBadge>
        <MDBBadge className="ms-2">Total Tokens: {totalTokens}</MDBBadge>
      </MDBTypography>
    </MDBCol>
  );
};

export default ChatMessages;
