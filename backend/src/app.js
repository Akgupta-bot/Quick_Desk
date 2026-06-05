const express=require("express")
const authrouter=require("./routes/auth.routes")
const categoryRouter=require("./routes/category.routes")
const ticketRouter=require("./routes/ticket.routes")
const cookie=require("cookie-parser")
const cors=require("cors")
const app=express()
app.use(express.json())
app.use(cookie())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }))

  app.use("/api/auth",authrouter)
  app.use("/api/category",categoryRouter)
  app.use("/api/ticket",ticketRouter)

  module.exports=app;

module.exports=app