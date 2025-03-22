import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "@/context/ThemeContext";
import Head from "next/head";
import { StateContext } from "@/context/StateContext";
import { ToastContainer } from "react-toastify";

export const GlobalStyles = createGlobalStyle`
* {
  font-family: "Arial", sans-serif;
  box-sizing: border-box;
  font-weight: 400;
  margin: 0;
  padding: 0;
  line-height: 1;

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color:#f04a3770;
    border-radius: 10px;
    border: 3px solid transparent;
  }
}
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SlideSmart</title>
        <meta
          name="description"
          content="Slidesmart - The Smart Way to Study Slides."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyles />
      <StateContext>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </StateContext>
      <ToastContainer position="top-right" autoClose={8000} />
    </>
  );
}
