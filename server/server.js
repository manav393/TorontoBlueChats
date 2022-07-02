const express = require("express");
const cors = require("cors");
const { Op, Sequelize } = require("sequelize");
const { Course, Groupchat, Report, sequelize } = require("./models");
const { checkSchema } = require("express-validator");

const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");
const { validateRequest } = require("./middleware/requestValidation");
const {
  schema: groupchatSchema,
} = require("./validationSchemas/groupchatValidationSchema");
const {
  schema: reportSchema,
} = require("./validationSchemas/reportValidationSchema");
const ErrorHandler = require("./middleware/errorHandling");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/search/:code", async (req, res, next) => {
  const { code } = req.params;
  try {
    const returnedCourses = await Course.findAll({
      attributes: ["code", "id", "title"],
      limit: 5,
      where: {
        code: {
          [Op.substring]: code,
        },
      },
    });
    return res.send(returnedCourses);
  } catch (error) {
    next({ status: 500, message: "" });
  }
});

app.get("/api/courses/:code", async (req, res, next) => {
  const { code } = req.params;
  try {
    const course = await Course.findOne({
      include: Groupchat,
      where: {
        code,
      },
    });
    if (course) {
      return res.send(course);
    } else {
      throw new Error("Not Found");
    }
  } catch (error) {
    if (error.message === "Not Found") {
      next({ status: 404, message: "Book not found" });
    } else {
      next({ status: 400, message: "" });
    }
  }
});

app.post(
  "/api/groupchats/",
  checkSchema(groupchatSchema),
  validateRequest,
  async (req, res, next) => {
    try {
      const { type, link, lecture, courseId } = req.body;

      const groupchat = await Groupchat.create({
        type,
        link,
        lecture,
        courseId,
      });
      return res.send(groupchat);
    } catch (error) {
      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        next({ stats: 400, message: "Invalid courseId" });
      } else {
        next({ status: 500, message: "" });
      }
    }
  }
);

app.post(
  "/api/reports",
  checkSchema(reportSchema),
  validateRequest,
  async (req, res, next) => {
    const DELETE_THRESHOLD = 3;
    const { reason, groupchatId } = req.body;
    try {
      const report = await Report.create({ reason, groupchatId });
      const groupchats = await Groupchat.findAll({
        raw: true,
        attributes: [
          "id",
          [Sequelize.fn("COUNT", Sequelize.col("reports.id")), "reportCount"],
        ],
        include: [
          {
            model: Report,
            attributes: [],
          },
        ],
        group: ["Groupchat.id"],
      });
      let deleted = false;
      if (groupchats[0].reportCount >= DELETE_THRESHOLD) {
        const deletedGroupchat = await Groupchat.destroy({
          where: { id: groupchats[0].id },
        });
        deleted = true;
      }
      return res.send({ deleted, ...report });
    } catch (error) {
      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        next({ status: 400, message: "Invalid groupchatId" });
      } else {
        next({ status: 500, message: "" });
      }
    }
  }
);

app.use("/*", (req, res, next) => {
  next({ stats: 404, message: "Page not found." });
});

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`sever started on port ${PORT}`);
});
