import { Fragment } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const delimiters = [
  { left: "$$", right: "$$", display: true },
  { left: "\\[", right: "\\]", display: true },
  { left: "\\(", right: "\\)", display: false },
  { left: "$", right: "$", display: false },
];

export const LatexRenderer = ({ children }) => {
  // Replace LaTeX delimiters with MathJax-compatible ones
  const replaced = children.replaceAll("\\[\n", "$$").replaceAll("\n\\]", "$$");

  const splitContent = replaced.split("\n").filter((str) => str.trim() !== "");
  const withBold = splitContent.map((str) =>
    str
      // First handle bullet points at start of lines (before any other * processing)
      .replace(/^\* /gm, "• ")
      // Then handle bold text
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      // Finally handle italics, but not if it's part of a LaTeX expression
      .replace(/(?<![\\$])\*([^*]+)\*(?![\\$])/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "$1")
  );
  // Replace numbered list markers with line breaks
  const finalContent = withBold.map((str) =>
    str.replace(/\n(\d+\. )/g, "<br /> <br />$1")
  );

  return (
    <>
      {finalContent.map((str, index, arr) => (
        <Fragment key={index}>
          <Latex delimiters={delimiters}>{str}</Latex>
          {index !== arr.length - 1 && (
            <>
              <br />
              <br />
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};
