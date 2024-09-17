import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    // stampa la lista delle auto con tutti i dettagli per le singole cards
    async findDetail(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: "image",
      };
      const formatNumber = (number) => {
        if (!number) return null;
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

      const { data, meta } = await super.find(ctx);

      const filteredData = data.map((item) => ({
        id: item.id,
        title: item.attributes.title,
        littleDescription: item.attributes.littleDescription,
        kilometers: formatNumber(item.attributes.kilometers),
        image:
          item.attributes.image?.data?.attributes?.formats?.medium?.url || // cambiare tra small, medium, large
          item.attributes.image?.data?.attributes?.url,
        gearBox: item.attributes.gearBox,
        price: formatNumber(item.attributes.price),
        dateOfFirstRegistration: item.attributes.dateOfFirstRegistration,
      }));

      return { data: filteredData, meta };
    },

    // stampa l' auto con tutti i dettagli per la singola card, auto che viene cercata tramite ID
    async findOneDetail(ctx) {
      const { id } = ctx.params; // Ottieni l'ID dalla richiesta

      // Imposta la query per popolare l'immagine
      ctx.query = {
        ...ctx.query,
        populate: "image",
      };

      // Verifica che l'ID sia fornito
      if (!id) {
        return ctx.badRequest("Missing product ID");
      }

      // Ottieni il prodotto con l'ID specificato
      const { data, meta } = await super.findOne(ctx);

      // Formatta il prodotto
      const formatNumber = (number) => {
        if (!number) return null;
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

      const formattedData = {
        id: data.id,
        title: data.attributes.title,
        littleDescription: data.attributes.littleDescription,
        description: data.attributes.description,
        image:
          data.attributes.image?.data?.attributes?.formats?.large?.url ||
          data.attributes.image?.data?.attributes?.url,
        kilometers: formatNumber(data.attributes.kilometers),
        dateOfFirstRegistration: data.attributes.dateOfFirstRegistration,
        gearBox: data.attributes.gearBox,
        price: formatNumber(data.attributes.price),
        fuelType: data.attributes.fuelType,
        color: data.attributes.color,
        cv: data.attributes.cv,
        brend: data.attributes.brend,
        plate: data.attributes.plate,
        tractionType: data.attributes.tractionType,
        carType: data.attributes.carType,
      };

      return { data: formattedData, meta };
    },
  })
);
