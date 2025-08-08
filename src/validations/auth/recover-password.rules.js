import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
  sameAs,
} from "@vuelidate/validators";

export const forgotRules = {
  data: {
    email: {
      required: helpers.withMessage("Informe seu email", required),
      email: helpers.withMessage("Informe um email válido", email),
      maxLength: helpers.withMessage(
        "O email deve conter um máximo de 120 dígitos",
        maxLength(120)
      ),
    },
  },
};

export const verifyRules = {
  data: {
    code: {
      required: helpers.withMessage("Informe o código", required),
      minLength: helpers.withMessage(
        "O código deve ter 6 dígitos",
        minLength(6)
      ),
      maxLength: helpers.withMessage(
        "O código deve ter 6 dígitos",
        maxLength(6)
      ),
    },
  },
};

export const resetRules = (password) => ({
  data: {
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
    confirmPassword: {
      required: helpers.withMessage("Confirme sua senha", required),
      sameAs: helpers.withMessage(
        "As senhas não correspondem",
        sameAs(password)
      ),
    },
  },
});
