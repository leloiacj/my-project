"use strict";

module.exports = ({ strapi }) => ({
  async addToFavorites(ctx) {
    const { loggedUserId, productId } = ctx.request.body;

    if (!loggedUserId || !productId) {
      return ctx.badRequest("loggedUserId and productId are required.");
    }

    try {
      const loggedUser = await strapi.entityService.findOne(
        "api::logged-user.logged-user",
        loggedUserId,
        {
          populate: ["favourite_veichle"],
        }
      );

      if (!loggedUser) {
        return ctx.notFound("User not found.");
      }

      let favouriteVeichle = loggedUser.favourite_veichle;

      if (!favouriteVeichle) {
        favouriteVeichle = await strapi.entityService.create(
          "api::favourite-veichle.favourite-veichle",
          {
            data: {
              logged_user: loggedUserId,
              products: [],
            },
          }
        );

        await strapi.entityService.update(
          "api::logged-user.logged-user",
          loggedUserId,
          {
            data: {
              favourite_veichle: favouriteVeichle.id,
            },
          }
        );
      }

      const product = await strapi.entityService.findOne(
        "api::product.product",
        productId
      );

      if (!product) {
        return ctx.notFound("Product not found.");
      }

      const isProductAlreadyInFavorites =
        Array.isArray(favouriteVeichle.products) &&
        favouriteVeichle.products.some((p) => p.id === productId);

      if (isProductAlreadyInFavorites) {
        return ctx.conflict("Product is already in the favorites.");
      }

      const updatedFavouriteVeichle = await strapi.entityService.update(
        "api::favourite-veichle.favourite-veichle",
        favouriteVeichle.id,
        {
          data: {
            products: { connect: [productId] },
          },
        }
      );

      return ctx.send({
        message: "Product added to favorites.",
        favouriteVeichle: updatedFavouriteVeichle,
      });
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      return ctx.internalServerError(
        "An error occurred while adding the product to favorites."
      );
    }
  },
});
