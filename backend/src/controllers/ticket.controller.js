const Ticket = require(
  "../models/ticket.model"
);

const Category = require(
  "../models/category.model"
);

async function createTicketController(
  req,
  res
) {
  try {

    const {
      subject,
      description,
      category,
      priority,
    } = req.body;

    if (
      !subject ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided",
      });
    }

    const categoryExists =
      await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    const ticket =
      await Ticket.create({
        subject,
        description,
        category,
        priority,
        createdBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Ticket created successfully",
      ticket,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}

async function getMyTicketsController(
  req,
  res
) {

  const tickets =
    await Ticket.find({
      createdBy: req.user._id,
    })
      .populate(
        "category",
        "name"
      )
      .sort({
        createdAt: -1,
      });

  res.status(200).json({
    success: true,
    count: tickets.length,
    tickets,
  });
}

async function getTicketByIdController(
  req,
  res
) {

  const ticket =
    await Ticket.findById(
      req.params.id
    )
      .populate(
        "category",
        "name"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "assignedTo",
        "name email"
      );

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message:
        "Ticket not found",
    });
  }

  res.status(200).json({
    success: true,
    ticket,
  });
}

module.exports = {
  createTicketController,
  getMyTicketsController,
  getTicketByIdController,


};