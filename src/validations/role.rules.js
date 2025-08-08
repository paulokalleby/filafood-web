import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export const roleRules = {
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
};
