import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export const tableRules = {
  number: {
    required: helpers.withMessage("Informe o número da mesa", required),
  },
  description: {
    minLength: helpers.withMessage(
      "A descrição deve conter um mínimo de 2 dígitos",
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      "A descrição deve conter um máximo de 100 dígitos",
      maxLength(100)
    ),
  },
};
