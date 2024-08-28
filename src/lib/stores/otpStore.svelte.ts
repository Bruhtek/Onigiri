type OTPData = {
	otp: string|null;
	otpProof: string|null;
	otpExpiration: number|null;
};

const otpStore = $state<OTPData>({
	otp: null,
	otpProof: null,
	otpExpiration: null,
});

export const clearOTP = () => {
	otpStore.otp = null;
	otpStore.otpProof = null;
	otpStore.otpExpiration = null;
}

export default otpStore;
