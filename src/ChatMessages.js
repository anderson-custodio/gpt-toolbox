import React, { useEffect, useState } from "react";
import { MDBCol, MDBBtn, MDBTypography, MDBTextArea } from "mdb-react-ui-kit";
import MyMessage from "./MyMessage";
import GptMessage from "./OtherMessage";
import { Configuration, OpenAIApi } from "openai";

const ChatMessages = () => {
  const [messages, setMessages] = useState(new Map());
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");

  const updateMessage = (key, value) => {
    setQuestion(key);
    setMessages((map) => new Map(map.set(`Q: ${key}`, "A: ")));
    setMessage("");
  };

  const onChangeHandler = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (question.length === 0) return;

    const configuration = new Configuration({
      organization: "",
      apiKey: "",
    });

    const openai = new OpenAIApi(configuration);

    const getDavinciResponse = async (question) => {
      let query = "";
      for (let [key, value] of messages) {
        query += `${key}: ${value}\n`;
      }

      const options = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }],
      };

      try {
        console.log(JSON.stringify(query));
        const response = await openai.createChatCompletion(options);
        let botResponse = "";
        response.data.choices.forEach(({ message }) => {
          botResponse += message.content;
        });
        setMessages(
          (map) => new Map(map.set(`Q: ${question}`, `A: ${botResponse}`))
        );
      } catch (e) {
        console.log(e);
      }
    };

    getDavinciResponse(question).then((response) => {
      console.log(response);
    });
  }, [question]);

  const renderMessages = () => {
    return Array.from(messages).map(([key, value], index) => {
      const question = key.substring(3);
      const answer = value.substring(3);
      const isLoading = answer === "";
      if (isLoading) {
        return (
          <MyMessage
            key={`my-message-${index}`}
            k={`my-message-${index}`}
            message={question}
            userName="afcustodioo"
            userMail="afcustodioo@gmail.com"
            isLoading={isLoading}
          />
        );
      } else {
        return (
          <React.Fragment key={index}>
            <MyMessage
              key={`my-message-${index}`}
              k={`my-message-${index}`}
              message={question}
              userName="User"
              userMail="user@gmail.com"
              isLoading={isLoading}
            />
            <GptMessage key={`gpt-message-${index}`} message={answer} />
          </React.Fragment>
        );
      }
    });
  };

  return (
    <MDBCol md="6" lg="7" xl="8">
      <MDBTypography listUnStyled>
        {renderMessages()}
        <li key="quen" className="bg-white mb-3">
          <MDBTextArea
            label="Message"
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
      </MDBTypography>
    </MDBCol>
  );
};

export default ChatMessages;
