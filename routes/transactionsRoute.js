const express = require("express")
const { upload } = require("../lib/uploader")
const db = require("../models")

const router = express.Router()

const { TransactionItem, Transaction, Ticket, User } = db

router.post(
  "/",
  upload({
    filePrefix: "PAY",
    acceptedFileTypes: ["jpeg", "jpg", "png"],
  }).single("payment_proof"),
  async (req, res) => {
    try {
      let { items } = req.body

      items = JSON.parse(items)

      const transactionItemIds = items.map((val) => val.ticket_id)
      // [1, 3]

      const findTickets = await Ticket.findAll({
        where: {
          id: transactionItemIds,
        },
      })

      let totalPrice = 0

      const transactionItems = findTickets.map((ticket) => {
        const qty = items.find((item) => item.ticket_id === ticket.id).quantity

        totalPrice += ticket.price * qty

        return {
          TicketId: ticket.id,
          price_per_pcs: ticket.price,
          quantity: qty,
          total_price: ticket.price * qty,
        }
      })

      const payment_proof_image_url = `http://localhost:2000/public/${req.file.filename}`

      const createTransaction = await Transaction.create({
        total_price: totalPrice,
        UserId: req.user.id,
        payment_proof_image_url,
      })

      await TransactionItem.bulkCreate(
        transactionItems.map((item) => {
          return {
            ...item,
            TransactionId: createTransaction.id,
          }
        })
      )

      return res.status(201).json({
        message: "Transaction created",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  }
)

router.patch("/status/:id", async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params

    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({
        message: "invalid status for transaction",
      })
    }

    const findUser = await User.findByPk(req.user.id);

    if (!findUser.is_admin) {
      return res.status(401).json({
        message: "User unauthorized"
      })
    }

    await Transaction.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      }
    )

    return res.status(200).json({
      message: `${status} transaction`,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

module.exports = router

