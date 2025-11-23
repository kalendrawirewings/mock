export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateIndianPhone = (phone) => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const normalizeIndianPhone = (phone) => {
  let cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');

  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  }

  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  return null;
};

export const isEmailOrPhone = (input) => {
  if (!input) return { type: null, value: null };

  const trimmed = input.trim();

  if (validateEmail(trimmed)) {
    return { type: 'email', value: trimmed.toLowerCase() };
  }

  const normalizedPhone = normalizeIndianPhone(trimmed);
  if (normalizedPhone) {
    return { type: 'phone', value: normalizedPhone };
  }

  return { type: null, value: null };
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters long' };
  }
  if (name.trim().length > 100) {
    return { valid: false, message: 'Name must not exceed 100 characters' };
  }
  return { valid: true };
};
