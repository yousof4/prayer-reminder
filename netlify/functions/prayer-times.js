exports.handler = async (event, context) => {
  try {
    // حساب أوقات الصلاة بطريقة مبسطة للقاهرة
    const now = new Date();
    const today = now.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });

    // أوقات ثابتة للقاهرة (يناير 2026)
    const prayers = {
      fajr: "5:35 ص",
      sunrise: "6:52 ص",
      dhuhr: "12:12 م", 
      asr: "3:15 م",
      maghrib: "5:32 م",
      isha: "6:52 م"
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        success: true,
        date: today,
        prayers: prayers,
        location: 'القاهرة، مصر'
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
