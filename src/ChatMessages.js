import React, { useEffect, useRef, useState } from "react";
import {
  MDBCol,
  MDBRow,
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
  const newChat = "Olá, vamos começar uma nova conversa.";
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [promptTokens, setPromptTokens] = useState(0);
  const [completionTokens, setCompletionTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(-1);

  const [gpt4, setGpt4] = useState(false);
  const [questions, setQuestions] = useState([]);

  const configuration = new Configuration({
    organization: process.env.REACT_APP_ORGANIZATION_ID,
    apiKey: process.env.REACT_APP_OPENAI_KEY,
  });

  const updateMessage = (key, _value) => {
    addItem({ role: "user", content: key });
    setMessage("");
  };

  const clearMessages = () => {
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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      alignToTop: false,
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      const options = {
        model: gpt4 ? "gpt-4" : "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
      };

      try {
        await openai.createChatCompletion(options).then((response) => {
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
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setLoadingMessageIndex(-1);
      }
    };

    getDavinciResponse();
  }, [messages]);

  useEffect(() => {
    if (
      messages.length == 0 ||
      messages[messages.length - 1].role == "user" ||
      messages[messages.length - 1].role == "system" ||
      messages[messages.length - 2].content == newChat
    ) {
      return;
    }

    const options = {
      model: "gpt-3.5-turbo",
      messages: [
        ...messages,
        {
          role: "system",
          content: "Gere lista de perguntas sobre a sua última resposta.",
        },
      ],
      temperature: 0.7,
    };

    const getDavinciResponse = async () => {
      const openai = new OpenAIApi(configuration);
      await openai.createChatCompletion(options).then((response) => {
        let botResponse = "";
        response.data.choices.forEach(({ message }) => {
          botResponse += message.content;
        });
        setPromptTokens(promptTokens + response.data.usage.prompt_tokens);
        setCompletionTokens(
          completionTokens + response.data.usage.completion_tokens
        );
        const separators = /[;,|\-\n]/;
        let questions = botResponse.split(separators);
        setTotalTokens(totalTokens + response.data.usage.total_tokens);
        setQuestions(questions);
        console.log(JSON.stringify(questions));
      });
    };

    getDavinciResponse();
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
            isLoading={index === loadingMessageIndex && loading}
          />
        );
      }
    });
  };

  const getPrice = () => {
    let price = ((totalTokens * 0.002) / 1000) * 5.3;
    let formated = Math.trunc(price * 100) / 100;
    return formated.toFixed(2);
  };

  const renderQuestions = () => {
    return questions.map((q, index) => {
      if (index === 0) {
        return;
      }
      return (
        <MDBBadge className="ms-2" onClick={() => clickQuestion(q)}>
          {q}
        </MDBBadge>
      );
    });
  };

  const clickQuestion = (question) => {
    setMessage(question);
    // updateMessage(message);
  };

  return (
    <>
      <MDBRow ref={messagesEndRef}>
        <MDBCol md="6" lg="7" xl="12">
          <MDBTypography listUnStyled>{renderMessages()}</MDBTypography>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="6" lg="7" xl="12">
          <MDBTypography listUnStyled>
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
          </MDBTypography>
        </MDBCol>
        <MDBRow>
          <MDBCol md="6" lg="7" xl="12">
            <MDBTypography listUnStyled>
              <br />
              <MDBSwitch
                id="gpt4"
                label="Usar GPT-4?"
                checked={gpt4}
                onChange={() => setGpt4(!gpt4)}
              />
              <br />
              {renderQuestions()}
              <br />
              <br />
              <span class="badge rounded-pill badge-warning">
                Custo R$: {getPrice()}
              </span>
            </MDBTypography>
          </MDBCol>
        </MDBRow>
      </MDBRow>
    </>
  );
};

export default ChatMessages;
