import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Head from "../components/Head";
import "../styles/globals.css";
import "../styles/themes.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Admin panel renders standalone, without the portfolio chrome.
  const isAdmin = router.pathname.startsWith("/admin");

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("theme")
      );
    }
  }, []);

  if (isAdmin) {
    return (
      <>
        <Head title={`Admin | ${pageProps.title || "Dashboard"}`} />
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <Layout>
      <Head title={`SHAMIRUL ISLAM | ${pageProps.title}`} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
