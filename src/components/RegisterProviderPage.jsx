import React, { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Checkbox } from './ui/checkbox.jsx';
import { Progress } from './ui/progress.jsx';
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  CheckCircle,
  DollarSign,
  MapPin,
  Clock
} from 'lucide-react';
import { skills } from '../data/mockData.js';

export function RegisterProviderPage({ onNavigate, onBack }) {
  const [currentStep, setCurrentStep] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: '',
    description: '',
    experience: '',
    serviceArea: '',
    phone: '',

    // Skills
    selectedSkills: [],
    customSkills: [],

    // Pricing
    pricing: {},

    // Verification
    documents: [],
    agreeToTerms: false,
    agreeToBackground: false
  });

  const getStepProgress = () => {
    switch (currentStep) {
      case 'basic': return 20;
      case 'skills': return 40;
      case 'pricing': return 60;
      case 'verification': return 80;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const steps = [
    { id: 'basic', title: 'Basic Information', description: 'Tell us about yourself' },
    { id: 'skills', title: 'Skills & Services', description: 'What services do you offer?' },
    { id: 'pricing', title: 'Pricing', description: 'Set your hourly rates' },
    { id: 'verification', title: 'Verification', description: 'Upload documents and agree to terms' },
    { id: 'complete', title: 'Complete', description: 'All done!' }
  ];

  const handleNext = () => {
    const stepOrder = ['basic', 'skills', 'pricing', 'verification', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder = ['basic', 'skills', 'pricing', 'verification', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSkillToggle = (skillName) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillName)
        ? prev.selectedSkills.filter(s => s !== skillName)
        : [...prev.selectedSkills, skillName]
    }));
  };

  const addCustomSkill = (skillName) => {
    if (skillName.trim() && !formData.customSkills.includes(skillName.trim())) {
      setFormData(prev => ({
        ...prev,
        customSkills: [...prev.customSkills, skillName.trim()]
      }));
    }
  };

  const removeCustomSkill = (skillName) => {
    setFormData(prev => ({ ...prev, customSkills: prev.customSkills.filter(s => s !== skillName) }));
  };

  const setPricing = (skill, price) => {
    setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, [skill]: price } }));
  };

  const allSelectedSkills = [...formData.selectedSkills, ...formData.customSkills];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="font-semibold">Become a Provider</h1>
          </div>
          
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <Progress value={getStepProgress()} className="mb-4" />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">
              {steps.find(s => s.id === currentStep)?.title}
            </h2>
            <p className="text-muted-foreground">
              {steps.find(s => s.id === currentStep)?.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'basic' && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business/Professional Name *
                </label>
                <Input
                  placeholder="e.g., Mike's Electrical Services"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Professional Description *
                </label>
                <Textarea
                  placeholder="Describe your experience, qualifications, and what makes you unique..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Years of Experience *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-3 border border-border rounded-md bg-background"
                >
                  <option value="">Select experience level</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Area *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., Manhattan, Brooklyn (within 10 miles)"
                    value={formData.serviceArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceArea: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Phone *
                </label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'skills' && (
          <Card>
            <CardHeader>
              <CardTitle>Skills & Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Select Your Skills</h4>
                <div className="grid grid-cols-2 gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.selectedSkills.includes(skill.name)
                          ? 'border-[var(--primary-gradient-start)] bg-[var(--primary-gradient-start)]/5'
                          : 'border-border hover:border-[var(--primary-gradient-start)]/50'
                      }`}
                      onClick={() => handleSkillToggle(skill.name)}
                    >
                      <div className="text-xl mb-1">{skill.icon}</div>
                      <div className="font-medium text-sm">{skill.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Add Custom Skills</h4>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Enter a custom skill"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addCustomSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input');
                      if (input) {
                        addCustomSkill(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.customSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.customSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeCustomSkill(skill)}
                      >
                        {skill}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Selected Skills ({allSelectedSkills.length})</h5>
                {allSelectedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allSelectedSkills.map((skill) => (
                      <Badge key={skill} className="bg-[var(--primary-gradient-start)] text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No skills selected yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'pricing' && (
          <Card>
            <CardHeader>
              <CardTitle>Set Your Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">💡 Pricing Tips</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Research competitive rates in your area</li>
                  <li>• Consider your experience level and expertise</li>
                  <li>• You can adjust these rates later</li>
                </ul>
              </div>

              {allSelectedSkills.length > 0 ? (
                <div className="space-y-4">
                  {allSelectedSkills.map((skill) => (
                    <div key={skill} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{skill}</h4>
                        <p className="text-sm text-muted-foreground">Hourly rate</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.pricing[skill] || ''}
                          onChange={(e) => setPricing(skill, Number(e.target.value))}
                          className="w-20 text-right"
                        />
                        <span className="text-sm text-muted-foreground">/hr</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Please select skills in the previous step to set pricing.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 'verification' && (
          <Card>
            <CardHeader>
              <CardTitle>Verification & Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Upload Documents (Optional)</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload certifications, licenses, or other relevant documents to build trust with customers.
                </p>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))
                    }
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the <a href="#" className="text-[var(--primary-gradient-start)] underline">Terms of Service</a> and 
                    <a href="#" className="text-[var(--primary-gradient-start)] underline"> Privacy Policy</a>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="background"
                    checked={formData.agreeToBackground}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agreeToBackground: !!checked }))
                    }
                  />
                  <label htmlFor="background" className="text-sm leading-relaxed">
                    I consent to a background check (required for all providers)
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">🛡️ Safety & Trust</h5>
                <p className="text-sm text-muted-foreground">
                  All providers go through verification including background checks, identity verification, 
                  and skill validation to ensure customer safety.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'complete' && (
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground mb-6">
                Thank you for applying to become a SkillHub provider. We'll review your application 
                and get back to you within 2-3 business days.
              </p>

              <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-2">What's Next?</h4>
                <ul className="text-sm text-muted-foreground text-left space-y-1">
                  <li>• We'll verify your documents and background</li>
                  <li>• You'll receive an email with your approval status</li>
                  <li>• Once approved, you can start receiving bookings</li>
                  <li>• Set up your calendar and availability</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => onNavigate('profile')}
                  className="w-full bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white"
                  size="lg"
                >
                  Go to Profile
                </Button>
                <Button variant="outline" className="w-full">
                  Application Status
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {currentStep !== 'complete' && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 'basic'}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white"
              disabled={
                (currentStep === 'basic' && !formData.businessName) ||
                (currentStep === 'skills' && allSelectedSkills.length === 0) ||
                (currentStep === 'verification' && (!formData.agreeToTerms || !formData.agreeToBackground))
              }
            >
              {currentStep === 'verification' ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
