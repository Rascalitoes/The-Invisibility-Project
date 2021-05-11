const nodemailer = require("nodemailer");
const { mailInfo } = require('./credentials.js');
var methods = {};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: mailInfo.host,
  port: mailInfo.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: mailInfo.email,
    pass: mailInfo.password,
  },
});


// async..await is not allowed in global scope, must use a wrapper
methods.sendAdminMail = async function (data) {

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"The Invisibility Project" <${mailInfo.email}>`, // sender address
    to: mailInfo.adminEmail, // list of receivers
    subject: "A new quote was just added", // Subject line
    text: 
    `Author: ${data.author}
    Quote: ${data.quote}
    Source: ${data.source}
    Date: ${data.date}
    Keywords: ${data.keywords}
    Email: ${data.user}`, // plain text body
    html: 
    `<p><b>Author:</b> ${data.author}<br>
    <b>Quote:</b> ${data.quote}<br>
    <b>Source:</b> ${data.source}<br>
    <b>Date:</b> ${data.date}<br>
    <b>Keywords:</b> ${data.keywords}<br>
    <b>Email:</b> ${data.user}</p>`, // html body
  });

  console.log("Admin message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

methods.sendUserMail = async function (data) {

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"The Invisibility Project" <${mailInfo.email}>`, // sender address
    to: "roscoebc@protonmail.com", // list of receivers
    subject: "Thanks for your submission!", // Subject line
    text: 
    `You've submitted a new quote to The Invisibility Project
    https://www.robertglick.com/projects/paradox/invisibility_project/index.php

    Your submission will be checked, and then you can view it on the website

    Your Submission:
    Author: ${data.author}
    Quote: ${data.quote}
    Source: ${data.source}
    Date: ${data.date}
    Keywords: ${data.keywords}
    Email: ${data.user}`, // plain text body
    html: 
    `<p>You've submitted a new quote to 
    <a href="https://www.robertglick.com/projects/paradox/invisibility_project/index.php" 
    target = "_blank">The Invisibility Project</a><br>
    </p>

    <p>Your submission will be checked, and then you can view it on the website<br></p>

    <p>Your Submission:<br>
    <b>Author:</b> ${data.author}<br>
    <b>Quote:</b> ${data.quote}<br>
    <b>Source:</b> ${data.source}<br>
    <b>Date:</b> ${data.date}<br>
    <b>Keywords:</b> ${data.keywords}<br>
    <b>Email:</b> ${data.user}</p>`, // html body
  });

  console.log("User message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

methods.sendAllMail = function(data){
  methods.sendAdminMail(data);
  methods.sendUserMail(data);
}

exports.data = methods