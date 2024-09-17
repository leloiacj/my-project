/**
 * product router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::product.product");

("use strict");

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
    path: "/productsFindAll",
    handler: "product.findAll",
    config: {
      policies: [],
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
