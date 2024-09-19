import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async searchProducts(ctx) {
      const {
        query,
        title,
        brend,
        fuelType,
        color,
        gearBox,
        carType,
        tractionType,
        dateOfFirstRegistration,
        price,
        kilometers,
        cv,
        littleDescription,
        description,
      } = ctx.request.query;

      if (
        !query &&
        !title &&
        !brend &&
        !fuelType &&
        !color &&
        !gearBox &&
        !carType &&
        !tractionType &&
        !dateOfFirstRegistration &&
        !price &&
        !kilometers &&
        !cv &&
        !littleDescription &&
        !description
      ) {
        return ctx.badRequest("Inserisci almeno un parametro di ricerca");
      }

      try {
        const whereClause = {
          $and: [],
        };

        if (query) {
          whereClause.$and.push({
            $or: [
              { title: { $containsi: query } },
              { description: { $containsi: query } },
              { littleDescription: { $containsi: query } },
              { brend: { $containsi: query } },
              { fuelType: { $containsi: query } },
              { color: { $containsi: query } },
              { plate: { $containsi: query } },
              { carType: { $containsi: query } },
              { tractionType: { $containsi: query } },
              { cv: { $containsi: query } },
              { kilometers: { $containsi: query } },
              { price: { $containsi: query } },
            ],
          });
        }

        if (title) whereClause.$and.push({ title: { $containsi: title } });
        if (brend) whereClause.$and.push({ brend: { $containsi: brend } });
        if (fuelType)
          whereClause.$and.push({ fuelType: { $containsi: fuelType } });
        if (color) whereClause.$and.push({ color: { $containsi: color } });
        if (gearBox)
          whereClause.$and.push({ gearBox: { $containsi: gearBox } });
        if (carType)
          whereClause.$and.push({ carType: { $containsi: carType } });
        if (tractionType)
          whereClause.$and.push({ tractionType: { $containsi: tractionType } });
        if (cv) whereClause.$and.push({ cv: cv });
        if (kilometers) whereClause.$and.push({ kilometers: kilometers });
        if (price) whereClause.$and.push({ price: price });
        if (littleDescription)
          whereClause.$and.push({
            littleDescription: { $containsi: littleDescription },
          });
        if (description)
          whereClause.$and.push({ description: { $containsi: description } });

        if (dateOfFirstRegistration) {
          whereClause.$and.push({
            dateOfFirstRegistration: { $gte: dateOfFirstRegistration },
          });
        }

        const products = await strapi.db
          .query("api::product.product")
          .findMany({
            where: whereClause,
            populate: {
              image: true,
            },
          });

        return ctx.send({ data: products });
      } catch (err) {
        ctx.throw(500, err.message);
      }
    },
  })
);
