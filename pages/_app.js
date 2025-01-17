import { createGlobalStyle } from "styled-components";
import Head from "next/head";
import { StateContext } from "@/context/StateContext";
import "@fontsource/public-sans/100.css";
import "@fontsource/public-sans/200.css";
import "@fontsource/public-sans/300.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/public-sans/700.css";
import "@fontsource/public-sans/800.css";
import "@fontsource/public-sans/900.css";
import { ToastContainer } from "react-toastify";

export const GlobalStyles = createGlobalStyle`
* {
  font-family: "Public Sans";
  box-sizing: border-box;
  font-weight: 400;
  margin: 0;
  padding: 0;
  line-height: 1;
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
        <Component {...pageProps} />
      </StateContext>
      <ToastContainer position="top-right" autoClose={8000} />
    </>
  );
}
