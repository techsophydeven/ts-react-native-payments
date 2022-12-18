import {
  initStripe,
  InitStripeParams,
  // initStripe,
  // InitStripeParams,
  useStripe,
} from '@stripe/stripe-react-native';
import { useEffect } from 'react';
// import { useEffect } from 'react';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';
import { DEV_PAYPAL_CHECKOUT, PROD_PAYPAL_CHECKOUT } from './util/contants';

export type Razorpay = {
  description: string;
  order_id: string;
  prefil: {
    email: string;
    contact: string;
    name: string;
  };
  theme: string;
  image: string;
  currency: 'INR' | 'USD';
  name: string;
};

export type Stripe = {
  merchantDisplayName: string;
  customerId: string;
  paymentIntentClientSecret: string;
  customerEphemeralKeySecret: string;
};

export type Paypal = {
  key: string;
};

const razorpay = async (amount: number, key: string, params: Razorpay) => {
  var options: CheckoutOptions = {
    description: params.description,
    image: params.image,
    currency: params.currency,
    key: key,
    order_id: params.order_id,
    amount: amount,
    name: params.name,
    prefill: params.prefil,
    theme: { color: params.theme },
  };
  await RazorpayCheckout.open(options);
};

const paypal = (test: boolean, orderId: string) => {
  return new Promise((resolve, reject) => {
    const subs = Linking.addEventListener('url', async (response) => {
      console.log('linking event', response.url);
      try {
        if (response.url.includes('success')) {
          resolve(response.url);
        } else {
          reject(response.url);
        }
      } catch (error) {
        reject(error);
      } finally {
        if (subs) subs.subscriber.removeAllSubscriptions();
      }
    });

    InAppBrowser.open(
      test ? DEV_PAYPAL_CHECKOUT(orderId) : PROD_PAYPAL_CHECKOUT(orderId)
    )
      .then(() => {})
      .catch(() => {
        reject('cancelled');
      });
  });
};

export const useStripePayment = (init: InitStripeParams) => {
  useEffect(() => {
    if (init.publishableKey) initStripe(init);
  }, [init]);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  return {
    processPayment: (params: Stripe) => {
      return new Promise(async (resolve, reject) => {
        const { error } = await initPaymentSheet(params);
        if (error) {
          reject(error);
        }
        const { error: sheetError, paymentOption } =
          await presentPaymentSheet();
        if (sheetError) {
          reject(sheetError);
        }
        resolve(paymentOption?.label);
      });
    },
  };
};

export const useRazorpayPayment = (key: string) => {
  return {
    processPayment: (amount: number, params: Razorpay) =>
      razorpay(amount, key, params),
  };
};

export const usePaypalPayment = (test: boolean) => {
  return {
    processPayment: (orderId: string) => paypal(test, orderId),
  };
};
