const express = require('express');
const path = require('path');
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const crypto = require('crypto');
const Fingerprint = require('express-fingerprint');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const fs = require('fs');




dotenv.config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['https://elitere.ooguy.com'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI,
{
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const refundSchema = new mongoose.Schema(
{
	userId:
	{
		type: String,
		required: true,
		unique: true
	},
	lastRefundTime:
	{
		type: Date,
		required: true,
		expires: 604800
	}
});

const Refund = mongoose.model('Refund', refundSchema);

const feedbackSchema = new mongoose.Schema(
{
	userId:
	{
		type: String,
		required: true,
		unique: true
	},
	lastFeedbackTime:
	{
		type: Date,
		required: true,
		expires: 604800
	}
});

const reportSchema = new mongoose.Schema(
{
	userId:
	{
		type: String,
		required: true,
		unique: true
	},
	lastReportTime:
	{
		type: Date,
		required: true,
		expires: 604800
	}
});

const orderSchema = new mongoose.Schema(
{
	userId:
	{
		type: String,
		required: true,
		unique: true
	},
	lastOrderTime:
	{
		type: Date,
		required: true,
		expires: 600
	}
});

const Order = mongoose.model('Order', orderSchema);

const Report = mongoose.model('Report', reportSchema);

const Feedback = mongoose.model('Feedback', feedbackSchema);

const bannedLogCache = {};

const generateUserId = (req) => {
    if (req.cookies.userId) {
        return req.cookies.userId; 
    }

    const fingerprint = JSON.stringify(req.fingerprint.components);
    
    const userId = crypto.createHash('sha256')
        .update(fingerprint) 
        .digest('hex');

    req.res.cookie('userId', userId, { maxAge: 31556952000, httpOnly: true }); 
    return userId;
};


const fingerprintMiddleware = Fingerprint({
    parameters: [
        Fingerprint.useragent,
        Fingerprint.acceptHeaders,
        Fingerprint.geoip,
        Fingerprint.device,
        Fingerprint.screenResolution
    ]
});

module.exports = { generateUserId, fingerprintMiddleware };

const checkIfBanned = async (userId) =>
{
	const bannedUsers = process.env.BANNED_USERS ? process.env.BANNED_USERS.split('/') : [];
	console.log('Banned Users List:', bannedUsers);
	console.log('Checking User ID:', userId);

	if(bannedUsers.includes(userId))
	{
		const currentTime = Date.now();
		const lastLogTime = bannedLogCache[userId] || 0;

		if(currentTime - lastLogTime > 60 * 60 * 1000)
		{
			bannedLogCache[userId] = currentTime;

			const bannedWebhook = process.env.BANNED_WEBHOOK;
			try
			{
				await axios.post(bannedWebhook,
				{
					content: `Banned user tried to submit a request: User ID - ${userId}`
				});
				console.log('Banned user logged to webhook:', userId);
			}
			catch (error)
			{

			}
		}

		return true;
	}

	return false;
};

const generateNonce = () => crypto.randomBytes(16).toString('base64');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS  
    }
});

app.use((req, res, next) =>
{
	res.locals.nonce = generateNonce();
	next();
});

