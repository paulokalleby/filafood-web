import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators";

const registerRules = {
  company: {
    required: helpers.withMessage("Informe seu nome do seu negócio", required),
    minLength: helpers.withMessage(
      "O nome do negócio deve conter um mínimo de 3 dígitos",
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      "O nome negócio deve conter um máximo de 50 dígitos",
      maxLength(50)
    ),
  },
  name: {
    required: helpers.withMessage("Informe seu nome", required),
    minLength: helpers.withMessage(
      "O nome deve conter um mínimo de 3 dígitos",
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      "O nome deve conter um máximo de 50 dígitos",
      maxLength(50)
    ),
  },
  email: {
    required: helpers.withMessage("Informe seu email", required),
    email: helpers.withMessage("Informe um email valido", email),
    maxLength: helpers.withMessage(
      "O email deve conter um máximo de 120 dígitos",
      maxLength(120)
    ),
  },
  password: {
    required: helpers.withMessage("Informe sua senha", required),
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

export default registerRules;
