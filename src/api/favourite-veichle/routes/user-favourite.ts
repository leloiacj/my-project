export default {
  routes: [
    {
      method: "POST",
      path: "/logged-users/favorites",
      handler: "user-favourite.addToFavorites",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
