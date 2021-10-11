var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'h.ibrahimayub@gmail.com',
    pass: '00324ahmed'
  }
});

var mailOptions = {
  from: 'h.ibrahimayub@gmail.com',
  to: 'h.ibrahimayub@gmail.com',
  subject: 'testing',
  text: `testing suucess`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});