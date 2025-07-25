// TODO: Replace this stub with real SMS integration before production

export const sendOTP = async (phone, otp, name = '') => {
  console.log(`SMS Service: sendOTP called (stub) | phone: ${phone} | otp: ${otp} | name: ${name}`);
  return Promise.resolve();
};

export const sendMarketing = async (...args) => {
  console.log('SMS Service: sendMarketing called (stub)', ...args);
  return Promise.resolve();
};

export const formatPhoneNumber = (phone) => phone; 