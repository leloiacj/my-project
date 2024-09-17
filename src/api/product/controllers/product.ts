// controller che da in visualizzazione tutte le auto presenti nel database con dettagli definiti dallo sviluppatore

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async findAll(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: "image",
      };

      // Funzione per formattare i numeri con il punto dopo le prime due cifre
      const formatNumber = (number) => {
        if (!number) return null;
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

      const { data, meta } = await super.find(ctx);

      const filteredData = data.map((item) => ({
        id: item.id,
        title: item.attributes.title,
        littleDescription: item.attributes.littleDescription,
        description: item.attributes.description,
        image:
          item.attributes.image?.data?.attributes?.formats?.large?.url ||
          item.attributes.image?.data?.attributes?.url,
        kilometers: formatNumber(item.attributes.kilometers),
        dateOfFirstRegistration: item.attributes.dateOfFirstRegistration,
        gearBox: item.attributes.gearBox,
        price: formatNumber(item.attributes.price),
        fuelType: item.attributes.fuelType,
        color: item.attributes.color,
        cv: item.attributes.cv,
        brend: item.attributes.brend,
        plate: item.attributes.plate,
        tractionType: item.attributes.tractionType,
        carType: item.attributes.carType,
      }));

      return { data: filteredData, meta };
    },
  })
);
