"use strict";

module.exports = ({ strapi }) => ({
  async manageFavourites(ctx) {
    const { loggedUserId, productId, action } = ctx.request.body;

    // Verifica se l'ID dell'utente loggato, l'ID del prodotto e l'azione sono presenti
    if (!loggedUserId || !productId || !action) {
      return ctx.badRequest(
        "loggedUserId, productId, and action are required."
      );
    }

    if (!["add", "remove"].includes(action)) {
      return ctx.badRequest("Invalid action. It should be 'add' or 'remove'.");
    }

    try {
      // Trova l'utente loggato con i prodotti preferiti popolati
      const loggedUser = await strapi.entityService.findOne(
        "api::logged-user.logged-user",
        loggedUserId,
        {
          populate: {
            favourite_veichle: {
              populate: ["products"], // Assicurati che i prodotti siano popolati
            },
          },
        }
      );

      if (!loggedUser) {
        return ctx.notFound("User not found.");
      }

      let favouriteVeichle = loggedUser.favourite_veichle;

      if (!favouriteVeichle) {
        // Se non esiste un "favouriteVeichle", lo creiamo solo per l'azione "add"
        if (action === "add") {
          favouriteVeichle = await strapi.entityService.create(
            "api::favourite-veichle.favourite-veichle",
            {
              data: {
                id: loggedUserId,
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
        } else {
          return ctx.notFound("No favourite products found for this user.");
        }
      }

      const product = await strapi.entityService.findOne(
        "api::product.product",
        productId
      );

      if (!product) {
        return ctx.notFound("Product not found.");
      }

      const isProductInFavorites =
        Array.isArray(favouriteVeichle.products) &&
        favouriteVeichle.products.some((p) => p.id === productId);

      // Gestione dell'azione "add"
      if (action === "add") {
        if (isProductInFavorites) {
          return ctx.send({
            message: "Product is already in favorites, no changes made.",
            favouriteVeichle,
          });
        }

        // Aggiungi il prodotto ai preferiti
        const updatedFavouriteVeichle = await strapi.entityService.update(
          "api::favourite-veichle.favourite-veichle",
          favouriteVeichle.id,
          {
            data: {
              products: [
                ...(Array.isArray(favouriteVeichle.products)
                  ? favouriteVeichle.products.map((p) => p.id)
                  : []),
                productId,
              ],
            },
          }
        );

        return ctx.send({
          message: "Product added to favorites.",
          favouriteVeichle: updatedFavouriteVeichle,
        });
      }

      // Gestione dell'azione "remove"
      if (action === "remove") {
        if (!isProductInFavorites) {
          return ctx.send({
            message: "Product was not in favorites, no changes made.",
            favouriteVeichle,
          });
        }

        // Rimuovi il prodotto dai preferiti
        const updatedFavouriteVeichle = await strapi.entityService.update(
          "api::favourite-veichle.favourite-veichle",
          favouriteVeichle.id,
          {
            data: {
              products: favouriteVeichle.products
                .filter((p) => p.id !== productId) // Rimuovi il prodotto dall'array
                .map((p) => p.id), // Mappa solo gli ID dei prodotti
            },
          }
        );

        return ctx.send({
          message: "Product removed from favorites.",
          favouriteVeichle: updatedFavouriteVeichle,
        });
      }
    } catch (error) {
      console.error("Error managing product in favorites:", error);
      return ctx.internalServerError(
        "An error occurred while managing the product in favorites."
      );
    }
  },
});
