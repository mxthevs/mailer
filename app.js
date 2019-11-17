require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Hello from mailer =)");
});

app.post("/send", async (req, res) => {
	let emailContent = `
        <h3>Remetente</h3>
        <p><b>De:</b> ${req.body.name}</p>
        <p><b>Email:</b> ${req.body.email}</p>
        <p><b>Assunto:</b> ${req.body.subject}</p>
        <p><b>Mensagem:</b> ${req.body.message}</p>
    `;

	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: `${process.env.USER_EMAIL}`,
			pass: `${process.env.USER_PASSWORD}`,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	let info = await transporter.sendMail({
		from: `"NodeMailer Contact" <${process.env.USER_EMAIL}>`,
		to: `${process.env.ADMIN_EMAIL}`,
		subject: `${req.body.subject}`,
		html: emailContent,
	});

	console.log("Email enviado: %s", info.messageId);

	res.redirect("back");
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server started at ${process.env.PORT || 3000}`);
});
