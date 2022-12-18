export const DEV_PAYPAL_CHECKOUT = (id: string) =>
  'https://www.sandbox.paypal.com/checkoutnow?token=' + id;
export const PROD_PAYPAL_CHECKOUT = (id: string) =>
  'https://www.paypal.com/checkoutnow?token=' + id;
