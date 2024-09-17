import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async searchProducts(ctx) {
      const { query } = ctx.request.query; // Prendiamo il parametro di ricerca

      if (!query) {
        return ctx.badRequest("Inserisci un parametro di ricerca");
      }

      try {
        // Query dinamica su più campi
        const products = await strapi.db
          .query("api::product.product")
          .findMany({
            where: {
              $or: [
                { title: { $containsi: query } }, // Cerca nel campo 'title'
                { description: { $containsi: query } }, // Cerca nel campo 'description'
                { brend: { $containsi: query } }, // Cerca nel campo 'brend'
                { fuelType: { $containsi: query } }, // Cerca nel campo 'fuelType'
                { color: { $containsi: query } }, // Cerca nel campo 'color'
                { plate: { $containsi: query } }, // Cerca nel campo 'plate'
                { carType: { $containsi: query } }, // Cerca nel campo 'carType'
              ],
            },
            populate: {
              image: true, // Popoliamo le immagini se necessario
            },
          });

        return ctx.send({ data: products });
      } catch (err) {
        ctx.throw(500, err.message);
      }
    },
  })
);
