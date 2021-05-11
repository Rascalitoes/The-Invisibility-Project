const User = {
    username : "your mongo atlas username",
    password : "your mongo atlas password"
}

const mailInfo = {
    email : "addressToSendFrom@email.com",
    password : "email password",
    host : "SMTP host",
    port : 587,
    adminEmail : "adminsEmailForVetting@email.com"
}

module.exports = {User,mailInfo};