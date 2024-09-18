"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async login(ctx) {
    try {
      const { username, password } = ctx.request.body;

      if (!username || !password) {
        return ctx.badRequest("Username and password are required");
      }

      const user = await strapi.db
        .query("api::logged-user.logged-user")
        .findOne({
          where: { username },
        });

      if (!user) {
        return ctx.badRequest("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return ctx.badRequest("Invalid credentials");
      }

      const sanitizedUser = {
        id: user.id,
        username: user.username,
        password: user.password,
        // name: user.name,
        // surname: user.surname,
        // gender: user.gender,
        // birthOfDate: user.birthOfDate,
      };

      ctx.send({
        user: sanitizedUser,
        message: "Login successful",
      });
    } catch (error) {
      ctx.throw(500, `An error occurred: ${error.message}`);
    }
  },
};
