const express = require("express");
const ticketController=require("../controllers/ticket.controller")
const authMiddleware = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/",authMiddleware,ticketController.createTicketController)
router.get("/my-tickets",authMiddleware,ticketController.getMyTicketsController)
router.get("/veiw-one-ticket/:id",authMiddleware,ticketController.getTicketByIdController)


module.exports = router;