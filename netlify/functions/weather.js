const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('مفتاح API للطقس غير متوفر');
    }

    // إحداثيات المواقع
    const locations = [
      {
        name: 'كوبري القبة',
        lat: process.env.KOBRY_ELKOBA_LAT,
        lon: process.env.KOBRY_ELKOBA_LON
      },
      {
        name: 'كفر الشيخ',
        lat: process.env.KAFRELSHEIKH_LAT,
        lon: process.env.KAFRELSHEIKH_LON
      }
    ];

    const weatherData = [];

    // جلب بيانات كل موقع
    for (const location of locations) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=ar`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        weatherData.push({
          location: location.name,
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind?.speed * 3.6) || 0, // تحويل من m/s إلى km/h
          pressure: data.main.pressure
        });
      } else {
        weatherData.push({
          location: location.name,
          error: 'لا يمكن جلب بيانات الطقس'
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        weather: weatherData,
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
