"use strict";
// controller che permette la visualizzazione della lista in singolo con in dettaglio le macchine e l'username di chi ha salvato nei preferiti
module.exports = {
  async findWithDetails(ctx) {
    const { id } = ctx.params;
    try {
      const favouriteVeichle = await strapi.db
        .query("api::favourite-veichle.favourite-veichle")
        .findOne({
          where: { id },
          populate: {
            products: {
              populate: {
                image: true,
              },
            },
            logged_user: true,
          },
        });

      if (!favouriteVeichle) {
        return ctx.notFound("Favourite Veichle not found");
      }

      const response = {
        products: favouriteVeichle.products.map((item) => ({
          id: item.id,
          title: item.title,
          littleDescription: item.littleDescription,
          kilometers: item.kilometers,
          image: item.image?.formats?.large?.url || item.image?.url,
          gearBox: item.gearBox,
          price: item.price,
          dateOfFirstRegistration: item.dateOfFirstRegistration,
          isFavourite: item.isFavourite,
        })),
        username: favouriteVeichle.logged_user.username,
      };

      ctx.body = response;
    } catch (err) {
      ctx.throw(500, err.message);
    }
  },
};
