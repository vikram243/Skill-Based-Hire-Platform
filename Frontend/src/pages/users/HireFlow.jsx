import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle,
  Star
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../lib/axiosSetup'

export default function HireFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState();
  const { providerId } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProvider = async () => {
      const res = await api.post(`/api/providers/${providerId}`);
      setProvider(res.data);
    };
    fetchProvider();
  }, [providerId]);

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
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-surface/30 to-background authenticated-page">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Provider not found</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  const estimatedCost = parseInt(bookingData?.duration) * provider?.data?.profile?.hourly_rate;

  return (
    <div className="min-h-screen bg-linear-to-br pb-18 from-background via-surface/30 to-background authenticated-page">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step <= currentStep
                  ? 'bg-(--primary-gradient-start) border-(--primary-gradient-start) text-white'
                  : 'border-border text-muted-foreground'
                  }`}>
                  {step < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? 'bg-(--primary-gradient-start)' : 'bg-border'
                    }`} />
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
                      <h2 className="text-2xl font-bold mb-2">Service Details</h2>
                      <p className="text-muted-foreground">Tell us what you need help with</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service">Select Service</Label>
                        <select
                          id="service"
                          className="w-full mt-2 p-3 border border-border/40 rounded-lg bg-input-background focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                          value={bookingData?.service}
                          onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                        >
                          <option value="">Choose a service...</option>
                          {provider?.data?.skills?.map((skill) => (
                            <option key={skill?.name} value={skill?.name}>{skill?.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what you need done..."
                          value={bookingData.description}
                          onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                          className="min-h-25 mt-2 bg-input-background border-border/40 focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="urgency">Urgency</Label>
                        <select
                          id="urgency"
                          className="w-full mt-2 p-3 border border-border/40 rounded-lg bg-input-background focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                          value={bookingData.urgency}
                          onChange={(e) => setBookingData({ ...bookingData, urgency: e.target.value })}
                        >
                          <option value="normal">Normal (within 24-48 hours)</option>
                          <option value="urgent">Urgent (within 6-12 hours)</option>
                          <option value="emergency">Emergency (ASAP)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Schedule & Location</h2>
                      <p className="text-muted-foreground">When and where do you need the service?</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                          className="bg-input-background mt-2 border-border/40 focus:border-(--primary-gradient-start/50 focus:ring-(--primary-gradient-start)/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={bookingData.time}
                          onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          className="bg-input-background mt-2 border-border/40 focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duration">Estimated Duration (hours)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="8"
                        value={bookingData.duration}
                        onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                        className="bg-input-background mt-2 border-border/40 focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Service Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter the full address where service is needed..."
                        value={bookingData.address}
                        onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                        className="bg-input-background mt-2 border-border/40 focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="bg-input-background mt-2 border-border/40 focus:border-(--primary-gradient-start)/50 focus:ring-(--primary-gradient-start)/20"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Review & Payment</h2>
                      <p className="text-muted-foreground">Review your booking details and complete payment</p>
                    </div>

                    <Card className="p-4 bg-surface/50 border-border/40">
                      <h3 className="font-semibold mb-3">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service:</span>
                          <span>{bookingData?.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date & Time:</span>
                          <span>{bookingData?.date} at {bookingData?.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{bookingData?.duration} hour(s)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Urgency:</span>
                          <Badge variant="outline" className="text-xs">
                            {bookingData?.urgency}
                          </Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Estimated Total:</span>
                          <span>${estimatedCost}</span>
                        </div>
                      </div>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Payment Method</h3>
                      <Card className="p-4 border-(--primary-gradient-start)/30 bg-(--primary-gradient-start)/5">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-(--primary-gradient-start)" />
                          <div>
                            <p className="font-medium">Credit Card ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="flex items-start space-x-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <Shield className="w-5 h-5 text-accent mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-accent">Payment Protection</p>
                        <p className="text-muted-foreground">Your payment is held securely until the job is completed to your satisfaction.</p>
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
                          (currentStep === 1 && (!bookingData?.service || !bookingData?.description)) ||
                          (currentStep === 2 && (!bookingData?.date || !bookingData?.time || !bookingData?.address || !bookingData?.phone))
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
                        {isLoading ? 'Processing...' : `Book Service - $${estimatedCost}`}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Provider Card */}
              <Card className="p-6 bg-card border-2 border-border/40 shadow-lg sticky top-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={provider?.profile?.avatar} alt={provider?.profile?.full_name} />
                    <AvatarFallback className="bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white">
                      {provider?.profile?.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{provider?.profile?.full_name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{provider?.profile?.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider?.profile?.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hourly Rate:</span>
                    <span className="font-medium">${provider?.profile?.hourly_rate}/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="font-medium">{provider?.profile?.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">{provider?.profile?.distance}</span>
                  </div>
                </div>

                {estimatedCost > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                      <p className="text-2xl font-bold text-(--primary-gradient-start)">${estimatedCost}</p>
                      <p className="text-xs text-muted-foreground">Based on {bookingData?.duration} hour(s)</p>
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