import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Phone, ArrowLeft, CheckIcon } from "lucide-react";
import GoogleLoginbutton from "./GoogleAuthButton";
import api from "../../lib/axiosSetup";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/userSlice";
import { sendOtpSchema, otpSchema, registerSchema, firstZodError } from "../../lib/schemas";

export default function AuthPanel({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("method");
  const [method, setMethod] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Registration state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [panelMessage, setPanelMessage] = useState({ type: "", text: "" });

  // Resend OTP cooldown (in seconds)
  const RESEND_COOLDOWN = 60;
  const [resendRemaining, setResendRemaining] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const resetPanel = () => {
    setStep("method");
    setMethod(null);
    setIdentifier("");
    setOtp("");
    setFirstName("");
    setLastName("");
    setRegEmail("");
    setRegPhone("");
    // clear resend timer when panel resets
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setResendRemaining(0);
  };

  useEffect(() => {
    const handleFocus = () => {
      setIsLoading(false);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleClose = () => {
    resetPanel();
    setIsLoading(false);
    onClose();
  };

  const handleMethodSelect = (selectedMethod) => {
    if (selectedMethod !== "google") {
      setMethod(selectedMethod);
      setStep("identifier");
    }
  };

  const handleSendOtp = async () => {
    setPanelMessage({ type: "", text: "", icon: "" });
    if (step === 'otp' && resendRemaining > 0) {
      setPanelMessage({ type: 'error', text: `Please wait ${formatTime(resendRemaining)} before resending` });
      return;
    }
    const parsed = sendOtpSchema.safeParse({ method, identifier: identifier.trim() });
    if (!parsed.success) {
      setPanelMessage({ type: 'error', text: firstZodError(parsed.error) });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/users/send-otp', method === 'email' ? { email: identifier } : { number: identifier });
      setPanelMessage({ type: 'info', text: 'OTP sent successfully', icon: <CheckIcon size={18} /> });
      setStep('otp');
      // start resend cooldown
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setResendRemaining(RESEND_COOLDOWN);
      timerRef.current = setInterval(() => {
        setResendRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send OTP';
      setPanelMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const ok = otpSchema.safeParse(otp);
    if (!ok.success) {
      setPanelMessage({ type: 'error', text: firstZodError(ok.error) });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/api/users/verify-otp',
        method === 'email' ? { email: identifier, otp } : { number: identifier, otp }
      );

      const payload = res?.data?.data || {};

      if (payload.user) {
        setPanelMessage({ type: '', text: '' });
        onSuccess && onSuccess(payload.user);
        handleClose();
        localStorage.setItem('accessToken', payload?.accessToken);
        dispatch(setUser(payload.user));
        return;
      }

      // If OTP valid but no user found -> show register panel
      if (payload.exists === false) {
        setPanelMessage({ type: 'info', text: 'No account found. Please register.' });
        setRegEmail(method === 'email' ? identifier : '');
        setRegPhone(method === 'number' ? identifier : '');
        setStep('register');
        return;
      }

      setPanelMessage({ type: 'info', text: 'Verified' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Your OTP is incorrect';
      setPanelMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const parsed = registerSchema.safeParse({ firstName: firstName.trim(), lastName: lastName.trim(), email: regEmail || undefined, number: regPhone || undefined });
    if (!parsed.success) {
      setPanelMessage({ type: 'error', text: firstZodError(parsed.error) });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: regEmail || undefined,
        number: regPhone || undefined,
      };

      const res = await api.post('/api/users/register', payload);
      const user = res?.data?.data?.user || null;
      setPanelMessage({ type: 'info', text: 'Registered and logged in' });
      onSuccess && onSuccess(user);
      handleClose();
      localStorage.setItem('accessToken', res?.data?.data?.accessToken);
      dispatch(setUser(user));
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setPanelMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "identifier") setStep("method");
    else if (step === "otp") setStep("identifier");
    else if (step === "register") setStep("otp");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="relative flex gap-2">
            {step !== "method" && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft size={16} />
              </Button>
            )}
            <div className="flex flex-col items-start">
              <DialogTitle className="bg-linear-to-r pb-1 from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
                {step === "method" && "Welcome"}
                {step === "identifier" && "Enter Details"}
                {step === "otp" && "Verify OTP"}
                {step === "register" && "Register"}
              </DialogTitle>
              <DialogDescription className="text-start">
                {step === "method" && "Choose login method"}
                {step === "identifier" && `Enter your ${method === 'email' ? 'email address' : 'phone number'}`}
                {step === "otp" && `Enter the OTP sent to ${identifier}`}
                {step === "register" && "Complete registration"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === "method" && (
          <div className="space-y-3">
            <Button onClick={() => handleMethodSelect("email")} disabled={isLoading} className="w-full h-14 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
              <Mail className="mr-2" /> Continue With Email
            </Button>
            <Button onClick={() => handleMethodSelect("number")} disabled={isLoading} className="w-full h-14 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
              <Phone className="mr-2" /> Continue With Phone
            </Button>
            <GoogleLoginbutton isLoading={isLoading} setIsLoading={setIsLoading} onSuccess={(user) => {
              onSuccess && onSuccess(user);
              handleClose();
            }} />
          </div>
        )}

        {step === "identifier" && (
          <div className="space-y-4">
            <div className="space-y-2">
              {panelMessage?.text && (
                <div className={`w-full flex gap-2 items-end rounded text-sm ${panelMessage.type === 'error' ? 'text-red-700' : ' text-green-600'}`} role={panelMessage.type === 'error' ? 'alert' : 'status'}>
                  {panelMessage.text} {panelMessage.icon}
                </div>
              )}
              <Label> {method === 'email' ? 'Email Address' : 'Phone Number'}</Label>
              <Input
                className="mt-2"
                value={identifier}
                required
                type={method === 'email' ? 'email' : 'tel'}
                placeholder={method === 'email' ? 'you@example.com' : '1234567890'}
                autoFocus
                inputMode={method === 'email' ? 'email' : 'numeric'}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleSendOtp} className="w-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) hover:opacity-90 text-white" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div className="space-y-2">
              {panelMessage?.text && (
                <div className={`w-full flex gap-2 items-end rounded text-sm ${panelMessage.type === 'error' ? 'text-red-700' : ' text-green-600'}`} role={panelMessage.type === 'error' ? 'alert' : 'status'}>
                  {panelMessage.text} {panelMessage.icon}
                </div>
              )}
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="******"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                className="text-center mt-2 text-2xl tracking-widest"
                autoFocus
              />
            </div>
            <div className="text-sm text-muted-foreground text-center">
              Didn't receive the code?{' '}
              <button
                onClick={handleSendOtp}
                className="text-primary hover:underline inline-flex items-center"
                disabled={isLoading || resendRemaining > 0}
              >
                Resend OTP
                {resendRemaining > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">({formatTime(resendRemaining)})</span>
                )}
              </button>
            </div>
            <Button
              onClick={handleVerifyOtp}
              className="w-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) hover:opacity-90 text-white"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </div>
        )}

        {step === 'register' && (
          <div className="space-y-4">
            {panelMessage?.text && (
              <div className={`w-full flex gap-2 items-end rounded text-sm ${panelMessage.type === 'error' ? 'text-red-700' : 'text-green-600'}`} role={panelMessage.type === 'error' ? 'alert' : 'status'}>
                {panelMessage.text} {panelMessage.icon}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                className="mt-2"
                value={regEmail}
                required
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={method === 'email'}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                className="mt-2"
                value={regPhone}
                required
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="1234567890"
                disabled={method === 'number'}
              />
            </div>

            <Button
              onClick={handleRegister}
              className="w-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) hover:opacity-90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Create account'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}