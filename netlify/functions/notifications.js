const fetch = require('node-fetch');

// إرسال رسالة واتساب عبر CallMeBot
async function sendWhatsApp(phone, apiKey, message) {
  try {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const result = await response.text();
    
    return {
      success: response.ok,
      platform: 'WhatsApp',
      result: result
    };
  } catch (error) {
    return {
      success: false,
      platform: 'WhatsApp',
      error: error.message
    };
  }
}

// إرسال رسالة تليجرام
async function sendTelegram(botToken, chatId, message) {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    
    return {
      success: response.ok,
      platform: 'Telegram',
      result: result
    };
  } catch (error) {
    return {
      success: false,
      platform: 'Telegram',
      error: error.message
    };
  }
}

exports.handler = async (event, context) => {
  try {
    const { message } = JSON.parse(event.body || '{}');
    
    if (!message) {
      throw new Error('لا توجد رسالة للإرسال');
    }

    const results = [];

    // إرسال واتساب
    if (process.env.WHATSAPP_PHONE && process.env.CALLMEBOT_API_KEY) {
      const whatsappResult = await sendWhatsApp(
        process.env.WHATSAPP_PHONE,
        process.env.CALLMEBOT_API_KEY,
        message
      );
      results.push(whatsappResult);
    }

    // إرسال تليجرام
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const telegramResult = await sendTelegram(
        process.env.TELEGRAM_BOT_TOKEN,
        process.env.TELEGRAM_CHAT_ID,
        message
      );
      results.push(telegramResult);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        results: results,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
