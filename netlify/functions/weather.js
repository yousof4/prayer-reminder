exports.handler = async (event, context) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    
    // لو مفيش API key، استخدم بيانات افتراضية
    if (!apiKey) {
      const defaultWeather = [
        {
          location: 'كوبري القبة',
          temperature: 18,
          description: 'صافي',
          humidity: 65
        },
        {
          location: 'كفر الشيخ', 
          temperature: 16,
          description: 'غائم جزئياً',
          humidity: 70
        }
      ];

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          success: true,
          weather: defaultWeather,
          note: 'بيانات افتراضية - أضف WEATHER_API_KEY للحصول على بيانات حقيقية',
          timestamp: new Date().toISOString()
        })
      };
    }

    // محاولة جلب بيانات حقيقية
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

    for (const location of locations) {
      try {
        // التحقق من وجود الإحداثيات
        if (!location.lat || !location.lon) {
          weatherData.push({
            location: location.name,
            temperature: 20,
            description: 'غير متاح',
            humidity: 60,
            error: 'إحداثيات المكان غير محددة'
          });
          continue;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=ar`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          weatherData.push({
            location: location.name,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity
          });
        } else {
          weatherData.push({
            location: location.name,
            temperature: 20,
            description: 'غير متاح',
            humidity: 60,
            error: 'لا يمكن جلب البيانات'
          });
        }
      } catch (err) {
        weatherData.push({
          location: location.name,
          temperature: 20,
          description: 'غير متاح', 
          humidity: 60,
          error: err.message
        });
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        success: true,
        weather: weatherData,
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
