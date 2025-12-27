import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, Phone, Chrome, ArrowLeft } from "lucide-react";
// import { mockUsers } from "../data/authMockData";
import { toast } from "sonner";

export function AuthPanel({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("method");
  const [method, setMethod] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Registration state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const resetPanel = () => {
    setStep("method");
    setMethod(null);
    setIdentifier("");
    setOtp("");
    setGeneratedOtp("");
    setFirstName("");
    setLastName("");
    setRegEmail("");
    setRegPhone("");
  };

  const handleClose = () => {
    resetPanel();
    onClose();
  };

  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);

    if (selectedMethod === "google") {
      handleGoogleLogin();
    } else {
      setStep("identifier");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));

      const googleUser = {
        email: "google.user@example.com",
        name: "Google User",
      };

      const existingUser = mockUsers.find(
        (u) => u.email === googleUser.email
      );

      if (existingUser) {
        toast.success("Signed in with Google");
        onSuccess(existingUser, "user");
        handleClose();
      } else {
        const newUser = {
          id: Date.now(),
          email: googleUser.email,
          name: googleUser.name,
        };
        mockUsers.push(newUser);
        toast.success("Account created with Google");
        onSuccess(newUser, "user");
        handleClose();
      }
    } catch {
      toast.error("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      toast.error("Please enter value");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    toast.success(`OTP sent`, {
      description: `Demo OTP: ${newOtp}`,
    });

    setIsLoading(false);
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const existingUser = mockUsers.find(
      (u) =>
        (method === "email" && u.email === identifier) ||
        (method === "number" && u.phone === identifier)
    );

    if (existingUser) {
      toast.success("Login successful");
      onSuccess(existingUser, "user");
      handleClose();
    } else {
      if (method === "email") setRegEmail(identifier);
      if (method === "number") setRegPhone(identifier);
      setStep("register");
    }

    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!firstName || !lastName) {
      toast.error("Enter name");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newUser = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      email: regEmail || undefined,
      phone: regPhone || undefined,
    };

    mockUsers.push(newUser);
    toast.success("Account created");
    onSuccess(newUser, "user");
    handleClose();
    setIsLoading(false);
  };

  const handleBack = () => {
    if (step === "identifier") setStep("method");
    else if (step === "otp") setStep("identifier");
    else if (step === "register") setStep("otp");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== "method" && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft size={16} />
              </Button>
            )}
            <div>
              <DialogTitle>
                {step === "method" && "Welcome"}
                {step === "identifier" && "Enter Details"}
                {step === "otp" && "Verify OTP"}
                {step === "register" && "Register"}
              </DialogTitle>
              <DialogDescription>
                {step === "method" && "Choose login method"}
                {step === "identifier" && "Enter email or phone"}
                {step === "otp" && "Enter OTP"}
                {step === "register" && "Complete registration"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === "method" && (
          <div className="space-y-3">
            <Button onClick={() => handleMethodSelect("email")} className="w-full">
              <Mail className="mr-2" /> Email
            </Button>
            <Button onClick={() => handleMethodSelect("number")} className="w-full">
              <Phone className="mr-2" /> Phone
            </Button>
            <Button onClick={() => handleMethodSelect("google")} className="w-full">
              <Chrome className="mr-2" /> Google
            </Button>
          </div>
        )}

        {step === "identifier" && (
          <>
            <Label>Enter value</Label>
            <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            <Button onClick={handleSendOtp} className="w-full">
              Send OTP
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <Label>OTP</Label>
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button onClick={handleVerifyOtp} className="w-full">
              Verify
            </Button>
          </>
        )}

        {step === "register" && (
          <>
            <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <Button onClick={handleRegister} className="w-full">
              Register
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}