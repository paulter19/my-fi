const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(bodyParser.json());

// Create a Financial Connections Session
app.post('/financial-connections-sheet', async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      country: 'US',
      type: 'custom',
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true},
      },
    });

    const session = await stripe.financialConnections.sessions.create({
      account_holder: {
        type: 'account',
        account: account.id,
      },
      permissions: ['balances', 'ownership', 'payment_method', 'transactions'],
      filters: {
        countries: ['US'],
      },
    });

    res.json({
      clientSecret: session.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).send({ error: error.message });
  }
});

// Fetch Accounts from a Session
app.get('/accounts', async (req, res) => {
  const { session_id } = req.query;
  try {
    const session = await stripe.financialConnections.sessions.retrieve(session_id, {
      expand: ['accounts'],
    });
    res.json(session.accounts.data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send({ error: error.message });
  }
});

// Fetch Transactions for an Account
app.get('/transactions', async (req, res) => {
  const { account_id } = req.query;
  try {
    // Note: In a real app, you might need to refresh the session or use a different API depending on your integration
    // For Financial Connections, we typically list transactions via the API
    const transactions = await stripe.financialConnections.transactions.list({
      account: account_id,
      limit: 10,
    });
    res.json(transactions.data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
