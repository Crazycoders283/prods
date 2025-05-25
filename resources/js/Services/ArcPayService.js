import axios from 'axios';

const ARC_PAY_API_URL = 'https://api.arcpay.travel/api/rest/version/77/merchant/TESTARC05511704';
const ARC_PAY_MERCHANT_ID = 'TESTARC05511704';

class ArcPayService {
    constructor() {
        this.apiUrl = ARC_PAY_API_URL;
        this.merchantId = ARC_PAY_MERCHANT_ID;
    }

    async initializePayment(paymentData) {
        try {
            const response = await axios.post(`${this.apiUrl}/payment/initialize`, {
                merchantId: this.merchantId,
                amount: paymentData.amount,
                currency: paymentData.currency || 'USD',
                orderId: paymentData.orderId,
                customerEmail: paymentData.customerEmail,
                customerName: paymentData.customerName,
                paymentMethod: paymentData.paymentMethod,
                cardDetails: paymentData.cardDetails,
                billingAddress: paymentData.billingAddress,
                returnUrl: paymentData.returnUrl,
                cancelUrl: paymentData.cancelUrl
            });

            return response.data;
        } catch (error) {
            console.error('ARC Pay initialization error:', error);
            throw error;
        }
    }

    async processPayment(paymentId, paymentData) {
        try {
            const response = await axios.post(`${this.apiUrl}/payment/process`, {
                merchantId: this.merchantId,
                paymentId: paymentId,
                cardDetails: paymentData.cardDetails,
                amount: paymentData.amount,
                currency: paymentData.currency || 'USD'
            });

            return response.data;
        } catch (error) {
            console.error('ARC Pay processing error:', error);
            throw error;
        }
    }

    async verifyPayment(paymentId) {
        try {
            const response = await axios.get(`${this.apiUrl}/payment/verify/${paymentId}`, {
                params: {
                    merchantId: this.merchantId
                }
            });

            return response.data;
        } catch (error) {
            console.error('ARC Pay verification error:', error);
            throw error;
        }
    }

    async refundPayment(paymentId, amount) {
        try {
            const response = await axios.post(`${this.apiUrl}/payment/refund`, {
                merchantId: this.merchantId,
                paymentId: paymentId,
                amount: amount
            });

            return response.data;
        } catch (error) {
            console.error('ARC Pay refund error:', error);
            throw error;
        }
    }
}

export default new ArcPayService(); 