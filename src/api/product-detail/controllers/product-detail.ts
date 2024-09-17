import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async findDetail(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: "image",
      };

      const { data, meta } = await super.find(ctx);

      const filteredData = data.map((item) => ({
        id: item.id,
        title: item.attributes.title,
        littleDescription: item.attributes.littleDescription,
        kilometers: item.attributes.kilometers,
        image:
          item.attributes.image?.data?.attributes?.formats?.small?.url || // cambiare tra small, medium, large
          item.attributes.image?.data?.attributes?.url,
        gearBox: item.attributes.gearBox,
        price: item.attributes.price,
        dateOfFirstRegistration: item.attributes.dateOfFirstRegistration,
      }));

      return { data: filteredData, meta };
    },
  })
);
