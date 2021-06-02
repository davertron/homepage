module.exports = {
  async redirects() {
    return [
      {
        source: "/resume",
        destination:
          "https://docs.google.com/document/d/12g50qJem_twcVmCw90jw04F4wuytgCLcJpCELamek7g/edit?usp=sharing",
        permanent: true,
      },
    ];
  },
};
