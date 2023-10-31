function onlyNumbers(str) {
  return str.replace(/\D/g, '');
}

function maskCnpj(cnpj) {
  if (cnpj && cnpj.length === 14) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return cnpj || '';
}

function maskCep(cep) {
  if (cep && cep.length === 8) {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  return cep || '';
}

function maskTelefone(telefone) {
  if (telefone && telefone.length === 13) {
    return telefone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  }
  return telefone || '';
}

function validateCNPJ(cnpj) {
  // Remova caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifique se o CNPJ tem 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verifique se o CNPJ não é uma sequência de dígitos iguais
  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  // Calcula os dígitos verificadores
  let sum = 0;
  let weight = 2;

  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  sum = 0;
  weight = 2;

  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder2 = sum % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;

  // Verifica se os dígitos verificadores estão corretos
  return parseInt(cnpj.charAt(12)) === digit1 && parseInt(cnpj.charAt(13)) === digit2;
}

function isValidEmail(email) {
  // Regular expression for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateCEP(cep) {
  const cepPattern = /^[0-9]{8}$/;
  if (!cepPattern.test(cep)) {
    return 'CEP inválido';
  }
  return '';
}

export { onlyNumbers, maskCnpj, maskCep, maskTelefone, validateCNPJ, isValidEmail };