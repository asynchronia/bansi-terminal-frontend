import { PAYMENT_TERM_ENUM } from "./constants";

export default function getPaymentTerm(paymentTerms) {
    switch (paymentTerms) {
      case PAYMENT_TERM_ENUM.ADVANCE:
        return "Advance";
      case PAYMENT_TERM_ENUM["50% ADVANCE"]:
        return "50% Advance";
      case PAYMENT_TERM_ENUM[15]:
        return "15 days";
      case PAYMENT_TERM_ENUM[30]:
        return "30 days";
      case PAYMENT_TERM_ENUM[45]:
        return "45 days";
      default:
        return "0 days";
    }
  }
  