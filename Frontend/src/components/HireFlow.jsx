import React, { useState } from 'react';
import Navigation from './Navigation';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard,
  Shield,
  CheckCircle,
  Star
} from 'lucide-react';
import { getProviderById } from '../data/mockData';

export default function HireFlow({ providerId, onComplete, onBack, user }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const provider = providerId ? getProviderById(providerId) : null;

  const [bookingData, setBookingData] = useState({
    service: '',
    description: '',
    date: '',
    time: '',
    duration: '1',
    address: '',
    phone: '',
    urgency: 'normal'
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 2000);
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-background authenticated-page">
        <Navigation
          onNavigate={() => {}}
          user={user}
          isAuthenticated={!!user}
          currentPage="hire-flow"
        />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Provider not found</p>
            <Button onClick={onBack}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  const estimatedCost =
    parseInt(bookingData.duration || '0', 10) * (provider.hourlyRate || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br pb-18 from-background via-surface/30 to-background authenticated-page">
      <Navigation
        onNavigate={() => {}}
        user={user}
        isAuthenticated={!!user}
        currentPage="hire-flow"
      />

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack}>
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
                      ? 'bg-[var(--primary-gradient-start)] border-[var(--primary-gradient-start)] text-white'
                      : 'border-border text-muted-foreground'
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
                        ? 'bg-[var(--primary-gradient-start)]'
                        : 'bg-border'
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
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Service Details</h2>
                      <p className="text-muted-foreground">
                        Tell us what you need help with
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service">Select Service</Label>
                        <select
                          id="service"
                          className="w-full mt-2 p-3 border border-border/40 rounded-lg bg-input-background focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                          value={bookingData.service}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              service: e.target.value
                            })
                          }
                        >
                          <option value="">Choose a service...</option>
                          {(provider.skills || []).map((skill) => (
                            <option key={skill} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what you need done..."
                          value={bookingData.description}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              description: e.target.value
                            })
                          }
                          className="min-h-[100px] mt-2 bg-input-background border-border/40 focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="urgency">Urgency</Label>
                        <select
                          id="urgency"
                          className="w-full mt-2 p-3 border border-border/40 rounded-lg bg-input-background focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                          value={bookingData.urgency}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              urgency: e.target.value
                            })
                          }
                        >
                          <option value="normal">
                            Normal (within 24-48 hours)
                          </option>
                          <option value="urgent">
                            Urgent (within 6-12 hours)
                          </option>
                          <option value="emergency">
                            Emergency (ASAP)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Schedule & Location
                      </h2>
                      <p className="text-muted-foreground">
                        When and where do you need the service?
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              date: e.target.value
                            })
                          }
                          className="bg-input-background mt-2 border-border/40 focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={bookingData.time}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              time: e.target.value
                            })
                          }
                          className="bg-input-background mt-2 border-border/40 focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duration">
                        Estimated Duration (hours)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="8"
                        value={bookingData.duration}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            duration: e.target.value
                          })
                        }
                        className="bg-input-background mt-2 border-border/40 focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Service Address</Label>
                      <Textarea
                        id="address"
                        value={bookingData.address}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            address: e.target.value
                          })
                        }
                        className="bg-input-background mt-2 border-border/40 focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            phone: e.target.value
                          })
                        }
                        className="bg-input-background mt-2 border-border/40 focus:border-[var(--primary-gradient-start)]/50 focus:ring-[var(--primary-gradient-start)]/20"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Review & Payment</h2>

                    <Card className="p-4 bg-surface/50 border-border/40">
                      <div className="flex justify-between font-semibold">
                        <span>Estimated Total:</span>
                        <span>${estimatedCost}</span>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Footer Buttons */}
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
                        className="bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white"
                      >
                        {isLoading
                          ? 'Processing...'
                          : `Book Service - $${estimatedCost}`}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="p-6 bg-card border-2 border-border/40 shadow-lg sticky top-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={provider.avatar} />
                    <AvatarFallback>
                      {provider.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{provider.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {provider.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({provider.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hourly Rate</span>
                    <span>${provider.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span>{provider.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance</span>
                    <span>{provider.distance}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