app.use(bodyParser.json());
app.post('/api/orders', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        location,
        streetName,
        city,
        phone1,
        phone2,
        cartItems,
        totalPrice,
        paymentMethod
    } = req.body;
    const webhookURL = process.env.WEBHOOK_URL1;
    const userId = generateUserId(req);
    const tenMinutes = 10 * 60 * 1000;

    if (!firstName || !lastName || !email || !location || !streetName || !city || !phone1) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }

    const orderId = `ORD-${Date.now()}`;

    const isBanned = await checkIfBanned(userId);
    if (isBanned) {
        return res.status(401).json({
            code: 'USER_BANNED',
            message: 'You are banned. Please contact support to know the reason. Contact support on this email : eliterebrand@gmail.com',
        });
    }

    const orderRecord = await Order.findOne({ userId });
    const now = new Date();

    if (orderRecord) {
        const lastOrderTime = new Date(orderRecord.lastOrderTime);
        if (now - lastOrderTime < tenMinutes) {
            return res.status(429).json({
                message: 'You are on cooldown, please try again later.'
            });
        }
    }

    const embed = {
        content: `<@&1350538323772571688>`,
        embeds: [{
            title: "🛒 New Order Received",
            color: 0x1abc9c,
            fields: [
                { name: "👤 First Name", value: firstName, inline: true },
                { name: "👤 Last Name", value: lastName, inline: true },
                { name: "📧 Email", value: email, inline: true },
                { name: "📍 Location", value: location, inline: true },
                { name: "🏠 Street Name", value: streetName, inline: true },
                { name: "🏙️ City", value: city, inline: true },
                { name: "📞 Phone Number 1", value: phone1, inline: true },
                { name: "📞 Phone Number 2", value: phone2 || "N/A", inline: true },
                {
                    name: "🛍️ Cart Items",
                    value: cartItems.map(item => `**${item.name}** - ${item.quantity} x ${item.price}`).join("\n"),
                    inline: false
                },
                { name: "💳 Payment Method", value: paymentMethod === 'instapay' ? "Instapay Payment" : "Wallet Payment", inline: true },
                { name: "💰 Total Price", value: `${totalPrice}`, inline: true },
                { name: "🆔 Order ID", value: orderId, inline: true },
                { name: "👤 User ID", value: userId || "Unknown User ID", inline: true }
            ]
        }]
    };

    try {
        const response = await axios.post(webhookURL, embed);

        if (response.status === 204) {
            await Order.findOneAndUpdate(
                { userId },
                { lastOrderTime: now },
                { upsert: true, new: true }
            );

            const mailOptions = {
                from: `"Elitère Store" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'Order Confirmation ',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; background: black !important; background: linear-gradient(135deg, #ffffff, #f8f9fa); box-shadow: 0px 4px 15px rgba(0,0,0,0.1); color: #222 !important;">
                        
						<div style="text-align: center;">
							<img src="https://elitere.ooguy.com/logo.png" alt="Company Logo" style="max-width: 180px; margin-bottom: 15px;">
							<h2 style="color: #333 !important; font-size: 22px; font-weight: bold;">Order Confirmation</h2>
						</div>
            
                        <p style="color: #ddd !important; font-size: 16px; text-align: center;">
                            Thank you for your order, <strong style="color: #fff !important;">${firstName} ${lastName}</strong>! <br> Your order has been successfully placed. 
                            <br><br>
                            <strong>If you already submitted this order, just ignore this message.</strong> This email was sent to confirm your purchase, but if you did not place this order, it might have been a mistake.
                        </p>
            
                        <div style="background: #222; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1); margin-top: 15px;">
                            <p style="font-size: 18px; font-weight: bold; color: #fff !important;">🛍️ Order Summary</p>
                            <p style="color: #ddd !important;"><strong>Order ID:</strong> ${orderId}</p>
                            <p style="color: #ddd !important;"><strong>📍 Location:</strong> ${location}, ${city}, ${streetName}</p>
                            <p style="color: #ddd !important;"><strong>📞 Phone:</strong> ${phone1} ${phone2 ? ` / ${phone2}` : ""}</p>
                            <p style="color: #ddd !important;"><strong>💰 Total Price:</strong> ${totalPrice.replace(/[^\d.]/g, '') || ''} EGP</p>
                            <p style="color: #ddd !important;"><strong>💳 Payment Method:</strong> ${paymentMethod === 'instapay' ? 'Instapay' : ' Mobile Wallet Payment'}</p>
                        </div>
            
                        <div style="margin-top: 20px; background: #222; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1);">
                            <p style="font-size: 18px; font-weight: bold; color: #fff !important;">🛒 Your Items</p>
                            ${cartItems.map(item => `
                                <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #444;">
                                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 8px; margin-right: 15px;">
                                    <div>
                                        <p style="margin: 0; font-weight: bold; color: #fff !important;">${item.name}</p>
                                        <p style="margin: 0; color: #bbb !important;">Quantity: ${item.quantity} | Price: ${item.price} x1</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
            
                        <p style="color: #aaa !important; font-size: 14px; text-align: center; margin-top: 20px;">We will contact you shortly to confirm your order.</p>
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://elitere.ooguy.com" style="background: #007bff; color: #fff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; display: inline-block; font-weight: bold;">
                                🔗 Visit Elitère Store
                            </a>
                        </div>
                        <p style="text-align: center; font-size: 12px; color: #888 !important; margin-top: 20px;">
                            © 2025 Elitère Store. All rights reserved.
                        </p>
                    </div>
                `
            };
            
			
            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                message: 'ORDER HAS BEEN RECEIVED',
                orderId: orderId
            });
        } else {
            console.error('Failed to submit request:', response.statusText);
            return res.status(500).json({
                message: 'Failed to submit request.'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Error submitting request.'
        });
    }
});


app.post('/api/reports', async (req, res) => {
    const { firstName, lastName, email, phone1, phone2, description } = req.body;
    const webhookURL = process.env.WEBHOOK_URL2;
    const userId = generateUserId(req);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (!firstName || !lastName || !email || !phone1 || !description) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }

    const isBanned = await checkIfBanned(userId);
    if (isBanned) {
        return res.status(401).json({
            code: 'USER_BANNED',
            message: 'You are banned. Please contact support to know the reason. Contact support on this email : eliterebrand@gmail.com',
        });
    }

    const reportRecord = await Report.findOne({ userId });
    const now = new Date();

    if (reportRecord) {
        const lastReportTime = new Date(reportRecord.lastReportTime);
        if (now - lastReportTime < oneWeek) {
            return res.status(429).json({
                message: 'You are on cooldown, please try again later.'
            });
        }
    }

    const embed = {
        content: `<@&1350538323772571688>`,
        embeds: [
            {
                title: "📩 New Report Received",
                color: 0x1abc9c,
                fields: [
                    { name: "👤 First Name", value: firstName, inline: true },
                    { name: "👤 Last Name", value: lastName, inline: true },
                    { name: "📧 Email", value: email, inline: true },
                    { name: "📞 Phone Number 1", value: phone1, inline: true },
                    { name: "📞 Phone Number 2", value: phone2 || "N/A", inline: true },
                    { name: "📩 Report Description", value: description, inline: false },
                    { name: "👤 User ID", value: userId || "Unknown User ID", inline: true }
                ]
            }
        ]
    };

    try {
        const response = await axios.post(webhookURL, embed);

        if (response.status === 204) {
            await Report.findOneAndUpdate(
                { userId },
                { lastReportTime: now },
                { upsert: true, new: true }
            );


            const mailOptions = {
                from: `"Elitère Store" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'Report Confirmation',
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; background: #000 !important; color: #fff !important; box-shadow: 0px 4px 15px rgba(0,0,0,0.1);">
                    
						<div style="text-align: center;">
							<img src="https://elitere.ooguy.com/logo.png" alt="Company Logo" style="max-width: 180px; margin-bottom: 15px;">
							<h2 style="color: #333 !important; font-size: 22px; font-weight: bold;">Order Confirmation</h2>
						</div>
            
                    <p style="color: #ddd !important; font-size: 16px; text-align: center;">
                        Hello <strong style="color: #fff !important;">${firstName}</strong>, <br>
                        We have received your report and will respond to you as soon as possible.
                    </p>
            
                    <div style="background: #222; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1); margin-top: 15px;">
                        <p style="font-size: 18px; font-weight: bold; color: #fff !important;">📩 Report Details</p>
                        <p style="color: #ccc !important;"><strong>👤 Name:</strong> ${firstName} ${lastName}</p>
                        <p style="color: #ccc !important;"><strong>📞 Phone:</strong> ${phone1} ${phone2 ? ` / ${phone2}` : ""}</p>
                        <p style="color: #ccc !important;"><strong>📩 Report:</strong> ${description}</p>
                    </div>
            
                    <p style="color: #bbb !important; font-size: 14px; text-align: center; margin-top: 20px;">
                        We will contact you shortly regarding your report. Thank you for your patience.
                    </p>
            
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://elitere.ooguy.com" style="background: #007bff; color: #fff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; display: inline-block; font-weight: bold;">
                            🔗 Visit Elitère Store
                        </a>
                    </div>
                    
                    <p style="text-align: center; font-size: 12px; color: #888 !important; margin-top: 20px;">
                        © 2025 Elitère Support. All rights reserved.
                    </p>
                </div>
                `
            };
            
            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                message: 'REPORT HAS BEEN RECEIVED'
            });
        } else {
            console.error('Failed to submit request:', response.statusText);
            return res.status(500).json({
                message: 'Failed to submit request.'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Error submitting request.'
        });
    }
});

	
app.post('/api/feedback', async (req, res) =>
{
	const
	{
		fdescription
	} = req.body;
	const userId = generateUserId(req);
	const webhookURL = process.env.WEBHOOK_URL3;
	const oneWeek = 7 * 24 * 60 * 60 * 1000; 

	if(!fdescription)
	{
		return res.status(400).json(
		{
			message: 'All fields are required.'
		});
	}

	const isBanned = await checkIfBanned(userId);
	if(isBanned)
	{
		return res.status(401).json(
		{
			code: 'USER_BANNED',
			message: 'You are banned. Please contact support to know the reason. Contact support on this email : eliterebrand@gmail.com',
		});
	}

	const feedbackRecord = await Feedback.findOne(
	{
		userId
	});
	const now = new Date();

	if(feedbackRecord)
	{
		const lastFeedbackTime = new Date(feedbackRecord.lastFeedbackTime);
		if(now - lastFeedbackTime < oneWeek)
		{
			return res.status(429).json(
			{
				message: 'You are on cooldown, please try again later.'
			});
		}
	}

	const embed = {
		content: `<@&1350538323772571688>`,
		embeds: [
		{
			title: "📩 New Feedback Received",
			color: 0x1abc9c,
			fields: [
			{
				name: "📩 Feedback Description",
				value: fdescription,
				inline: true
			},
			{
				name: "👤 User ID",
				value: userId || "Unknown User ID",
				inline: true
			}]
		}]
	};

	try
	{
		const response = await axios.post(webhookURL, embed);

		if(response.status === 204)
		{

			await Feedback.findOneAndUpdate(
			{
				userId
			},
			{
				lastFeedbackTime: now
			},
			{
				upsert: true,
				new: true
			});

			return res.status(200).json(
			{
				message: 'FEEDBACK HAS BEEN RECEIVED'
			});
		}
		else
		{
			console.error('Failed to submit request:', response.statusText);
			return res.status(500).json(
			{
				message: 'Failed to submit request.'
			});
		}
	}
	catch (error)
	{
		console.error('Error:', error);
		return res.status(500).json(
		{
			message: 'Error submitting request.'
		});
	}
});

app.post('/api/refunds', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone1,
        phone2,
        date,
        orderID,
        item,
        reason
    } = req.body;

    const userId = generateUserId(req);
    const oneWeek = 7 * 24 * 60 * 60 * 1000; 
    const webhookURL = process.env.WEBHOOK_URL4;

    if (!firstName || !lastName || !email || !phone1 || !date || !orderID || !item || !reason) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const isBanned = await checkIfBanned(userId);
    if (isBanned) {
        return res.status(401).json({
            code: 'USER_BANNED',
            message: 'You are banned. Please contact support to know the reason. Contact support on this email : eliterebrand@gmail.com',
        });
    }

    const refundRecord = await Refund.findOne({ userId });
    const now = new Date();

    if (refundRecord) {
        const lastRefundTime = new Date(refundRecord.lastRefundTime);
        if (now - lastRefundTime < oneWeek) {
            return res.status(429).json({ message: 'You are on cooldown, please try again later.' });
        }
    }

    const embed = {
        content: `<@&1350538323772571688>`,
        embeds: [{
            title: "📩 New Refund Request",
            color: 0xf1c40f,
            fields: [
                { name: "📝 First Name", value: firstName, inline: true },
                { name: "📝 Last Name", value: lastName, inline: true },
                { name: "📧 Email", value: email, inline: true },
                { name: "📞 Phone 1", value: phone1, inline: true },
                { name: "📞 Phone 2", value: phone2 || "N/A", inline: true },
                { name: "📅 Date", value: date || "N/A", inline: true },
                { name: "🆔 Order ID", value: orderID || "N/A", inline: true },
                { name: "📦 Item", value: item, inline: true },
                { name: "❓ Reason", value: reason, inline: false },
                { name: "👤 User ID", value: userId || "Unknown User ID", inline: true }
            ]
        }]
    };

    try {
        const response = await axios.post(webhookURL, embed);

        if (response.status === 204) {
            await Refund.findOneAndUpdate(
                { userId },
                { lastRefundTime: now },
                { upsert: true, new: true }
            );

            // **Send Confirmation Email**
            const mailOptions = {
                from: `"Elitère Store" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'Refund Request',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; background: #000 !important; box-shadow: 0px 4px 15px rgba(0,0,0,0.1); color: #fff !important;">
                        
						<div style="text-align: center;">
							<img src="https://elitere.ooguy.com/logo.png" alt="Company Logo" style="max-width: 180px; margin-bottom: 15px;">
							<h2 style="color: #333 !important; font-size: 22px; font-weight: bold;">Order Confirmation</h2>
						</div>
            
                        <p style="color: #ddd !important; font-size: 16px; text-align: center;">
                            Hello <strong style="color: #fff !important;">${firstName}</strong>, we have received your refund request. <br> 
                            Our team will review it and respond as soon as possible. You will receive a follow-up email once your refund is processed.
                        </p>
            
                        <div style="background: #222; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1); margin-top: 15px;">
                            <p style="font-size: 18px; font-weight: bold; color: #fff !important;">📩 Refund Details</p>
                            <p style="color: #fff !important;"><strong>First Name:</strong> ${firstName}</p>
                            <p style="color: #fff !important;"><strong>Last Name:</strong> ${lastName}</p>
                            <p style="color: #fff !important;"><strong>📞 Phone:</strong> ${phone1} ${phone2 ? ` / ${phone2}` : ""}</p>
                            <p style="color: #fff !important;"><strong>🆔 Order ID:</strong> ${orderID}</p>
                            <p style="color: #fff !important;"><strong>📅 Date of your order:</strong> ${date}</p>
                            <p style="color: #fff !important;"><strong>📦 Item you want to refund:</strong> ${item}</p>
                            <p style="color: #fff !important;"><strong>❓ Reason:</strong> ${reason}</p>
                        </div>
            
                        <div style="margin-top: 20px; text-align: center;">
                            <p style="font-size: 14px; color: #ccc;">We appreciate your patience. If you have any further questions, feel free to contact us.</p>
                            <a href="https://elitere.ooguy.com" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #000 !important; text-decoration: none; border-radius: 8px; font-size: 16px;">Visit Elitère Store</a>
                        </div>

            
                        <div style="margin-top: 30px; font-size: 12px; color: #aaa; text-align: center;">
                            <p>© 2025 Elitère Store. All rights reserved.</p>
                        </div>
                    </div>
                `
            };
            

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'REPORT HAS BEEN RECEIVED' });
        } else {
            console.error('Failed to submit request:', response.statusText);
            return res.status(500).json({ message: 'Failed to submit request.' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error submitting request.' });
    }
});

module.exports = app;

app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'UI')));

app.get('/', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'pages', 'main.html'));
});

app.get('/main.css', (req, res) =>
{
	const imagePath = path.join(__dirname, 'design/main.css');
	res.sendFile(imagePath);
});

const scriptsDir = path.join(__dirname, 'scripts');

app.get('/:scriptName', (req, res) => {
    const scriptPath = path.join(scriptsDir, req.params.scriptName);

    if (fs.existsSync(scriptPath) && scriptPath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(scriptPath);
    } else {
        res.status(404).sendFile(path.join(__dirname, "pages", "404.html"));
    }
});


const IMAGE_FOLDER = path.join(__dirname, 'UI');

app.get('/UI', (req, res) =>
{
	fs.readdir(IMAGE_FOLDER, (err, files) =>
	{
		if(err)
		{
			return res.status(500).json(
			{
				error: 'Unable to read the folder'
			});
		}

		const images = files.filter(file =>
			/\.(jpg|jpeg|png|gif|webp)$/i.test(file)
		);

		res.json(images);
	});
});



app.listen(PORT, () =>
{
	console.log(`ALL GOOD!`)
});
