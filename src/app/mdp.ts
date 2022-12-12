import { AbstractControl, ValidationErrors } from '@angular/forms';

export const Password = function (
  control: AbstractControl
): ValidationErrors | null {
  let value: string = control.value || '';

  if (!value) {
    return null;
  }
  if (value.length < 8) {
    return { passwordStrength: 'Au moins 8 Caractères' };
  }

  let upperCaseCharacters = /[A-Z]+/g;
  if (upperCaseCharacters.test(value) === false) {
    return {
      passwordStrength: `Le mot de passe doit contenir au moins une lettre Majuscule`,
    };
  }

  let numberCharacters = /[0-9]+/g;
  if (numberCharacters.test(value) === false) {
    return {
      passwordStrength: `Le mot de passe doit contenir au moins un chiffre`,
    };
  }

  let specialCharacters = /[~!@#$%^&*()_+\-\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharacters.test(value) === false) {
    return {
      passwordStrength: `Le mot de passe doit contenir au moins un caractère spécial`,
    };
  }
  return null;
};
