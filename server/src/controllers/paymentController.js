const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 249, 
      currency: 'usd',
      description: 'Melodies Subscription',
    });

    res.send({
      clientSecret: paymentIntent.client_secret, 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = { createPaymentIntent };
