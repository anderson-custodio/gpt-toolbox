import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function TextWithCodeAndList({ text }) {
  // Encontra todas as ocorrências de código no texto usando regex
  const codeRegex = /```([\s\S]*?)```/g;
  const codeMatches = [...text.matchAll(codeRegex)];

  // Divide o texto em partes com base nas ocorrências de código
  const textParts = text.split(codeRegex);

  // Encontra todas as ocorrências de lista no texto usando regex
  const listRegex = /\n\s*- (.*)/g;
  const listMatches = [...text.matchAll(listRegex)];

  // Divide o texto em partes com base nas ocorrências de lista
  const finalTextParts = [];
  textParts.forEach((part) => {
    const listMatch = listMatches.find(
      (match) => match.index > 0 && match.index < part.length + 1
    );
    if (listMatch) {
      const listPart = part.substring(0, listMatch.index - 1);
      if (listPart) finalTextParts.push(listPart);
      finalTextParts.push(
        <ul key={finalTextParts.length}>
          {listMatches
            .filter((match) => match.index > 0 && match.index < part.length + 1)
            .map((match, index) => (
              <li key={index}>{match[1]}</li>
            ))}
        </ul>
      );
      const remainingPart = part.substring(
        listMatch.index + listMatch[0].length
      );
      if (remainingPart) finalTextParts.push(remainingPart);
    } else {
      finalTextParts.push(part);
    }
  });

  // Renderiza o texto com as partes de texto, código e lista separadamente
  return (
    <div>
      {finalTextParts.map((part, index) => {
        if (codeMatches.some((match) => match.index === index)) {
          // Renderiza o código com syntax highlighter
          const codeString = codeMatches.find(
            (match) => match.index === index
          )[1];
          return (
            <SyntaxHighlighter language="python" style={atomDark} key={index}>
              {codeString}
            </SyntaxHighlighter>
          );
        } else {
          // Renderiza o texto ou lista
          return part;
        }
      })}
    </div>
  );
}

export default TextWithCodeAndList;
