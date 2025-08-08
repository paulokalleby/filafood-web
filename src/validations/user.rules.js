import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators";

export const userStoreRules = {
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
  email: {
    required: helpers.withMessage("Informe o email", required),
    email: helpers.withMessage("Informe um email valido", email),
    maxLength: helpers.withMessage(
      "O email deve conter um máximo de 120 dígitos",
      maxLength(120)
    ),
  },
  password: {
    required: helpers.withMessage("Informe uma senha", required),
    minLength: helpers.withMessage(
      "A senha deve conter um mínimo de 8 dígitos",
      minLength(8)
    ),
    maxLength: helpers.withMessage(
      "A senha deve conter um máximo de 16 dígitos",
      maxLength(16)
    ),
  },
};

export const userUpdateRules = {
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
  email: {
    required: helpers.withMessage("Informe o email", required),
    email: helpers.withMessage("Informe um email valido", email),
    maxLength: helpers.withMessage(
      "O email deve conter um máximo de 120 dígitos",
      maxLength(120)
    ),
  },
  password: {
    minLength: helpers.withMessage(
      "A senha deve conter um mínimo de 8 dígitos",
      minLength(8)
    ),
    maxLength: helpers.withMessage(
      "A senha deve conter um máximo de 16 dígitos",
      maxLength(16)
    ),
  },
};
