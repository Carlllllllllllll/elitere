const express = require('express');
const path = require('path');
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
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
		required: true
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
		required: true
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
		required: true
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
		required: true
	}
});

const Order = mongoose.model('Order', orderSchema);

const Report = mongoose.model('Report', reportSchema);

const Feedback = mongoose.model('Feedback', feedbackSchema);

const bannedLogCache = {};

const generateUserId = (req) =>
{
	return crypto.createHash('sha256').update(req.headers['user-agent'] + req.ip).digest('hex');
};

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

app.use((req, res, next) =>
{
	res.locals.nonce = generateNonce();
	next();
});

app.use(bodyParser.json());
app.post('/api/orders', async (req, res) =>
{
	const
	{
		firstName,
		lastName,
		email,
		location,
		streetName,
		city,
		phone1,
		phone2,
		cartItems,
		totalPrice
	} = req.body;
	const webhookURL = process.env.WEBHOOK_URL1;
	const userId = generateUserId(req);
	const oneMonth = 30 * 24 * 60 * 60 * 1000;

	if(!firstName || !lastName || !email || !location || !streetName || !city || !phone1)
	{
		return res.status(400).json(
		{
			message: 'All fields are required.'
		});
	}

	const orderId = `ORD-${Date.now()}`;

	const isBanned = await checkIfBanned(userId);
	if(isBanned)
	{
		return res.status(401).json(
		{
			code: 'USER_BANNED',
			message: 'You are banned from ordering. Please contact support to know the reason.',
		});
	}

	const orderRecord = await Order.findOne(
	{
		userId
	});
	const now = new Date();

	if(orderRecord)
	{
		const lastOrderTime = new Date(orderRecord.lastOrderTime);
		if(now - lastOrderTime < oneMonth)
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
			title: "🛒 New Order Received",
			color: 0x1abc9c,
			fields: [
			{
				name: "👤 First Name",
				value: firstName,
				inline: true
			},
			{
				name: "👤 Last Name",
				value: lastName,
				inline: true
			},
			{
				name: "📧 Email",
				value: email,
				inline: true
			},
			{
				name: "📍 Location",
				value: location,
				inline: true
			},
			{
				name: "🏠 Street Name",
				value: streetName,
				inline: true
			},
			{
				name: "🏙️ City",
				value: city,
				inline: true
			},
			{
				name: "📞 Phone Number 1",
				value: phone1,
				inline: true
			},
			{
				name: "📞 Phone Number 2",
				value: phone2 || "N/A",
				inline: true
			},
			{
				name: "🛍️ Cart Items",
				value: cartItems.map(item => `**${item.name}** - ${item.quantity} x ${item.price}`).join("\n"),
				inline: false
			},
			{
				name: "💰 Total Price",
				value: `${totalPrice}`,
				inline: true
			},
			{
				name: "🆔 Order ID",
				value: orderId,
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

			await Order.findOneAndUpdate(
			{
				userId
			},
			{
				lastOrderTime: now
			},
			{
				upsert: true,
				new: true
			});

			return res.status(200).json(
			{
				message: 'ORDER HAS BEEN RECEIVED',
				orderId: orderId 
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

app.post('/api/reports', async (req, res) =>
{
	const
	{
		firstName,
		lastName,
		email,
		phone1,
		phone2,
		description
	} = req.body;
	const webhookURL = process.env.WEBHOOK_URL2;
	const userId = generateUserId(req);
	const oneMonth = 30 * 24 * 60 * 60 * 1000; 

	if(!firstName || !lastName || !email || !phone1 || !description)
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
			message: 'You are banned. Please contact support to know the reason.',
		});
	}

	const reportRecord = await Report.findOne(
	{
		userId
	});
	const now = new Date();

	if(reportRecord)
	{
		const lastReportTime = new Date(reportRecord.lastReportTime);
		if(now - lastReportTime < oneMonth)
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
			title: "📩 New Report Received",
			color: 0x1abc9c,
			fields: [
			{
				name: "👤 First Name",
				value: firstName,
				inline: true
			},
			{
				name: "👤 Last Name",
				value: lastName,
				inline: true
			},
			{
				name: "📧 Email",
				value: email,
				inline: true
			},
			{
				name: "📞 Phone Number 1",
				value: phone1,
				inline: true
			},
			{
				name: "📞 Phone Number 2",
				value: phone2 || "N/A",
				inline: true
			},
			{
				name: "📩 Report Description",
				value: description,
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

			await Report.findOneAndUpdate(
			{
				userId
			},
			{
				lastReportTime: now
			},
			{
				upsert: true,
				new: true
			});

			return res.status(200).json(
			{
				message: 'REPORT HAS BEEN RECEIVED'
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

app.post('/api/feedback', async (req, res) =>
{
	const
	{
		fdescription
	} = req.body;
	const userId = generateUserId(req);
	const webhookURL = process.env.WEBHOOK_URL3;
	const oneMonth = 30 * 24 * 60 * 60 * 1000; 

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
			message: 'You are banned. Please contact support to know the reason.',
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
		if(now - lastFeedbackTime < oneMonth)
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

app.post('/api/refunds', async (req, res) =>
{
	const
	{
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
	const oneMonth = 30 * 24 * 60 * 60 * 1000; 
	const webhookURL = process.env.WEBHOOK_URL4;

	if(!firstName || !lastName || !email || !phone1 || !date || !orderID || !item || !reason)
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
			message: 'You are banned. Please contact support to know the reason.',
		});
	}

	const refundRecord = await Refund.findOne(
	{
		userId
	});
	const now = new Date();

	if(refundRecord)
	{
		const lastRefundTime = new Date(refundRecord.lastRefundTime);
		if(now - lastRefundTime < oneMonth)
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
			title: "📩 New Refund Request",
			color: 0x1abc9c,
			fields: [
			{
				name: "📝 First Name",
				value: firstName,
				inline: true
			},
			{
				name: "📝 Last Name",
				value: lastName,
				inline: true
			},
			{
				name: "📧 Email",
				value: email,
				inline: true
			},
			{
				name: "📞 Phone 1",
				value: phone1,
				inline: true
			},
			{
				name: "📞 Phone 2",
				value: phone2 || "N/A",
				inline: true
			},
			{
				name: "📅 Date",
				value: date || "N/A",
				inline: true
			},
			{
				name: "🆔 Order ID",
				value: orderID || "N/A",
				inline: true
			},
			{
				name: "📦 Item",
				value: item,
				inline: true
			},
			{
				name: "❓ Reason",
				value: reason,
				inline: false
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

			await Refund.findOneAndUpdate(
			{
				userId
			},
			{
				lastRefundTime: now
			},
			{
				upsert: true,
				new: true
			});

			return res.status(200).json(
			{
				message: 'REPORT HAS BEEN RECEIVED'
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

module.exports = app;

app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'UI')));

app.get('/', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'pages', 'main.html'));
});

app.get('/report', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'pages', 'report.html'));
});

app.get('/report.css', (req, res) =>
{
	const imagePath = path.join(__dirname, 'design/report.css');
	res.sendFile(imagePath);
});

app.get('/main.css', (req, res) =>
{
	const imagePath = path.join(__dirname, 'design/main.css');
	res.sendFile(imagePath);
});

app.get('/main.js', (req, res) =>
{
	const imagePath = path.join(__dirname, 'scripts/main.js');
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile(imagePath);
});

app.get('/reportmodal.js', (req, res) =>
{
	const imagePath = path.join(__dirname, 'scripts/reportmodal.js');
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile(imagePath);
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
