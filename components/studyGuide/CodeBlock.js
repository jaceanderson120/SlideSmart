import React, { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import c from "highlight.js/lib/languages/c";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import php from "highlight.js/lib/languages/php";
import typescript from "highlight.js/lib/languages/typescript";
import swift from "highlight.js/lib/languages/swift";
import kotlin from "highlight.js/lib/languages/kotlin";
import rust from "highlight.js/lib/languages/rust";
import html from "highlight.js/lib/languages/xml"; // HTML is handled by the XML language
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/atom-one-dark.css";
import styled from "styled-components";

// Register the languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("c", c);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("go", go);
hljs.registerLanguage("php", php);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);

const CodeBlock = ({ code }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = hljs.highlightAuto(code).value; // Auto detects the language
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
  margin: 8px 0;
  border: 1px solid ${({ theme }) => theme.black};
`;
