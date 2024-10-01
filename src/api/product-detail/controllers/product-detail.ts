import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    // stampa la lista delle auto con tutti i dettagli per le singole cards
    async findDetail(ctx) {
      try {
        ctx.query = {
          ...ctx.query,
          populate: "image",
        };

        const formatNumber = (number) => {
          if (!number) return null;
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        const { data, meta } = await super.find(ctx);

        // Verifica che `data` esista e contenga elementi
        if (!data || data.length === 0) {
          return ctx.notFound("Nessun prodotto trovato");
        }

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
      } catch (error) {
        return ctx.internalServerError(
          "Errore interno nel recupero dei prodotti"
        );
      }
    },

    // stampa l'auto con tutti i dettagli per la singola card, auto che viene cercata tramite ID
    async findOneDetail(ctx) {
      try {
        const { id } = ctx.params; // Ottieni l'ID dalla richiesta

        // Verifica che l'ID sia fornito
        if (!id) {
          return ctx.badRequest("ID del prodotto mancante");
        }

        // Imposta la query per popolare l'immagine
        ctx.query = {
          ...ctx.query,
          populate: "image",
        };

        // Ottieni il prodotto con l'ID specificato
        const { data } = await super.findOne(ctx);

        // Verifica che `data` esista
        if (!data) {
          return ctx.notFound(`Prodotto con ID ${id} non trovato`);
        }

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
          isFavourite: data.attributes.isFavourite,
        };

        return { data: formattedData };
      } catch (error) {
        return ctx.internalServerError(
          "Errore interno nel recupero del dettaglio del prodotto"
        );
      }
    },
  })
);
