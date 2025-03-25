import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import styled from "styled-components";

const CodeBlock = ({ code }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, [code]);

  return (
    <pre>
      <Code ref={codeRef} className="hljs">
        {code}
      </Code>
    </pre>
  );
};

export default CodeBlock;

const Code = styled.code`
  font-family: "Fira Code", monospace;
  font-size: ${({ theme }) => theme.fontSize.default};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px ${({ theme }) => theme.shadow};
`;
