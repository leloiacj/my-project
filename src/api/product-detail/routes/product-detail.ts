// ./api/product/config/routes.json
"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::product.product");

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: "GET",
    path: "/products-detail",
    handler: "product-detail.findDetail",
    config: {
      policies: [],
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
