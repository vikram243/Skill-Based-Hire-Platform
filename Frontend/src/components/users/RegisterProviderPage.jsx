import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Textarea } from "../ui/textarea.jsx";
import { Badge } from "../ui/badge.jsx";
import { Checkbox } from "../ui/checkbox.jsx";
import { Progress } from "../ui/progress.jsx";
import Dropzone from "./DropZone.jsx";
import api from "../../lib/axiosSetup.js";
import { updateIsAttampted } from "../../slices/userSlice.js";
import { useDispatch } from "react-redux";
import {
  providerBasicSchema,
  providerLocationSchema,
  providerSkillsSchema,
  providerPricingSchema,
  providerVerificationSchema,
  providerFullSchema,
  firstZodError,
} from "../../lib/schemas.js";
import {
  Upload,
  Plus,
  X,
  CheckCircle,
  DollarSign,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function RegisterProviderPanel({ isOpen, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState("basic");
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.user);
  const number = user?.number || "";
  const fullName = user?.fullName || "";
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/api/skills/getAllSkills");
        setSkills(res.data.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    if (number) {
      setFormData((prev) => ({
        ...prev,
        contactPhone: number,
      }));
    }
  }, [number]);

  useEffect(() => {
    if (fullName) {
      setFormData((prev) => ({
        ...prev,
        businessName: fullName,
      }));
    }
  }, [fullName]);

  const [formData, setFormData] = useState({
    // Basic Info
    businessName: "",
    professionalDescription: "",
    yearsExperience: "",
    contactPhone: "",
    serviceArea: {
      city: user?.location?.city || "",
      state: user?.location?.state || "",
      pincode: user?.location?.pin || "",
      country: user?.location?.country || "India",
      fullAddress: user?.location?.address || "",
    },
    selectedSkill: null,
    pricing: {
      rateType: "hourly",
      serviceRate: "",
    },
    emergencyService: false,
    documents: [],
    agreedToTOS: false,
    consentBackgroundCheck: false,
  });
  const [formError, setFormError] = useState("");

  const getStepProgress = () => {
    switch (currentStep) {
      case "basic":
        return 14;
      case "location":
        return 28;
      case "skills":
        return 42;
      case "pricing":
        return 56;
      case "availability":
        return 70;
      case "verification":
        return 85;
      case "complete":
        return 100;
      default:
        return 0;
    }
  };

  const steps = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Tell us about your professional background",
    },
    {
      id: "location",
      title: "Service Area",
      description: "Where do you provide services?",
    },
    {
      id: "skills",
      title: "Skills & Services",
      description: "What services do you offer?",
    },
    {
      id: "pricing",
      title: "Pricing",
      description: "Set your competitive rates",
    },
    {
      id: "verification",
      title: "Verification",
      description: "Final step - agree to terms",
    },
    {
      id: "complete",
      title: "Complete",
      description: "Application submitted!",
    },
  ];

  const handleClose = () => {
    setCurrentStep("basic");
    onClose();
  };

  const handleNext = async () => {
    const stepOrder = [
      "basic",
      "location",
      "skills",
      "pricing",
      "verification",
      "complete",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);

    setFormError("");

    // Validate current step using zod schemas and show zod messages
    if (currentStep === "basic") {
      // normalize yearsExperience to number
      const y =
        typeof formData.yearsExperience === "number"
          ? formData.yearsExperience
          : Number(formData.yearsExperience || 0);
      const parsed = providerBasicSchema.safeParse({
        businessName: formData.businessName,
        professionalDescription: formData.professionalDescription,
        yearsExperience: y,
        contactPhone: formData.contactPhone,
      });
      if (!parsed.success) {
        setFormError(firstZodError(parsed.error));
        return;
      }
    }

    if (currentStep === "location") {
      const parsed = providerLocationSchema.safeParse({
        serviceArea: formData.serviceArea,
      });
      if (!parsed.success) {
        setFormError(firstZodError(parsed.error));
        return;
      }
    }

    if (currentStep === "skills") {
      const parsed = providerSkillsSchema.safeParse({
        selectedSkill: formData.selectedSkill,
      });
      if (!parsed.success) {
        setFormError(firstZodError(parsed.error));
        return;
      }
    }

    if (currentStep === "pricing") {
      if (!formData.selectedSkill) {
        setFormError("Please select a skill first");
        return;
      }

      const parsed = providerPricingSchema.safeParse({
        pricing: {
          skill: formData.selectedSkill,
          rateType: formData.pricing.rateType,
          serviceRate: Number(formData.pricing.serviceRate),
        },
      });

      if (!parsed.success) {
        setFormError(firstZodError(parsed.error));
        return;
      }
    }

    if (currentStep === "verification") {
      // validate verification consents
      const ver = providerVerificationSchema.safeParse({
        agreedToTOS: formData.agreedToTOS,
        consentBackgroundCheck: formData.consentBackgroundCheck,
      });
      if (!ver.success) {
        setFormError(firstZodError(ver.error));
        return;
      }
      setIsSubmitting(true);
      // validate full payload at high level
      const full = providerFullSchema.safeParse({
        businessName: formData.businessName,
        professionalDescription: formData.professionalDescription,
        yearsExperience: Number(formData.yearsExperience || 0),
        contactPhone: formData.contactPhone,
        serviceArea: formData.serviceArea,
        selectedSkill: formData.selectedSkill,
        pricing: {
          skill: formData.selectedSkill,
          rateType: formData.pricing.rateType,
          serviceRate: Number(formData.pricing.serviceRate),
        },
        agreedToTOS: formData.agreedToTOS,
        consentBackgroundCheck: formData.consentBackgroundCheck,
      });
      if (!full.success) {
        setFormError(firstZodError(full.error));
        return;
      }
      try {
        const data = new FormData();
        data.append("businessName", formData.businessName);
        data.append(
          "professionalDescription",
          formData.professionalDescription,
        );
        data.append("yearsExperience", formData.yearsExperience);
        data.append("contactPhone", formData.contactPhone);
        data.append("pricing", JSON.stringify(formData.pricing));
        data.append("agreedToTOS", formData.agreedToTOS);
        data.append("consentBackgroundCheck", formData.consentBackgroundCheck);
        data.append("selectedSkill", String(formData.selectedSkill?.skillId || ""));
        formData.documents.forEach((file) => {
          data.append("documents", file);
        });

        const resp = await api.post("/api/providers/onboardProvider", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (resp && resp.status >= 200 && resp.status < 300) {
          setCurrentStep("complete");
          dispatch(updateIsAttampted());
        } else {
          setFormError("Application submission failed. Please try again.");
        }
      } catch (error) {
        console.error(error);
        const message = error?.response?.data?.message || "Upload failed";
        setFormError(message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder = [
      "basic",
      "location",
      "skills",
      "pricing",
      "verification",
      "complete",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSkillSelect = (skillName, skillId) => {
    const skillEntry = {
      skillId: skillId || null,
      name: skillName,
      isCustom: false,
    };

    setFormData((prev) => ({
      ...prev,
      selectedSkill: skillEntry,
    }));
  };

  const setPricing = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value,
      },
    }));
  };

  const selectedSkill = formData.selectedSkill;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl h-[85vh] flex flex-col backdrop-blur-xl bg-linear-to-br from-card/95 to-purple-50/30 dark:to-purple-950/20 border-2 border-purple-200/40 dark:border-purple-800/40 shadow-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <DialogTitle className="bg-linear-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent text-xl flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Become a Provider
              </DialogTitle>
              <DialogDescription>
                {steps.find((s) => s.id === currentStep)?.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        {currentStep !== "complete" && (
          <div className="px-6 pt-4 pb-2 shrink-0">
            <Progress
              value={getStepProgress()}
              className="h-2 bg-purple-100 dark:bg-purple-950"
            />
            <div className="text-center mt-2">
              <p className="text-sm font-medium bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {steps.find((s) => s.id === currentStep)?.title}
              </p>
            </div>
            {formError && (
              <div className="text-red-500 text-sm rounded">{formError}</div>
            )}
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Step: Basic Information */}
            {currentStep === "basic" && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-muted-foreground">
                    ✨ Start your journey as a SkillHub provider. Share your
                    expertise with customers in your area.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business/Professional Name *
                  </label>
                  <Input
                    placeholder="e.g., Mike's Electrical Services"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Professional Description *
                  </label>
                  <Textarea
                    placeholder="Describe your experience, qualifications, and what makes you unique..."
                    value={formData.professionalDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        professionalDescription: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Years of Experience *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="49"
                      placeholder="e.g., 5"
                      value={formData.yearsExperience}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setFormData((prev) => ({
                            ...prev,
                            yearsExperience: "",
                          }));
                        } else {
                          const n = Math.min(Number(val), 49);
                          setFormData((prev) => ({
                            ...prev,
                            yearsExperience: n,
                          }));
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contact Phone *
                    </label>
                    <Input
                      placeholder="+91 98765 43210"
                      maxLength={15}
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactPhone: e.target.value.slice(0, 15),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step: Service Area */}
            {currentStep === "location" && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-muted-foreground">
                    📍 Define your service area to help customers find you
                    easily.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <Input
                      placeholder="e.g., Mumbai"
                      value={formData.serviceArea.city}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State *
                    </label>
                    <Input
                      placeholder="e.g., Maharashtra"
                      value={formData.serviceArea.state}
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pincode
                    </label>
                    <Input
                      placeholder="e.g., 400001"
                      maxLength={20}
                      value={formData.serviceArea.pincode}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Country
                    </label>
                    <Input
                      placeholder="India"
                      value={formData.serviceArea.country}
                      disabled
                    ></Input>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Address
                  </label>
                  <Input
                    placeholder="Bhopal, Madhya Pradesh, India"
                    value={formData.serviceArea.fullAddress}
                    disabled
                  ></Input>
                </div>

                <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                    💡 Location Tip
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    We'll use this information to show you to customers in your
                    service area. You can adjust your location anytime from
                    location picker option.
                  </p>
                </div>
              </div>
            )}

            {/* Step: Skills */}
            {currentStep === "skills" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Select Your Skills</h4>
                  <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2">
                    {skills?.map((skill) => (
                      <div
                        key={skill?._id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.selectedSkill?.name === skill?.name
                            ? "border-purple-500 bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 shadow-md"
                            : "border-border hover:border-purple-300 dark:hover:border-purple-700"
                          }`}
                        onClick={() => handleSkillSelect(skill?.name, skill?._id)}
                      >
                        <div className="text-xl mb-1">{skill?.icon}</div>
                        <div className="font-medium text-sm">{skill?.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h5 className="font-medium mb-2 text-purple-900 dark:text-purple-100">
                    Selected Skill
                  </h5>
                  {selectedSkill ? (
                    <Badge className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
                      {selectedSkill.name}
                    </Badge>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No skill selected yet
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step: Pricing */}
            {currentStep === "pricing" && (
              <div className="space-y-4">
                {/* Tips */}
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h5 className="font-medium mb-2">💡 Pricing Tips</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Research competitive rates in your area</li>
                    <li>• Consider your experience level and expertise</li>
                    <li>• You can adjust these rates anytime later</li>
                  </ul>
                </div>

                {/* Pricing Card */}
                {!selectedSkill ? (
                  <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                    Please select a skill first.
                  </div>
                ) : (
                  <div
                    className="p-5 border-2 border-purple-200 dark:border-purple-800 rounded-xl
        bg-linear-to-r from-white to-purple-50/60
        dark:from-card dark:to-purple-950/20
        shadow-md transition-all duration-300"
                  >
                    {/* Skill Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-semibold text-lg text-purple-700 dark:text-purple-300">
                        {selectedSkill.name}
                      </h4>

                      <Badge className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
                        Selected
                      </Badge>
                    </div>

                    {/* Rate Type + Price */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Rate Type */}
                      <div>
                        <label className="block text-xs font-medium mb-1 text-muted-foreground">
                          Rate Type
                        </label>

                        <select
                          value={formData.pricing.rateType}
                          onChange={(e) =>
                            setPricing("rateType", e.target.value)
                          }
                          className="w-full p-2 border border-purple-300 dark:border-purple-700
              rounded-md bg-background text-sm
              focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="perJob">Per Job</option>
                          <option value="daily">Daily</option>
                        </select>
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-xs font-medium mb-1 text-muted-foreground">
                          Service Rate
                        </label>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-purple-600" />

                          <Input
                            type="number"
                            placeholder="0"
                            value={formData.pricing.serviceRate}
                            onChange={(e) =>
                              setPricing("serviceRate", e.target.value)
                            }
                            className="text-right border-purple-300 dark:border-purple-700 focus-visible:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step: Verification */}
            {currentStep === "verification" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Upload Documents</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload certifications, licenses, or other relevant documents
                    to build trust.
                  </p>
                  <Dropzone setFormData={setFormData} formData={formData} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTOS}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreedToTOS: !!checked,
                        }))
                      }
                      className="border-purple-400 data-[state=checked]:bg-purple-600"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-purple-600 dark:text-purple-400 underline font-medium"
                      >
                        Terms of Service
                      </a>{" "}
                      and
                      <a
                        href="#"
                        className="text-purple-600 dark:text-purple-400 underline font-medium"
                      >
                        {" "}
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <Checkbox
                      id="background"
                      checked={formData.consentBackgroundCheck}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          consentBackgroundCheck: !!checked,
                        }))
                      }
                      className="border-purple-400 data-[state=checked]:bg-purple-600"
                    />
                    <label
                      htmlFor="background"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I consent to a background check (required for all
                      providers)
                    </label>
                  </div>
                </div>

                <div className="bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h5 className="font-medium mb-2">🛡️ Safety & Trust</h5>
                  <p className="text-sm text-muted-foreground">
                    All providers go through verification including background
                    checks, identity verification, and skill validation to
                    ensure customer safety.
                  </p>
                </div>
              </div>
            )}

            {/* Step: Complete */}
            {currentStep === "complete" && (
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Application Submitted!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for applying to become a SkillHub provider. We'll
                  review your application and get back to you within 2-3
                  business days.
                </p>

                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg p-4 mb-6 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium mb-3 text-purple-900 dark:text-purple-100">
                    What's Next?
                  </h4>
                  <ul className="text-sm text-muted-foreground text-left space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      We'll verify your documents and background
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      You'll receive an email with your approval status
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Once approved, you can start receiving bookings
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Set up your calendar and availability
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => {
                    if (onSuccess) onSuccess();
                    handleClose();
                  }}
                  className="w-full bg-linear-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white shadow-lg"
                  size="lg"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentStep !== "complete" && (
          <div className="flex justify-between px-6 py-4 border-t border-purple-200 dark:border-purple-800 shrink-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === "basic"}
              className="border-purple-300 dark:border-purple-700"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (currentStep === "basic" && !formData.businessName) ||
                (currentStep === "location" &&
                  (!formData.serviceArea.city ||
                    !formData.serviceArea.state)) ||
                (currentStep === "skills" && !selectedSkill) ||
                (currentStep === 'pricing' && Number(formData.pricing.serviceRate) <= 0) ||
                (currentStep === "verification" &&
                  (!formData.agreedToTOS || !formData.consentBackgroundCheck))
              }
              className="bg-linear-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-md flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : currentStep === "verification" ? (
                "Submit Application"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
