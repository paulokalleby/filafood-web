import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export const productRules = {
  category: {
    required: helpers.withMessage("Selecione a categoria", required),
  },
  name: {
    required: helpers.withMessage("Informe o nome", required),
    minLength: helpers.withMessage(
      "O nome deve conter um mínimo de 2 dígitos",
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      "O nome deve conter um máximo de 50 dígitos",
      maxLength(50)
    ),
  },
  price: {
    required: helpers.withMessage("Informe o preço", required),
  },
  description: {
    minLength: helpers.withMessage(
      "A descrição deve conter um mínimo de 2 dígitos",
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      "A descrição deve conter um máximo de 250 dígitos",
      maxLength(250)
    ),
  },
};
