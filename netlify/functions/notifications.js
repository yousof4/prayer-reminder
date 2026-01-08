exports.handler = async (event, context) => {
  try {
    const { message } = JSON.parse(event.body || '{}');
    
    if (!message) {
      throw new Error('لا توجد رسالة للإرسال');
    }

    const results = [];

    // محاولة إرسال واتساب
    if (process.env.WHATSAPP_PHONE && process.env.CALLMEBOT_API_KEY) {
      try {
        const phone = process.env.WHATSAPP_PHONE;
        const apiKey = process.env.CALLMEBOT_API_KEY;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const result = await response.text();
        
        results.push({
          success: response.ok,
          platform: 'WhatsApp',
          status: response.status,
          result: result
        });
      } catch (error) {
        results.push({
          success: false,
          platform: 'WhatsApp',
          error: error.message
        });
      }
    } else {
      results.push({
        success: false,
        platform: 'WhatsApp',
        error: 'WHATSAPP_PHONE أو CALLMEBOT_API_KEY غير موجود'
      });
    }

    // محاولة إرسال تليجرام
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        const result = await response.json();
        
        results.push({
          success: response.ok,
          platform: 'Telegram',
          status: response.status,
          result: result
        });
      } catch (error) {
        results.push({
          success: false,
          platform: 'Telegram',
          error: error.message
        });
      }
    } else {
      results.push({
        success: false,
        platform: 'Telegram', 
        error: 'TELEGRAM_BOT_TOKEN أو TELEGRAM_CHAT_ID غير موجود'
      });
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        success: true,
        results: results,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
