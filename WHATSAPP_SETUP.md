# WhatsApp Integration Guide for Klyra Studio

Your order tracking system now includes WhatsApp notifications for customers. Here are your options:

## Option 1: Using Twilio (Recommended for Production)

### Steps to Setup:
1. **Create Twilio Account**
   - Go to https://www.twilio.com
   - Sign up for free account
   - Get your Account SID and Auth Token from Dashboard

2. **Enable WhatsApp Sandbox**
   - Go to Twilio Console → Messaging → Try it out → Send an SMS
   - Click "WhatsApp" tab
   - Follow the sandbox setup instructions
   - Get your Twilio WhatsApp Number

3. **Update checkout.js**
   ```javascript
   // Add to the top of checkout.js
   const TWILIO_ACCOUNT_SID = 'your_account_sid';
   const TWILIO_AUTH_TOKEN = 'your_auth_token';
   const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+1234567890'; // Your Twilio number
   ```

4. **Update sendOrderWhatsApp() function**
   ```javascript
   async function sendOrderWhatsApp(phone, orderData) {
       try {
           const message = `Your order has been placed! Order ID: ${orderData.id}`;
           
           const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
               method: 'POST',
               headers: {
                   'Authorization': 'Basic ' + btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN'),
                   'Content-Type': 'application/x-www-form-urlencoded'
               },
               body: new URLSearchParams({
                   'From': 'whatsapp:+14155552671',
                   'To': `whatsapp:+91${phone}`,
                   'Body': message
               })
           });
           
           if (response.ok) {
               console.log('✓ WhatsApp message sent!');
           }
       } catch (error) {
           console.error('Error sending WhatsApp:', error);
       }
   }
   ```

---

## Option 2: Using UltraMSG (Simple Setup)

### Steps:
1. Go to https://ultramsg.com
2. Sign up and get your API token
3. Add to checkout.js:
   ```javascript
   const ULTRAMSG_TOKEN = 'your_token';
   const ULTRAMSG_INSTANCE_ID = 'your_instance_id';
   
   async function sendOrderWhatsApp(phone, orderData) {
       const message = `Your order placed! ID: ${orderData.id}`;
       
       await fetch(`https://api.ultramsg.com/instance${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
           method: 'POST',
           body: JSON.stringify({
               chatId: phone + '@c.us',
               body: message,
               token: ULTRAMSG_TOKEN
           })
       });
   }
   ```

---

## Option 3: Manual WhatsApp Links (Free - Current Setup)

When you click "Shipped" or "Delivered" in Admin Dashboard:
- A message template appears
- Copy the message
- Click "Open WhatsApp" link or scan QR
- Send manually to customer

**Current Buttons in Admin:**
- 🚚 **Shipped** → Tracking ID option + message template
- 📦 **Delivered** → Delivery confirmation message
- 💳 **Verify** → Payment verified message

---

## For Current Implementation:

### Using Status Buttons:
1. Go to Admin Dashboard → Orders tab
2. For each order, click:
   - **💳 Verify** - After payment verified
   - **🚚 Shipped** - When sent to courier (can add tracking ID)
   - **📦 Delivered** - When customer confirms delivery

3. Each action triggers a WhatsApp message template:
   - You can copy the message
   - Or scan the WhatsApp link QR code
   - Send manually to customer

### Customer Payment Page Features:
- **UPI QR Code** - Customers can scan to pay
- **Copy UPI ID** - Manual entry option
- Payment screenshot upload confirmation

---

## Testing WhatsApp Integration:

1. **Test Message Flow:**
   - Go to checkout
   - Add items to cart
   - Complete order with your phone number
   - Admin updates order status
   - Message template appears
   - Send via WhatsApp

2. **Check Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - You'll see message logs showing:
     - "📦 Sending WhatsApp: ..."
     - "✓ Message ready to send"
     - WhatsApp link with pre-filled message

---

## Recommended Setup for Your Use Case:

Since you want actual notifications, I recommend:

1. **Short term** (Now): Use manual message templates
   - Copy message and send from your WhatsApp manually
   - Simple, free, works immediately

2. **Medium term** (1-2 weeks): Setup Twilio free tier
   - Automate shipping notifications
   - No manual copy-paste needed
   - Still free up to 100 SMS/month

3. **Long term** (Production): Setup UltraMSG or Twilio Pro
   - Full automation
   - Professional WhatsApp Business API
   - Better delivery rates

---

## Current System Flow:

```
Order Placed
    ↓
📋 Payment Screenshot Uploaded
    ↓
[Admin: Click "Verify Payment"] → Message template appears
    ↓
✓ Payment Verified + Status: Confirmed
    ↓
[Admin: Click "Shipped", enter Tracking] → Message template appears
    ↓
🚚 Status: Shipped + Tracking ID saved
    ↓
[Admin: Click "Delivered"] → Message template appears
    ↓
📦 Status: Delivered (Customer sees in "My Orders")
```

---

## Quick Start Now:

1. Open https://klyrastudio11.github.io/klyrastudio/pages/admin-dashboard.html
2. Go to "Orders" tab
3. For any order, click:
   - **💳 Verify** → Copy & send WhatsApp message
   - **🚚 Shipped** → Add tracking ID, copy & send message
   - **📦 Delivered** → Copy & send message

Your messages are ready to copy and send manually! No additional setup needed right now.

---

## Questions?

The system is designed to be flexible:
- Messages include customer name, order ID, tracking info
- QR codes can be scanned to auto-open WhatsApp
- Easy to migrate to full API later

All message templates are in admin-dashboard.js and checkout.js               