export type InquiryInput = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
};

export type InquiryErrors = Partial<Record<keyof InquiryInput, string>>;

export const INTERESTS = ["Buy a property", "Sell a property", "Rent a property", "Let out my property", "Luxury property", "Consultation"] as const;

export function validateInquiry(v: InquiryInput, opts: { messageRequired?: boolean } = {}): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = v.name.trim();
  if (!name) errors.name = "Please enter your name.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.length > 100) errors.name = "Name is too long.";

  const digits = v.phone.replace(/[\s\-()+]/g, "");
  if (!v.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!/^\d{10,13}$/.test(digits) || (digits.length === 10 && !/^[6-9]/.test(digits)))
    errors.phone = "Enter a valid mobile number (10 digits, or with +91).";

  const email = v.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter a valid email address or leave it blank.";

  const message = v.message.trim();
  if (opts.messageRequired && message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  if (message.length > 2000) errors.message = "Message is too long (max 2000 characters).";

  return errors;
}
