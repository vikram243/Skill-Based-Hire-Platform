import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, CreditCard, Shield, CheckCircle, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../lib/axiosSetup";
import { useSelector } from "react-redux";

export default function HireFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [provider, setProvider] = useState(null);
  const [isProviderLoading, setIsProviderLoading] = useState(true);
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const number = user?.number || "";
  const service = provider?.data?.profile?.skill?.name || "";

  useEffect(() => {
    if (provider?.name) {
      document.title = `${provider.name} | SkillHub`;
    }
  }, [provider]);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setIsProviderLoading(true);
        setErrorMessage("");

        const res = await api.post(`/api/providers/${providerId}`);
        setProvider(res.data);
      } catch (error) {
        console.error("Error fetching provider:", error);

        const message =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";

        setErrorMessage(message);
        setProvider(null);
      } finally {
        setIsProviderLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  useEffect(() => {
    if (service) {
      setBookingData((prev) => ({
        ...prev,
        service: service,
      }));
    }
    if (number) {
      setBookingData((prev) => ({
        ...prev,
        phone: number,
      }));
    }
  }, [service, number]);

  const [bookingData, setBookingData] = useState({
    service: "",
    description: "",
    address: "",
    phone: "",
    urgency: "normal",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  if (!provider) {
    if (isProviderLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-surface/30 to-background authenticated-page">
          <div className="py-24 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-blue-200 rounded-full animate-spin"></div>
            </div>
            <p className="text-muted-foreground font-medium">
              Loading provider...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-100 flex items-center justify-center bg-linear-to-br from-background via-surface/30 to-background authenticated-page px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Icon Circle */}
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100 border border-red-200 shadow-md">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground mt-2">
              {errorMessage ||
                "The provider you are trying to reach is not available right now."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-6"
            >
              Go Back
            </Button>

            <Button
              onClick={() => window.location.reload()}
              className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white px-6"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const estimatedCost =
    parseInt(bookingData?.duration) * provider?.data?.profile?.hourly_rate;

  return (
    <div className="min-h-screen bg-linear-to-br pb-18 from-background via-surface/30 to-background authenticated-page">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step <= currentStep
                      ? "bg-(--primary-gradient-start) border-(--primary-gradient-start) text-white"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      step < currentStep
                        ? "bg-(--primary-gradient-start)"
                        : "bg-border"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-card border-2 border-border/40 shadow-lg">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Service Details
                      </h2>
                      <p className="text-muted-foreground">
                        Tell us what you need help with
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service">Selected Service</Label>
                        <Input
                          id="service"
                          className="w-full mt-2 p-3 border border-border rounded-lg bg-input-background focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                          value={bookingData.service}
                          disabled
                        ></Input>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what you need and what's the issue is..."
                          value={bookingData.description}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              description: e.target.value,
                            })
                          }
                          className="min-h-25 mt-2 bg-input-background border-border focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="urgency">Urgency</Label>
                        <select
                          id="urgency"
                          className="w-full mt-2 p-3 border border-border/40 rounded-lg bg-input-background focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                          value={bookingData.urgency}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              urgency: e.target.value,
                            })
                          }
                        >
                          <option value="normal">
                            Normal (within 30-40min)
                          </option>
                          <option value="emergency">
                            Emergency (ASAP within 10min)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Location & Contact
                      </h2>
                      <p className="text-muted-foreground">
                        where do you need the service?
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="address">Service Address</Label>
                      <p className="text-xs text-muted-foreground">
                        (If you wanna change address please choose from location
                        panel)
                      </p>
                      <Input
                        id="address"
                        value={user?.location?.address}
                        disabled
                        className="bg-input-background mt-2 border-border focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={bookingData?.phone}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            phone: e.target.value,
                          })
                        }
                        className="bg-input-background mt-2 border-border/40 focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Review & Payment
                      </h2>
                      <p className="text-muted-foreground">
                        Review your booking details and complete payment
                      </p>
                    </div>

                    <Card className="p-4 bg-surface/50 border-border/40">
                      <h3 className="font-semibold mb-3">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Service:
                          </span>
                          <span>{bookingData?.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Urgency:
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {bookingData?.urgency}
                          </Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Estimated Total:</span>
                          <span>₹{estimatedCost}</span>
                        </div>
                      </div>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Payment Method</h3>
                      <Card className="p-4 border-(--primary-gradient-start)/30 bg-(--primary-gradient-start)/5">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-(--primary-gradient-start)" />
                          <div>
                            <p className="font-medium">
                              Credit Card ending in 4242
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/25
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="flex items-start space-x-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <Shield className="w-5 h-5 text-accent mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-accent">
                          Payment Protection
                        </p>
                        <p className="text-muted-foreground">
                          Your payment is held securely until the job is
                          completed to your satisfaction.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-border/30">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                  )}

                  <div className="ml-auto">
                    {currentStep < 3 ? (
                      <Button
                        onClick={handleNext}
                        className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                        disabled={
                          (currentStep === 1 && !bookingData?.description) ||
                          (currentStep === 2 && !bookingData?.phone)
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                      >
                        {isLoading
                          ? "Processing..."
                          : `Book Service - ₹${estimatedCost}`}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Provider Card */}
              <Card className="p-6 bg-card border-2 border-border/40 shadow-lg sticky top-22">
                <div className="flex items-center space-x-3 ">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={provider?.data?.profile?.avatar}
                      alt={provider?.data?.profile?.full_name}
                    />
                    <AvatarFallback className="bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white">
                      {provider?.data?.profile?.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {provider?.data?.profile?.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({provider?.data?.profile?.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-semibold">
                  {provider?.data?.profile?.full_name}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-medium">
                      ₹{provider?.data?.profile?.price?.rate}/
                      {provider?.data?.profile?.price?.type === "hourly"
                        ? "hr"
                        : provider?.data?.profile?.price?.type === "perday"
                          ? "day"
                          : "job"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Response Time:
                    </span>
                    <span className="font-medium">
                      {provider?.data?.profile?.responseTime || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">
                      {provider?.data?.profile?.distance}
                    </span>
                  </div>
                </div>

                {estimatedCost > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Estimated Cost
                      </p>
                      <p className="text-2xl font-bold text-(--primary-gradient-start)">
                        ₹{estimatedCost}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Based on {bookingData?.duration} hour(s)
                      </p>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
