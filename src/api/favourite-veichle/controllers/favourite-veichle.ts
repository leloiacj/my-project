/**
 * category controller
 */
// controller che permette di visualizzare la lista totale dei preferiti,  viene visualizzato solo l'id delle liste
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::favourite-veichle.favourite-veichle"
);
