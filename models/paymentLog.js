const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const paymentLogSchema = new Schema(
    {
        status: {
            type: String,
            required: true,
        },
        parkName: {
            type: String,
            required: true,
        },
        licensePlateNumber: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        receiptEmail: {
            type: String,
            required: true,
        },
        createDate: {
            type: String,
            required: true,
        },
    }
)

module.exports = mongoose.model("PaymentLog", paymentLogSchema)