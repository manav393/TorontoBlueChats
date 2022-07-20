const { checkSchema } = require("express-validator");
const { Course } = require("../models");

const schema = {
  type: {
    in: ["body"],
    isIn: {
      options: [
        ["WhatsApp", "Discord", "Telegram", "Slack", "Facebook Messenger"],
      ],
      errorMessage:
        "You must choose one of the following websites: WhatsApp, Discord, Instagram, WeChat or Facebook Messenger.",
    },
  },
  link: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Link cannot be left empty.",
    },
    isURL: {
      options: {
        protocols: ["https"],
        require_valid_protocol: true,
      },
      errorMessage: "Not a valid link.",
    },
  },
  lecture: {
    in: ["body"],
    custom: {
      options: async (value, { req }) => {
        const { courseId } = req.body;
        const course = await Course.findOne({
          attributes: ["lectures"],
          where: {
            id: courseId,
          },
        });
        if (course === null) {
          return Promise.reject("Not a valid Course Id");
        }
        if (!course.dataValues.lectures.includes(value)) {
          return Promise.reject("Not a valid lecture.");
        }
      },
    },
  },
  courseId: {
    notEmpty: {
      errorMessage: "Cannot leave courseId empty",
    },
    isInt: {
      errorMessage: "courseId must be an integer.",
    },
  },
};

module.exports = { schema };
