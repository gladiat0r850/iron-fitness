import express from 'express';
const cors = require('cors')
import dotenv from 'dotenv';
const stripe = require('stripe')('sk_test_51QIrLUE2Z2zILKrxvm201gzToc94bsm1AS5RPebdfHHgYrSPLJOD7OEGJQxOQUBvpZ6Qvb1A18qS1mjhV8tzrgt400vMTDH1QP')
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    features: ['Access to gym equipment', 'Locker room access', 'Free weights area'],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    features: ['All Basic features', 'Group fitness classes', 'Personal trainer (2 sessions/month)'],
    recommended: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 99,
    features: ['All Pro features', 'Unlimited personal training', 'Nutrition consultation', 'Spa access'],
    recommended: false,
  },
];

app.get("/api/plans", (_req, res) => {
  res.json(plans);
});

app.post("/checkout", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      console.log(req.body)
      return res.status(400).json({ error: "Plan ID is required" });
    }

    const plan = plans.find((p) => p.id === id);
    if(!plan){
      return res.status(401).json({error: 'Plan not found'})
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
            },
            unit_amount: Math.round(plan.price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `http://localhost:5173`,
      cancel_url: `http://localhost:5173`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});