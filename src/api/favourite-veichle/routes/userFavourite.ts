export default {
  routes: [
    {
      method: "POST",
      path: "/favourites/manage",
      handler: "user-favourite.manageFavourites",
      config: {
        policies: [],
      },
    },
  ],
};
