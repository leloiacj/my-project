"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/favourite-veichles-detail/:id",
      handler: "favourite-veichle-detail.findWithDetails",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
