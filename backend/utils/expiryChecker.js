const cron = require('node-cron');
const InventoryItem = require('../models/InventoryItem');

// Function to check for items expiring soon (within 2 days)
const checkExpiringItems = async () => {
  try {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const expiringItems = await InventoryItem.find({
      expiryDate: { $lte: twoDaysFromNow },
      quantity: { $gt: 0 }
    });
    
    if (expiringItems.length > 0) {
      console.log('🚨 EXPIRY ALERT: Items expiring soon:');
      expiringItems.forEach(item => {
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`- ${item.name}: ${item.quantity} units expiring in ${daysUntilExpiry} days (${new Date(item.expiryDate).toLocaleDateString()})`);
      });
      
      // TODO: Send WhatsApp/email alerts here
      // For now, just log to console
      console.log('📧 Alert would be sent to kitchen staff');
    }
  } catch (error) {
    console.error('Error checking expiring items:', error);
  }
};

// Schedule daily expiry check at 9 AM
const scheduleExpiryChecks = () => {
  cron.schedule('0 9 * * *', () => {
    console.log('🔍 Running daily expiry check...');
    checkExpiringItems();
  });
  
  console.log('✅ Expiry checker scheduled for daily runs at 9 AM');
};

// Manual check function (for testing)
const manualExpiryCheck = async () => {
  console.log('🔍 Running manual expiry check...');
  await checkExpiringItems();
};

module.exports = {
  scheduleExpiryChecks,
  checkExpiringItems,
  manualExpiryCheck
}; 