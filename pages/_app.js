import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "@/context/ThemeContext";
import Head from "next/head";
import Script from "next/script";
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
    background-color:#4A86E870;
    border-radius: 10px;
    border: 3px solid transparent;
  }
}
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SolaSlides</title>
        <meta
          name="description"
          content="SolaSlides - The Smart Way to Study Slides."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {process.env.NEXT_PUBLIC_ENVIRONMENT === "prod" && (
        <>
          <Script
            src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"
            strategy="beforeInteractive"
          />
          <Script
            src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz"
            strategy="beforeInteractive"
          />
          <Script
            id="amplitude-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function initAmplitude() {
                    if (window.amplitude && window.sessionReplay) {
                      window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
                      window.amplitude.init('e2694e7ba4e957bf42b27d04a32303ff', {"autocapture":{"elementInteractions":true}});
                    } else {
                      setTimeout(initAmplitude, 100);
                    }
                  }
                  initAmplitude();
                })();
              `,
            }}
          />
        </>
      )}
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
