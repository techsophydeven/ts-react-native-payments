import { initStripe } from '@stripe/stripe-react-native';
import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';

export type Razorpay = {
  description: string;
  order_id: string;
  prefil: {
    email: string;
    contact: string;
    name: string;
  };
};

export type Stripe = {
  publishableKey: string;
  urlScheme: string;
  merchantIdentifier: string;
};

export type Paypal = {
  key: string;
};

interface PaymentFunctions {
  paypal: Paypal;
  stripe: Stripe;
  razorpay: Razorpay;
}

const raozrpay = () => {
  var options: CheckoutOptions = {
    description: 'Credits towards consultation',
    image: 'https://i.imgur.com/3g7nmJC.png',
    currency: 'INR',
    key: '', // Your api key
    order_id: '',
    amount: 5000,
    name: 'foo',
    prefill: {
      email: 'void@razorpay.com',
      contact: '9191919191',
      name: 'Razorpay Software',
    },
    theme: { color: '#F37254' },
  };
  RazorpayCheckout.open(options);
};

const stripe = (
  publishable_key: string,
  urlScheme: string,
  merchantIdentifier: string
) => {
  initStripe({
    publishableKey: publishable_key,
    urlScheme: urlScheme,
    merchantIdentifier: merchantIdentifier,
  });
};

export function processPayment<T extends keyof PaymentFunctions>(
  amount: number,
  type: T,
  params: PaymentFunctions[typeof type]
): Promise<boolean> {
  return new Promise(async (_resolve, _reject) => {
    if (type === 'stripe') {
      const k = params as Stripe;
      stripe(k.publishableKey, k.urlScheme, k.merchantIdentifier);
    }
    raozrpay();
  });
}

const objectC: Stripe = {
  merchantIdentifier: '',
  publishableKey: '',
  urlScheme: ' ',
};

processPayment(0, 'stripe', objectC);
