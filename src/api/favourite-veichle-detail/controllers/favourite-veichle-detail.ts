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
            products: true,
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
          // image:
          //   item.image?.data?.attributes?.formats?.large?.url ||
          //   item.image?.data?.attributes?.url,
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
