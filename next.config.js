module.exports = {
  async redirects() {
    return [
      {
        source: "/resume",
        destination:
          "https://docs.google.com/document/d/12g50qJem_twcVmCw90jw04F4wuytgCLcJpCELamek7g/edit?usp=sharing",
        permanent: true,
      },
      {
        source: "/github",
        destination: "http://github.com/davertron",
        permanent: true,
      },
      {
        source: "/linkedin",
        destination: "http://lnkd.in/ZNAJtW",
        permanent: true,
      },
      {
        source: "/hn",
        destination: "http://news.ycombinator.com/user?id=Davertron",
        permanent: true,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/davertron",
        permanent: true,
      },
      {
        source: "/stackoverflow",
        destination: "https://meta.stackoverflow.com/users/205334/davertron",
        permanent: true,
      },
      {
        source: "/schedule",
        destination: "/icepack",
        permanent: true,
      },
    ];
  },
};
