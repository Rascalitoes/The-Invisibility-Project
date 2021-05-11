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
  })
  .catch(error => console.error(error));
}

methods.sendUserMail = async function (data,ID) {

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
    <b>Email:</b> ${data.user}</p>
    
    
    You can view all your submissions at http://localhost:3000/user?id=${ID}`, // html body
  })
  .catch(error => console.error(error));
}

methods.sendAllMail = function(data,ID){
  methods.sendAdminMail(data);
  methods.sendUserMail(data,ID);
}

exports.data = methods