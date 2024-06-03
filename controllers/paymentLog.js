const paymentLogModel = require('../models/paymentLog');
const paymentLog = async (req, res) => {

    const { status, parkName, licensePlateNumber, amount, receiptEmail, createDate } = req.body;

    // Check if a document with the same set of fields already exists
    const existingPaymentLog = await paymentLogModel.findOne({
        status,
        parkName,
        licensePlateNumber,
        amount,
        receiptEmail,
        createDate
    });

    if (existingPaymentLog) {
        // Document already exists, handle accordingly (e.g., return a response)
        console.log("Payment log already exists");
        return res.status(409).json({ message: "Payment log already exists" });
    }

    const newPaymentLog = new paymentLogModel({
        status: status,
        parkName: parkName,
        licensePlateNumber: licensePlateNumber,
        amount: amount,
        receiptEmail: receiptEmail,
        createDate: createDate,
    })
    await newPaymentLog.save()
        .then(() => {
            console.log("Save Success!");
            res.status(200).json("Successfully Saved!");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json("Save failed");
        });
}

module.exports = paymentLog;