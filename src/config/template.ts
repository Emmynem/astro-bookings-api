import { year_str } from "./config";

const top_logo = "https://res.cloudinary.com/dabfoaprr/image/upload/v1741103517/nasa_xmju3d.png";

const copyright_year = year_str();

export const booking_confirmation = (data: any) => {
	const email_subject = `Confirmation of Your Booking with ${data.astronaut}`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Booking Confirmation</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
			<style>
				* {
					margin-block-start: 0;
					margin-block-end: 0;
					box-sizing: border-box;
				}
				body, p {
					font-family: "Manrope", Arial, sans-serif;
					font-optical-sizing: auto;
					font-weight: 400;
					margin: 0;
					padding: 0;
				}
				p {
					opacity: 0.8;
					margin: 20px 0;
					line-height: 2rem;
					width: 88%;
					font-size: 15.2px;
				}
				.button {
					background-color: #B91D47;
					display: block;
					width: 100%;
					padding: 16px;
					border-radius: 8px;
					text-align: center;
					font-size: 14.8px;
					font-weight: 700;
					text-decoration: none;
					color: #FFFFFF;
				}
			</style>
		</head>
		<body style="background-color: #E5E5E5;">
			<div style="padding: 20px 0;">
				<div style="max-width: 600px; margin: 20px auto; text-align: center;">
					<img src="${top_logo}" alt="NASA Space Communications logo" style="max-width: 100px; width: 100%;">
				</div>
				<div style="max-width: 600px; margin: 20px auto; margin-top: -8px; padding: 20px; background-color: #FFFFFF; color: #000; border: 1px solid #D7D7D7;">
					<div id="content">
						<p>Dear ${data.fullname},</p>
						<p>Thank you for booking your session with ${data.astronaut}. We are pleased to confirm your successful reservation.</p>
						<p style="font-weight: bold;">Booking Details:</p>
						<p><span style="font-weight: bold;">Astronaut: </span> ${data.astronaut}</p>
						<p><span style="font-weight: bold;">Fee: </span> $${data.total_amount}</p>
						<p>A follow-up email with further details, including session guidelines and next steps, will be sent to you soon.</p>
						<p>If you have any questions in the meantime, feel free to reach out to us at <a
								href="mailto:info@nasaspacecommunications.com" style="color: #223B6D;">info@nasaspacecommunications.com</a>.</p>
						
						<p>Best regards,<br><strong>NASA Space Communications</strong><br><a href="mailto:info@nasaspacecommunications.com"
								style="color: #223B6D;">info@nasaspacecommunications.com</a><br><a href="https://nasaspacecommunications.com"
								target="_blank" style="color: #223B6D;">nasaspacecommunications.com</a></p>
					</div>
				</div>
				<div style="max-width: 600px; margin: 16px auto; margin-top: 32px; text-align: center;">
					<p style="font-size: 14px; opacity: .8; margin: 16px auto;">Copyright &copy; ${copyright_year}, NASA Space Communications, All rights
					reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Booking Confirmation</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
			<style>
				* {
					margin-block-start: 0;
					margin-block-end: 0;
					box-sizing: border-box;
				}
				body, p {
					font-family: "Manrope", Arial, sans-serif;
					font-optical-sizing: auto;
					font-weight: 400;
					margin: 0;
					padding: 0;
				}
				p {
					opacity: 0.8;
					margin: 20px 0;
					line-height: 2rem;
					width: 88%;
					font-size: 15.2px;
				}
				.button {
					background-color: #B91D47;
					display: block;
					width: 100%;
					padding: 16px;
					border-radius: 8px;
					text-align: center;
					font-size: 14.8px;
					font-weight: 700;
					text-decoration: none;
					color: #FFFFFF;
				}
			</style>
		</head>
		<body style="background-color: #E5E5E5;">
			<div style="padding: 20px 0;">
				<div style="max-width: 600px; margin: 20px auto; text-align: center;">
					<img src="${top_logo}" alt="NASA Space Communications logo" style="max-width: 100px; width: 100%;">
				</div>
				<div style="max-width: 600px; margin: 20px auto; margin-top: -8px; padding: 20px; background-color: #FFFFFF; color: #000; border: 1px solid #D7D7D7;">
					<div id="content">
						<p>Dear ${data.fullname},</p>
						<p>Thank you for booking your session with ${data.astronaut}. We are pleased to confirm your successful reservation.</p>
						<p style="font-weight: bold;">Booking Details:</p>
						<p><span style="font-weight: bold;">Astronaut: </span> ${data.astronaut}</p>
						<p><span style="font-weight: bold;">Fee: </span> $${data.total_amount}</p>
						<p>A follow-up email with further details, including session guidelines and next steps, will be sent to you soon.</p>
						<p>If you have any questions in the meantime, feel free to reach out to us at <a
								href="mailto:info@nasaspacecommunications.com" style="color: #223B6D;">info@nasaspacecommunications.com</a>.</p>
						
						<p>Best regards,<br><strong>NASA Space Communications</strong><br><a href="mailto:info@nasaspacecommunications.com"
								style="color: #223B6D;">info@nasaspacecommunications.com</a><br><a href="https://nasaspacecommunications.com"
								target="_blank" style="color: #223B6D;">nasaspacecommunications.com</a></p>
					</div>
				</div>
				<div style="max-width: 600px; margin: 16px auto; margin-top: 32px; text-align: center;">
					<p style="font-size: 14px; opacity: .8; margin: 16px auto;">Copyright &copy; ${copyright_year}, NASA Space Communications, All rights
					reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return { email_html, email_subject, email_text };
};