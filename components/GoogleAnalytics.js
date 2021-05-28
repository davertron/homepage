import { useEffect } from "react";

export default function GoogleAnalytics() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "UA-16963916-1");
  }, []);

  return (
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-16963916-1"
    ></script>
  );
}
