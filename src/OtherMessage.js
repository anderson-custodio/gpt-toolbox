import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import gptImage from "./images/gpt.png";

function parseString(string) {
  const lines = string.split('\n');
  const parsedList = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('```')) {
      const codeContent = line.substring(3);
      const closingIndex = lines.indexOf('```', i + 1);
      const codeBlock = lines.slice(i + 1, closingIndex).join('\n');
      const language = codeContent.trim();
      parsedList.push({ type: 'code', content: codeBlock, language });
      i = closingIndex;
    } else if (/^-/.test(line)) {
      const listItems = [];
      listItems.push(line.replace(/^-/, '').trim());

      while (i + 1 < lines.length && !lines[i + 1].startsWith('```') && !/^-/.test(lines[i + 1])) {
        i++;
        const listItem = lines[i].trim();
        listItems.push(listItem);
      }

      parsedList.push({ type: 'list', content: listItems });
    } else if (/^\d+\./.test(line)) {
      parsedList.push({ type: 'numeral', content: line });
    } else {
      parsedList.push({ type: 'text', content: line });
    }
  }

  return parsedList;
}

const GptMessage = ({ message, ...props }) => {
  return (
    <tr>
      <td>
        <img
          src={gptImage}
          alt="avatar"
          className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
          width="40"
        />
      </td>
      <td>
        {renderContent(message)}
      </td>
      <td></td>
    </tr>
  );
};

const renderContent = message => {
  const content = parseString(message);
  console.log(content);
  return content.map((m, index) => {
    if (m.type === 'text') {
      return <p className="mb-0">{m.content}</p>
    } else if (m.type === 'code') {
      return (
        <SyntaxHighlighter showLineNumbers={true} wrapLongLines={true} wrapLines={true} language={m.language} style={vs} className="mb-0">
          {m.content}
        </SyntaxHighlighter>
      );
    } else if (m.type === 'list') {
      return <p className="mb-0">{m.content}</p>;
    } else if (m.type === 'numeral') {
      return <p className="mb-0">{m.content}</p>;
    } else {
      return <p className="mb-0">{m.content}</p>;
    }
  });
};

export default GptMessage;
