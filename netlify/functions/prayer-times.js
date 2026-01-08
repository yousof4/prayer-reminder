const { CalculationMethod, PrayerTimes, Coordinates } = require('adhan');
const moment = require('moment-timezone');

exports.handler = async (event, context) => {
  try {
    // إحداثيات القاهرة من Environment Variables
    const latitude = parseFloat(process.env.CAIRO_LATITUDE);
    const longitude = parseFloat(process.env.CAIRO_LONGITUDE);
    
    // إعداد الحسابات
    const coordinates = new Coordinates(latitude, longitude);
    const date = new Date();
    const params = CalculationMethod.NorthAmerica(); // طريقة الجمعية الإسلامية لأمريكا الشمالية
    
    // حساب أوقات الصلاة
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    
    // تحويل للتوقيت المحلي المصري
    const timezone = 'Africa/Cairo';
    
    const prayers = {
      fajr: moment(prayerTimes.fajr).tz(timezone).format('h:mm A'),
      sunrise: moment(prayerTimes.sunrise).tz(timezone).format('h:mm A'),
      dhuhr: moment(prayerTimes.dhuhr).tz(timezone).format('h:mm A'),
      asr: moment(prayerTimes.asr).tz(timezone).format('h:mm A'),
      maghrib: moment(prayerTimes.maghrib).tz(timezone).format('h:mm A'),
      isha: moment(prayerTimes.isha).tz(timezone).format('h:mm A')
    };

    // تنسيق الرسالة بالعربي
    const arabicPrayers = {
      fajr: prayers.fajr.replace('AM', 'ص').replace('PM', 'م'),
      sunrise: prayers.sunrise.replace('AM', 'ص').replace('PM', 'م'),
      dhuhr: prayers.dhuhr.replace('AM', 'ص').replace('PM', 'م'),
      asr: prayers.asr.replace('AM', 'ص').replace('PM', 'م'),
      maghrib: prayers.maghrib.replace('AM', 'ص').replace('PM', 'م'),
      isha: prayers.isha.replace('AM', 'ص').replace('PM', 'م')
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        date: moment().tz(timezone).format('dddd، DD MMMM YYYY'),
        prayers: arabicPrayers,
        location: 'القاهرة، مصر'
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
