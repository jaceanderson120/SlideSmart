import { createGlobalStyle } from "styled-components";
import Head from "next/head";
import "@fontsource/public-sans/100.css";
import "@fontsource/public-sans/200.css";
import "@fontsource/public-sans/300.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/public-sans/700.css";
import "@fontsource/public-sans/800.css";
import "@fontsource/public-sans/900.css";

export const GlobalStyles = createGlobalStyle`
* {
  font-family: "Public Sans";
  box-sizing: border-box;
  font-weight: 400;
  margin: 0;
  padding: 0;
  line-height: 1;
}
`

export default function App({ Component, pageProps }) {
  return (
    <>

      <Head>
        <title>SlideSmart | Turn your slides usefull</title>
        <meta name="description" content="Slidesmart - Turn your classroom slides into an actually usefull resource." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
        <GlobalStyles />

        <Component {...pageProps} />
    </>  
  );
}
