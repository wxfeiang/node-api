const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBlogInput(data) {
  let errors = {};

  data.author = !isEmpty(data.author) ? data.author : "";

  if (Validator.isEmpty(data.author)) {
    errors.author = "文本不能为空!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
