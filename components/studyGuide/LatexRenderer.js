import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const delimiters = [
  { left: "$$", right: "$$", display: true },
  { left: "\\[", right: "\\]", display: true },
  { left: "\\(", right: "\\)", display: false },
  { left: "$", right: "$", display: false },
];

export const LatexRenderer = ({ children }) => {
  // Normalize LaTeX block formatting
  let replaced = children
    .replace(/\$\$[\s\n]*([\s\S]*?)[\s\n]*\$\$/g, "$$$$ $1 $$$$") // Normalize block math
    .replace(/\\\[[\s\n]*([\s\S]*?)[\s\n]*\\\]/g, "$$$$ $1 $$$$") // Convert \[...\] to $$
    .replace(/\\\([\s\n]*([\s\S]*?)[\s\n]*\\\)/g, "$ $1 $") // Convert \(...\) to inline math
    .replace(/\n+/g, "<br /><br />") // Convert newlines to a double break
    .trim();

  // Process Markdown-like formatting
  const formatted = replaced
    .replace(/(`[^`]+`)/g, "<code>$1</code>")
    .replace(/\*\*([^*$]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\\)\*([^*$]+)\*/g, "<em>$1</em>");

  return <Latex delimiters={delimiters}>{formatted}</Latex>;
};
