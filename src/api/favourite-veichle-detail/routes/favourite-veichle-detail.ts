import { factories } from "@strapi/strapi";

export default factories.createCoreRouter(
  "api::favourite-veichle.favourite-veichle"
);

("use strict");

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter(
  "api::favourite-veichle.favourite-veichle"
);

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
    path: "/favourite-veichles-detail/:id",
    handler: "favourite-veichle-detail.findWithDetails",
    config: {
      policies: [],
      middlewares: [],
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
