import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import Dropzone from './DropZone';
import api from '../lib/axiosSetup';
import {
  Upload,
  Plus,
  X,
  CheckCircle,
  DollarSign,
  MapPin,
  Briefcase,
  Clock,
  Calendar
} from 'lucide-react';
import { Skills } from '../data/mockData';

export default function RegisterProviderPanel({ isOpen, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: '',
    professionalDescription: '',
    yearsExperience: '',
    contactPhone: '',
    serviceArea: {
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      geo: {
        type: 'Point',
        coordinates: [0, 0]
      },
    },
    selectedSkills: [],
    customSkills: [],
    pricing: [],
    emergencyService: false,
    documents: [],
    agreedToTOS: false,
    consentBackgroundCheck: false
  });
  const [formError, setFormError] = useState('');

  const countries = ['India', 'United States', 'United Kingdom', 'All Countries'];
  const cityOptions = {
    India: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'],
    'United States': ['New York', 'Los Angeles', 'Chicago'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham']
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation is not supported by your browser');
      setTimeout(() => setFormError(''), 4000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({
          ...prev,
          serviceArea: {
            ...prev.serviceArea,
            geo: { type: 'Point', coordinates: [longitude, latitude] }
          }
        }));
        setFormError('Location detected');
        setTimeout(() => setFormError(''), 3000);
      },
      (err) => {
        setFormError('Unable to retrieve your location');
        setTimeout(() => setFormError(''), 4000);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'basic': return 14;
      case 'location': return 28;
      case 'skills': return 42;
      case 'pricing': return 56;
      case 'availability': return 70;
      case 'verification': return 85;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const steps = [
    { id: 'basic', title: 'Basic Information', description: 'Tell us about your professional background' },
    { id: 'location', title: 'Service Area', description: 'Where do you provide services?' },
    { id: 'skills', title: 'Skills & Services', description: 'What services do you offer?' },
    { id: 'pricing', title: 'Pricing', description: 'Set your competitive rates' },
    { id: 'verification', title: 'Verification', description: 'Final step - agree to terms' },
    { id: 'complete', title: 'Complete', description: 'Application submitted!' }
  ];

  const handleClose = () => {
    setCurrentStep('basic');
    setFormData({
      businessName: '',
      professionalDescription: '',
      yearsExperience: '',
      contactPhone: '',
      serviceArea: {
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        geo: {
          type: 'Point',
          coordinates: [0, 0]
        },
      },
      selectedSkills: [],
      customSkills: [],
      pricing: [],
      documents: [],
      agreedToTOS: false,
      consentBackgroundCheck: false
    });
    onClose();
  };

  const handleNext = async () => {
    const stepOrder = ['basic', 'location', 'skills', 'pricing', 'verification', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);

    setFormError('');

    if (currentStep === 'verification') {
      try {
        const data = new FormData();
        data.append("businessName", formData.businessName);
        data.append("professionalDescription", formData.professionalDescription);
        data.append("yearsExperience", formData.yearsExperience);
        data.append("contactPhone", formData.contactPhone);
        data.append("serviceArea", JSON.stringify(formData.serviceArea));
        formData.pricing.forEach((p) =>
          data.append("pricing[]", JSON.stringify(p))
        );
        data.append("agreedToTOS", formData.agreedToTOS);
        data.append("consentBackgroundCheck", formData.consentBackgroundCheck);
        formData.selectedSkills.forEach((s) =>
          data.append("selectedSkills[]", JSON.stringify(s))
        );
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
          onSuccess && onSuccess();
        } else {
          setFormError('Application submission failed. Please try again.');
        }
      } catch (error) {
        console.error(error);
        const message = error?.response?.data?.message || 'Upload failed';
        setFormError(message);
      }

      return;
    }

    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder = ['basic', 'location', 'skills', 'pricing', 'verification', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSkillToggle = (skillName, skillId) => {
    const totalSelected = formData.selectedSkills.length + formData.customSkills.length;
    const skillEntry = {
      skillId: skillId || null,
      name: skillName,
      isCustom: false
    };

    const exists = formData.selectedSkills.some(s => s.name === skillName);
    if (!exists && totalSelected >= 3) {
      setFormError('You can select up to 3 skills');
      setTimeout(() => setFormError(''), 3000);
      return;
    }

    setFormData(prev => ({
      ...prev,
      selectedSkills: exists
        ? prev.selectedSkills.filter(s => s.name !== skillName)
        : [...prev.selectedSkills, skillEntry]
    }));
  };

  const addCustomSkill = (skillName) => {
    const totalSelected = formData.selectedSkills.length + formData.customSkills.length;
    if (totalSelected >= 3) {
      setFormError('You can select up to 3 skills');
      setTimeout(() => setFormError(''), 3000);
      return;
    }

    if (skillName.trim() && !formData.customSkills.some(s => s.name === skillName.trim())) {
      const customSkillEntry = {
        skillId: null,
        name: skillName.trim(),
        isCustom: true
      };

      setFormData(prev => ({
        ...prev,
        customSkills: [...prev.customSkills, customSkillEntry]
      }));
    }
  };

  const removeCustomSkill = (skillName) => {
    setFormData(prev => ({
      ...prev,
      customSkills: prev.customSkills.filter(s => s.name !== skillName)
    }));
  };

  const setPricing = (skill, rateType, serviceRate, minimumCharge) => {
    setFormData(prev => {
      const existingIndex = prev.pricing.findIndex(p => p.skill.name === skill.name);
      const newPricing = [...prev.pricing];
      const pricingEntry = {
        skill,
        rateType,
        serviceRate,
        minimumCharge
      };

      if (existingIndex >= 0) {
        newPricing[existingIndex] = pricingEntry;
      } else {
        newPricing.push(pricingEntry);
      }

      return { ...prev, pricing: newPricing };
    });
  };

  const getPricingForSkill = (skillName) => {
    return formData.pricing.find(p => p.skill.name === skillName);
  };

  const allSelectedSkills = [...formData.selectedSkills, ...formData.customSkills];
  const allPricesSet = allSelectedSkills.length === 0 ? false : allSelectedSkills.every(skill => {
    const p = formData.pricing.find(x => x.skill.name === skill.name);
    return p && Number(p.serviceRate) > 0;
  });

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
                {steps.find(s => s.id === currentStep)?.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        {currentStep !== 'complete' && (
          <div className="px-6 pt-4 pb-2 shrink-0">
            <Progress
              value={getStepProgress()}
              className="h-2 bg-purple-100 dark:bg-purple-950"
            />
            <div className="text-center mt-2">
              <p className="text-sm font-medium bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {steps.find(s => s.id === currentStep)?.title}
              </p>
            </div>
            {formError && (
              <div className="text-red-500 text-sm rounded">
                {formError}
              </div>
            )}
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Step: Basic Information */}
            {currentStep === 'basic' && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-muted-foreground">
                    ✨ Start your journey as a SkillHub provider. Share your expertise with customers in your area.
                  </p>
                </div>

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
                    value={formData.professionalDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, professionalDescription: e.target.value }))}
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
                        if (val === '') {
                          setFormData(prev => ({ ...prev, yearsExperience: '' }));
                        } else {
                          const n = Math.min(Number(val), 49);
                          setFormData(prev => ({ ...prev, yearsExperience: n }));
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
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value.slice(0, 15) }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step: Service Area */}
            {currentStep === 'location' && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-muted-foreground">
                    📍 Define your service area to help customers find you easily.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    {cityOptions[formData.serviceArea.country] ? (
                      <select
                        value={formData.serviceArea.city}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          serviceArea: { ...prev.serviceArea, city: e.target.value }
                        }))}
                        className="w-full p-2 border border-purple-300 dark:border-purple-700 rounded-md bg-background text-sm"
                      >
                        <option value="">Select city</option>
                        {cityOptions[formData.serviceArea.country].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="e.g., Mumbai"
                        value={formData.serviceArea.city}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          serviceArea: { ...prev.serviceArea, city: e.target.value }
                        }))}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State *
                    </label>
                    <Input
                      placeholder="e.g., Maharashtra"
                      value={formData.serviceArea.state}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        serviceArea: { ...prev.serviceArea, state: e.target.value }
                      }))}
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
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        serviceArea: { ...prev.serviceArea, pincode: e.target.value.slice(0, 20) }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Country
                    </label>
                    <select
                      value={formData.serviceArea.country}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        serviceArea: { ...prev.serviceArea, country: e.target.value, city: (cityOptions[e.target.value]?.[0] || '') }
                      }))}
                      className="w-full p-2 border border-purple-300 dark:border-purple-700 rounded-md bg-background text-sm"
                    >
                      {countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                    💡 Location Tip
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    We'll use this information to show you to customers in your service area. You can adjust your radius anytime.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={detectLocation} className="border-purple-300 dark:border-purple-700">
                    <MapPin className="w-4 h-4 mr-2" /> Use my location
                  </Button>
                  <div className="text-sm text-muted-foreground">Detected coordinates: {formData.serviceArea.geo.coordinates[1]}, {formData.serviceArea.geo.coordinates[0]}</div>
                </div>
              </div>
            )}

            {/* Step: Skills */}
            {currentStep === 'skills' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Select Your Skills</h4>
                  <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2">
                    {Skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.selectedSkills.some(s => s.name === skill.name)
                          ? 'border-purple-500 bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 shadow-md'
                          : 'border-border hover:border-purple-300 dark:hover:border-purple-700'
                          }`}
                        onClick={() => handleSkillToggle(skill.name, skill.id)}
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
                      className="border-purple-300 dark:border-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.customSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.customSkills.map((skill) => (
                        <Badge
                          key={skill.name}
                          variant="secondary"
                          className="cursor-pointer bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800"
                          onClick={() => removeCustomSkill(skill.name)}
                        >
                          {skill.name}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h5 className="font-medium mb-2 text-purple-900 dark:text-purple-100">
                    Selected Skills ({allSelectedSkills.length})
                  </h5>
                  {allSelectedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allSelectedSkills.map((skill) => (
                        <Badge key={skill.name} className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
                          {skill.name} {skill.isCustom && '(Custom)'}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No skills selected yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Step: Pricing */}
            {currentStep === 'pricing' && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h5 className="font-medium mb-2">💡 Pricing Tips</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Research competitive rates in your area</li>
                    <li>• Consider your experience level and expertise</li>
                    <li>• You can adjust these rates anytime later</li>
                  </ul>
                </div>

                {allSelectedSkills.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {allSelectedSkills.map((skill) => {
                      const pricing = getPricingForSkill(skill.name);
                      return (
                        <div key={skill.name} className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-linear-to-r from-white to-purple-50/50 dark:from-card dark:to-purple-950/20">
                          <div className="mb-3">
                            <h4 className="font-medium">{skill.name}</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                                Rate Type
                              </label>
                              <select
                                value={pricing?.rateType || 'hourly'}
                                onChange={(e) => setPricing(
                                  skill,
                                  e.target.value,
                                  pricing?.serviceRate || 0,
                                  pricing?.minimumCharge || 0
                                )}
                                className="w-full p-2 border border-purple-300 dark:border-purple-700 rounded-md bg-background text-sm"
                              >
                                <option value="hourly">Hourly</option>
                                <option value="perJob">Per Job</option>
                                <option value="daily">Daily</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                                Service Rate
                              </label>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-purple-600" />
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={pricing?.serviceRate || ''}
                                  onChange={(e) => setPricing(
                                    skill,
                                    pricing?.rateType || 'hourly',
                                    Number(e.target.value),
                                    pricing?.minimumCharge || 0
                                  )}
                                  className="text-right border-purple-300 dark:border-purple-700"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">
                              Minimum Charge
                            </label>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-purple-600" />
                              <Input
                                type="number"
                                placeholder="0"
                                value={pricing?.minimumCharge || ''}
                                onChange={(e) => setPricing(
                                  skill,
                                  pricing?.rateType || 'hourly',
                                  pricing?.serviceRate || 0,
                                  Number(e.target.value)
                                )}
                                className="text-right border-purple-300 dark:border-purple-700"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Please select skills in the previous step to set pricing.
                  </div>
                )}
              </div>
            )}

            {/* Step: Verification */}
            {currentStep === 'verification' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Upload Documents</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload certifications, licenses, or other relevant documents to build trust.
                  </p>
                  <Dropzone setFormData={setFormData} formData={formData} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTOS}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, agreedToTOS: !!checked }))
                      }
                      className="border-purple-400 data-[state=checked]:bg-purple-600"
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the <a href="#" className="text-purple-600 dark:text-purple-400 underline font-medium">Terms of Service</a> and
                      <a href="#" className="text-purple-600 dark:text-purple-400 underline font-medium"> Privacy Policy</a>
                    </label>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <Checkbox
                      id="background"
                      checked={formData.consentBackgroundCheck}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, consentBackgroundCheck: !!checked }))
                      }
                      className="border-purple-400 data-[state=checked]:bg-purple-600"
                    />
                    <label htmlFor="background" className="text-sm leading-relaxed cursor-pointer">
                      I consent to a background check (required for all providers)
                    </label>
                  </div>
                </div>

                <div className="bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h5 className="font-medium mb-2">🛡️ Safety & Trust</h5>
                  <p className="text-sm text-muted-foreground">
                    All providers go through verification including background checks, identity verification,
                    and skill validation to ensure customer safety.
                  </p>
                </div>
              </div>
            )}

            {/* Step: Complete */}
            {currentStep === 'complete' && (
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Application Submitted!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for applying to become a SkillHub provider. We'll review your application
                  and get back to you within 2-3 business days.
                </p>

                <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg p-4 mb-6 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium mb-3 text-purple-900 dark:text-purple-100">What's Next?</h4>
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
        {currentStep !== 'complete' && (
          <div className="flex justify-between px-6 py-4 border-t border-purple-200 dark:border-purple-800 shrink-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 'basic'}
              className="border-purple-300 dark:border-purple-700"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-linear-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white shadow-md"
              disabled={
                (currentStep === 'basic' && !formData.businessName) ||
                (currentStep === 'location' && (!formData.serviceArea.city || !formData.serviceArea.state)) ||
                (currentStep === 'skills' && allSelectedSkills.length === 0) ||
                (currentStep === 'pricing' && !allPricesSet) ||
                (currentStep === 'verification' && (!formData.agreedToTOS || !formData.consentBackgroundCheck))
              }
            >
              {currentStep === 'verification' ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}