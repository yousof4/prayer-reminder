// الكود الأساسي للتذكير
exports.handler = async (event, context) => {
  console.log('🔔 تم تشغيل التذكير - الوقت:', new Date().toLocaleString('ar-EG'));
  
  try {
    // هنا سنضع المنطق الرئيسي
    const currentTime = new Date();
    
    // للتجربة الأولى - رسالة بسيطة  
    const testMessage = `🕌 اختبار التذكير\n⏰ الوقت الحالي: ${currentTime.toLocaleString('ar-EG')}`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "تم تشغيل التذكير بنجاح",
        timestamp: currentTime.toISOString(),
        test: testMessage
      })
    };
    
  } catch (error) {
    console.error('❌ خطأ في التذكير:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "حدث خطأ في التذكير",
        details: error.message
      })
    };
  }
};
