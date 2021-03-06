const nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");
const nodemailerhbs = require("nodemailer-express-handlebars");

const { resolve } = require("path");

const mailConfig = require("../config/Mail");

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: auth || null
    });
    this.configTamplate();
  }
  configTamplate() {
    const viewPath = resolve(__dirname, "..", "app", "views", "emails");

    this.transporter.use(
      "compile",
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, "layouts"),
          partialsDir: resolve(viewPath, "partials"),
          defaultLayout: "default",
          extname: ".hbs", //'handlebars' pode ser
        }),
        viewPath,
        extName: ".hbs",
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

module.exports = new Mail();
