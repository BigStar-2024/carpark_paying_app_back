const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
// Use CORS middleware
app.use(cors());
// This is your test secret API key.
const stripe = require("stripe")("sk_test_51P2lpQC9Zd6I2Ms1GvOYwHZUIGfQFbny1XJBEdABFVaLlko3erp8Zk5brxb7dHQJj45Hl0kVb3ddFb56nRdEHfwK00XRDvuqaN");
app.use(express.static("public"));
app.use(express.json());

const userRouter = require('./routers/user');
const paymentlogRouter = require('./routers/paymentLog');

const { mongoURI } = require('./config/config');
app.use("/", userRouter);
app.use('/', paymentlogRouter);


// const paymentIntentss = await stripe.paymentIntents.list({
//   limit: 3,
// });
// console.log(paymentIntentss)

const calculateOrderAmount = (value) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return value;
};

const chargeCustomer = async (customerId) => {
  // Lookup the payment methods available for the customer
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  console.log(paymentMethods);
  try {
    // Charge the customer and payment method immediately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true,
    });
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log("Error code is: ", err.code);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
    console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
};

app.get("/", (req, res) => {
  res.send("Hello")
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // console.log(items[0].amount);
  // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
  // and attach the PaymentMethod to a new Customer
  const customer = await stripe.customers.create();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: "off_session",
    amount: calculateOrderAmount(items[0].amount * 100),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });



  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get('/payments_log', async (req, res) => {
  const paymentIntents_list = await stripe.paymentIntents.list({
    limit: 1,
  });
  // console.log(paymentIntents_list);
  // console.log(paymentIntents_list.data);
  res.send({data: paymentIntents_list.data});
  
})

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connected!")
}).catch(() => console.log("Connection Failed!"));

// Start the server
app.listen(4242, () => console.log("Node server listening on port 4242!"));