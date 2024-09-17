module.exports = {
  routes: [
    {
      method: "GET",
      path: "/product-search/search",
      handler: "product-search.searchProducts",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
