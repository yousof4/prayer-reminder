const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const baseUrl = `https://${event.headers.host}`;
    
    // جلب أوقات الصلاة
    const prayerResponse = await fetch(`${baseUrl}/.netlify/functions/prayer-times`);
    const prayerData = await prayerResponse.json();
    
    // جلب بيانات الطقس
    const weatherResponse = await fetch(`${baseUrl}/.netlify/functions/weather`);
    const weatherData = await weatherResponse.json();
    
    if (!prayerData.success || !weatherData.success) {
      throw new Error('فشل في جلب البيانات');
    }

    // تنسيق الرسالة النهائية
    const prayers = prayerData.prayers;
    const weather = weatherData.weather;
    
    const message = `🕌 *أوقات الصلاة اليوم - ${prayerData.date}*

🌅 *الفجر:* ${prayers.fajr}
☀️ *الشروق:* ${prayers.sunrise}
🕛 *الظهر:* ${prayers.dhuhr}
🕐 *العصر:* ${prayers.asr}
🌆 *المغرب:* ${prayers.maghrib}
🌙 *العشاء:* ${prayers.isha}

🌤️ *حالة الطقس:*

📍 *${weather[0].location}:*
🌡️ الحرارة: ${weather[0].temperature}°م
☁️ الحالة: ${weather[0].description}
💧 الرطوبة: ${weather[0].humidity}%

📍 *${weather[1].location}:*
🌡️ الحرارة: ${weather[1].temperature}°م
☁️ الحالة: ${weather[1].description}
💧 الرطوبة: ${weather[1].humidity}%

🤲 بارك الله لكم في يومكم`;

    // إرسال الرسالة
    const notificationResponse = await fetch(`${baseUrl}/.netlify/functions/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });
    
    const notificationResult = await notificationResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'تم إرسال التذكير بنجاح',
        prayerTimes: prayers,
        weather: weather,
        notifications: notificationResult.results,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
