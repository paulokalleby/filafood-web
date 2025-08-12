import { helpers, minValue, required } from "@vuelidate/validators";

export const tableRules = {
  number: {
    required: helpers.withMessage("Informe o número da mesa", required),
  },
};

export const tableBatchRules = {
  start_number: {
    required: helpers.withMessage("Informe o número inicial", required),
    minValue: helpers.withMessage(
      "O número inicial deve ser maior ou igual a 1",
      minValue(1)
    ),
  },
  end_number: {
    required: helpers.withMessage("Informe o número final", required),
    minValue: helpers.withMessage(
      "O número final deve ser maior ou igual a 1",
      minValue(1)
    ),
  },
};
