const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Home route - show all tasks for the user
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("index", {
      tasks,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Error loading tasks");
  }
});

// Create new task
router.post("/tasks", ensureAuthenticated, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = new Task({
      title,
      description,
      user: req.user._id,
    });

    await newTask.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Error creating task");
  }
});

// Edit task form
router.get("/tasks/:id/edit", ensureAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.render("edit", { task });
  } catch (error) {
    console.error("Error fetching task for edit:", error);
    res.status(500).send("Error loading task");
  }
});

// Update task
router.post("/tasks/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { title, description } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        title,
        description,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Error updating task");
  }
});

// View task details
router.get("/readmore/:id", ensureAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.render("readmore", { task });
  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).send("Error loading task details");
  }
});

// Delete confirmation
router.get("/tasks/:id/delete", ensureAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.render("delete", { task });
  } catch (error) {
    console.error("Error fetching task for deletion:", error);
    res.status(500).send("Error loading task");
  }
});

// Delete task
router.post("/tasks/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).send("Task not found");
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Error deleting task");
  }
});

module.exports = router;
// // ==================== taskRoutes.js ====================
// const express = require("express");
// const router = express.Router();
// const Task = require("../models/Task");

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("/login");
// }

// // Home route
// router.get("/", ensureAuthenticated, async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user._id }).sort({
//       createdAt: -1,
//     });
//     res.render("index", {
//       tasks,
//       user: req.user,
//       success_msg: req.flash("success_msg"),
//       error_msg: req.flash("error_msg"),
//     });
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res.status(500).send("Error loading tasks");
//   }
// });

// // Create task
// router.post("/tasks", ensureAuthenticated, async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const task = new Task({ title, description, user: req.user._id });
//     await task.save();
//     req.flash("success_msg", "Task added successfully");
//     res.redirect("/");
//   } catch (error) {
//     console.error("Error creating task:", error);
//     req.flash("error_msg", "Error creating task");
//     res.redirect("/");
//   }
// });

// // Edit task form
// router.get("/tasks/:id/edit", ensureAuthenticated, async (req, res) => {
//   try {
//     const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
//     if (!task) return res.status(404).send("Task not found");
//     res.render("edit", { task });
//   } catch (error) {
//     console.error("Error editing task:", error);
//     res.status(500).send("Error loading task");
//   }
// });

// // Update task
// router.post("/tasks/:id", ensureAuthenticated, async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const updated = await Task.findOneAndUpdate(
//       { _id: req.params.id, user: req.user._id },
//       { title, description, updatedAt: Date.now() },
//       { new: true }
//     );
//     if (!updated) return res.status(404).send("Task not found");
//     req.flash("success_msg", "Task updated successfully");
//     res.redirect("/");
//   } catch (error) {
//     console.error("Error updating task:", error);
//     req.flash("error_msg", "Failed to update task");
//     res.redirect("/");
//   }
// });

// // View task details
// router.get("/readmore/:id", ensureAuthenticated, async (req, res) => {
//   try {
//     const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
//     if (!task) return res.status(404).send("Task not found");
//     res.render("readmore", { task });
//   } catch (error) {
//     console.error("Error fetching task details:", error);
//     res.status(500).send("Error loading task details");
//   }
// });

// // Delete confirmation
// router.get("/tasks/:id/delete", ensureAuthenticated, async (req, res) => {
//   try {
//     const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
//     if (!task) return res.status(404).send("Task not found");
//     res.render("delete", { task });
//   } catch (error) {
//     console.error("Error preparing task for deletion:", error);
//     res.status(500).send("Error loading task");
//   }
// });

// // Delete task
// router.post("/tasks/delete/:id", ensureAuthenticated, async (req, res) => {
//   try {
//     const deleted = await Task.findOneAndDelete({
//       _id: req.params.id,
//       user: req.user._id,
//     });
//     if (!deleted) return res.status(404).send("Task not found");
//     req.flash("success_msg", "Task deleted successfully");
//     res.redirect("/");
//   } catch (error) {
//     console.error("Error deleting task:", error);
//     req.flash("error_msg", "Failed to delete task");
//     res.redirect("/");
//   }
// });

// module.exports = router;
