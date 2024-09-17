"use strict";

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
                image: true, // Popola anche il campo dell'immagine
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
          title: item.title,
          littleDescription: item.littleDescription,
          kilometers: item.kilometers,
          image:
            item.image?.formats?.large?.url || // Se esiste il formato 'large'
            item.image?.url, // Altrimenti prendi l'URL generale
          gearBox: item.gearBox,
          price: item.price,
          dateOfFirstRegistration: item.dateOfFirstRegistration,
        })),
        username: favouriteVeichle.logged_user.username,
      };

      ctx.body = response;
    } catch (err) {
      ctx.throw(500, err.message);
    }
  },
};
