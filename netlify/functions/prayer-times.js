const { CalculationMethod, PrayerTimes, Coordinates } = require('adhan');

exports.handler = async (event, context) => {
  try {
    // إحداثيات القاهرة من Environment Variables
    const latitude = parseFloat(process.env.CAIRO_LATITUDE) || 30.0444;
    const longitude = parseFloat(process.env.CAIRO_LONGITUDE) || 31.2357;
    
    // إعداد الحسابات
    const coordinates = new Coordinates(latitude, longitude);
    const date = new Date();
    
    // استخدام طريقة الحساب المصرية (أم القرى مع تعديل)
    const params = CalculationMethod.UmmAlQura();
    params.madhab = 0; // الشافعي
    
    // حساب أوقات الصلاة
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    
    // تحويل للتوقيت المحلي
    const formatTime = (time) => {
      return time.toLocaleTimeString('ar-EG', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Africa/Cairo'
      });
    };

    const prayers = {
      fajr: formatTime(prayerTimes.fajr),
      sunrise: formatTime(prayerTimes.sunrise),
      dhuhr: formatTime(prayerTimes.dhuhr),
      asr: formatTime(prayerTimes.asr),
      maghrib: formatTime(prayerTimes.maghrib),
      isha: formatTime(prayerTimes.isha)
    };

    // تنسيق التاريخ بالعربي
    const today = new Date().toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      timeZone: 'Africa/Cairo'
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        success: true,
        date: today,
        prayers: prayers,
        location: 'القاهرة، مصر',
        method: 'أم القرى (المملكة العربية السعودية)',
        madhab: 'الشافعي'
      })
    };

  } catch (error) {
    // في حالة الخطأ، استخدم المواقيت الثابتة كـ fallback
    const fallbackPrayers = {
      fajr: "5:28 ص",
      sunrise: "6:50 ص",
      dhuhr: "12:12 م",
      asr: "3:18 م", 
      maghrib: "5:34 م",
      isha: "6:56 م"
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        success: true,
        date: new Date().toLocaleDateString('ar-EG'),
        prayers: fallbackPrayers,
        location: 'القاهرة، مصر',
        note: 'مواقيت تقريبية - ' + error.message
      })
    };
  }
};
