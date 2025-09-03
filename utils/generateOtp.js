// Generates a 6-digit numeric OTP
import randomatic from 'randomatic';

const generateOtp = () => randomatic('0', 6);

export default generateOtp;