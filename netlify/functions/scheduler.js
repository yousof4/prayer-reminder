const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const baseUrl = `https://${event.headers.host}`;
    
    // جلب أوقات الصلاة
    const prayerResponse = await fetch...
