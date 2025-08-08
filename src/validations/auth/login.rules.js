import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators";

const loginRules = {
  email: {
    required: helpers.withMessage("Informe seu email", required),
    email: helpers.withMessage("Informe um email valido", email),
    maxLength: helpers.withMessage(
      "O email deve conter um máximo e 120 dígitos",
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

export default loginRules;
