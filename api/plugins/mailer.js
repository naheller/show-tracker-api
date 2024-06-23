"use strict";

const fp = require("fastify-plugin");
const nodemailer = require("nodemailer");

module.exports = fp(
  async function (fastify, opts, done) {
    const { MAILER_USER, MAILER_PASS, MAILER_FROM, MAILER_TO } = fastify.env;

    const transporter = nodemailer.createTransport({
      service: "fastmail",
      secure: true,
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
      },
      logger: true,
      debug: true,
    });

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dateOptions = {
      timeStyle: "short",
      dateStyle: "short",
      timeZone: "America/New_York",
    };

    fastify.decorate("mailer", {
      sendAlert: async (shows) => {
        const mailBodyHtml = `
        ${shows
          .map((show) => {
            const date = new Date(show.datetime_utc);
            const formattedDate = new Date(show.datetime_utc).toLocaleString(
              "en-US",
              dateOptions
            );
            return `<p><span>${
              weekdays[date.getDay()]
            } ${formattedDate}</span> - <a href="${show.page_url_tm}">${
              show.name
            }</a></p>`;
          })
          .join("")}
        `;

        await transporter.sendMail({
          from: `"Show Tracker" <${MAILER_FROM}>`,
          to: MAILER_TO,
          subject: "Show Alert",
          text: mailBodyHtml,
          html: mailBodyHtml,
        });
      },
    });

    done();
  },
  {
    name: "plugin-mailer",
    dependencies: ["plugin-env"],
  }
);
