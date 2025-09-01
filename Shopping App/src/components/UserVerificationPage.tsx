import React, { useState, useRef } from "react";
import { ChevronLeft, Upload, Camera, Phone, Check, X, Shield, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

interface UserVerificationPageProps {
  onBack: () => void;
  onMenuClick: () => void;
  onVerificationComplete?: (verificationData: any) => void;
}

type VerificationStep = 'overview' | 'government-id' | 'selfie' | 'phone' | 'review' | 'completed';

interface VerificationData {
  governmentId: {
    type: string;
    number: string;
    file: File | null;
    verified: boolean;
  };
  selfie: {
    file: File | null;
    verified: boolean;
  };
  phone: {
    number: string;
    otp: string;
    verified: boolean;
    otpSent: boolean;
  };
}

export default function UserVerificationPage({ 
  onBack, 
  onMenuClick, 
  onVerificationComplete 
}: UserVerificationPageProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('overview');
  const [verificationData, setVerificationData] = useState<VerificationData>({
    governmentId: {
      type: '',
      number: '',
      file: null,
      verified: false
    },
    selfie: {
      file: null,
      verified: false
    },
    phone: {
      number: '',
      otp: '',
      verified: false,
      otpSent: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const governmentIdRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const idTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'voter_id', label: 'Voter ID' }
  ];

  const handleFileUpload = (type: 'governmentId' | 'selfie', file: File) => {
    if (type === 'governmentId') {
      setVerificationData(prev => ({
        ...prev,
        governmentId: { ...prev.governmentId, file }
      }));
    } else {
      setVerificationData(prev => ({
        ...prev,
        selfie: { ...prev.selfie, file }
      }));
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    
    // Mock OTP sending
    setTimeout(() => {
      setVerificationData(prev => ({
        ...prev,
        phone: { ...prev.phone, otpSent: true }
      }));
      setLoading(false);
    }, 2000);
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    
    // Mock OTP verification
    setTimeout(() => {
      if (verificationData.phone.otp === '123456') {
        setVerificationData(prev => ({
          ...prev,
          phone: { ...prev.phone, verified: true }
        }));
        setCurrentStep('review');
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 1500);
  };

  const submitVerification = async () => {
    setLoading(true);
    
    // Mock verification process
    setTimeout(() => {
      setVerificationData(prev => ({
        ...prev,
        governmentId: { ...prev.governmentId, verified: true },
        selfie: { ...prev.selfie, verified: true }
      }));
      setCurrentStep('completed');
      setLoading(false);
      
      if (onVerificationComplete) {
        onVerificationComplete(verificationData);
      }
    }, 3000);
  };

  const renderOverview = () => (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="mb-2">Identity Verification Required</h2>
          <p className="text-gray-600">
            To ensure safety and trust in our marketplace, we require all users to verify their identity.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Verification Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">1</span>
            </div>
            <div className="flex-1">
              <h4>Government ID Verification</h4>
              <p className="text-gray-600">Upload a clear photo of your government-issued ID</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">2</span>
            </div>
            <div className="flex-1">
              <h4>Selfie Verification</h4>
              <p className="text-gray-600">Take a selfie to match with your ID</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">3</span>
            </div>
            <div className="flex-1">
              <h4>Phone Verification</h4>
              <p className="text-gray-600">Verify your phone number with OTP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your information is encrypted and secure. We comply with all privacy regulations.
        </AlertDescription>
      </Alert>

      <Button 
        onClick={() => setCurrentStep('government-id')} 
        className="w-full"
      >
        Start Verification
      </Button>
    </div>
  );

  const renderGovernmentId = () => (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="mb-2">Government ID Verification</h2>
        <p className="text-gray-600">
          Upload a clear photo of your government-issued ID document
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="id-type">Select ID Type</Label>
          <select
            id="id-type"
            className="w-full p-3 border rounded-lg mt-1"
            value={verificationData.governmentId.type}
            onChange={(e) => setVerificationData(prev => ({
              ...prev,
              governmentId: { ...prev.governmentId, type: e.target.value }
            }))}
          >
            <option value="">Choose ID Type</option>
            {idTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="id-number">ID Number</Label>
          <Input
            id="id-number"
            type="text"
            placeholder="Enter your ID number"
            value={verificationData.governmentId.number}
            onChange={(e) => setVerificationData(prev => ({
              ...prev,
              governmentId: { ...prev.governmentId, number: e.target.value }
            }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Upload ID Document</Label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors mt-1"
            onClick={() => governmentIdRef.current?.click()}
          >
            {verificationData.governmentId.file ? (
              <div className="space-y-2">
                <Check className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-green-600">ID document uploaded successfully</p>
                <p className="text-sm text-gray-500">{verificationData.governmentId.file.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-gray-600">Click to upload your ID document</p>
                <p className="text-sm text-gray-500">JPG, PNG or PDF (max 5MB)</p>
              </div>
            )}
          </div>
          <input
            ref={governmentIdRef}
            type="file"
            accept="image/*,.pdf"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('governmentId', file);
            }}
          />
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ensure your ID is clearly visible with no glare or shadows. All corners should be visible.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep('overview')} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep('selfie')} 
          className="flex-1"
          disabled={!verificationData.governmentId.type || !verificationData.governmentId.number || !verificationData.governmentId.file}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderSelfie = () => (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="mb-2">Selfie Verification</h2>
        <p className="text-gray-600">
          Take a clear selfie to verify your identity matches your ID
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Take Selfie</Label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors mt-1"
            onClick={() => selfieRef.current?.click()}
          >
            {verificationData.selfie.file ? (
              <div className="space-y-2">
                <Check className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-green-600">Selfie captured successfully</p>
                <img 
                  src={URL.createObjectURL(verificationData.selfie.file)} 
                  alt="Selfie preview" 
                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-gray-600">Click to take a selfie</p>
                <p className="text-sm text-gray-500">Make sure your face is clearly visible</p>
              </div>
            )}
          </div>
          <input
            ref={selfieRef}
            type="file"
            accept="image/*"
            capture="user"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('selfie', file);
            }}
          />
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Look directly at the camera. Remove sunglasses, hats, or anything covering your face.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep('government-id')} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep('phone')} 
          className="flex-1"
          disabled={!verificationData.selfie.file}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderPhone = () => (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="mb-2">Phone Verification</h2>
        <p className="text-gray-600">
          Verify your phone number with an OTP code
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2 mt-1">
            <select className="p-3 border rounded-lg">
              <option value="+91">+91</option>
            </select>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={verificationData.phone.number}
              onChange={(e) => setVerificationData(prev => ({
                ...prev,
                phone: { ...prev.phone, number: e.target.value }
              }))}
              className="flex-1"
            />
          </div>
        </div>

        {!verificationData.phone.otpSent ? (
          <Button 
            onClick={sendOTP} 
            className="w-full"
            disabled={!verificationData.phone.number || loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending OTP...
              </div>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Send OTP
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                OTP sent to +91 {verificationData.phone.number}
              </AlertDescription>
            </Alert>
            
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={verificationData.phone.otp}
                onChange={(e) => setVerificationData(prev => ({
                  ...prev,
                  phone: { ...prev.phone, otp: e.target.value }
                }))}
                className="mt-1"
                maxLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={verifyOTP} 
              className="w-full"
              disabled={verificationData.phone.otp.length !== 6 || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <Button variant="outline" onClick={() => setVerificationData(prev => ({
              ...prev,
              phone: { ...prev.phone, otpSent: false, otp: '' }
            }))}>
              Resend OTP
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep('selfie')} className="flex-1">
          Back
        </Button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="mb-2">Review Your Information</h2>
        <p className="text-gray-600">
          Please review your submitted information before final verification
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4>Government ID</h4>
              <Badge variant="secondary">
                <Check className="w-3 h-3 mr-1" />
                Submitted
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {idTypes.find(t => t.value === verificationData.governmentId.type)?.label} - 
              {verificationData.governmentId.number}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4>Selfie</h4>
              <Badge variant="secondary">
                <Check className="w-3 h-3 mr-1" />
                Submitted
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Identity selfie captured</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4>Phone Number</h4>
              <Badge variant="secondary">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
            <p className="text-sm text-gray-600">+91 {verificationData.phone.number}</p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Verification typically takes 1-2 business days. You'll be notified once approved.
        </AlertDescription>
      </Alert>

      <Button 
        onClick={submitVerification} 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Submitting for Review...
          </div>
        ) : (
          'Submit for Verification'
        )}
      </Button>
    </div>
  );

  const renderCompleted = () => (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="mb-2">Verification Submitted!</h2>
          <p className="text-gray-600">
            Your identity verification has been submitted successfully. We'll review your information and notify you within 1-2 business days.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h4>What happens next?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Our team will review your submitted documents</li>
            <li>• You'll receive an email notification once verified</li>
            <li>• Verified users get access to all marketplace features</li>
            <li>• Your profile will display a verified badge</li>
          </ul>
        </CardContent>
      </Card>

      <Button onClick={onBack} className="w-full">
        Return to Profile
      </Button>
    </div>
  );

  return (
    <div className="h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1>Identity Verification</h1>
        <button onClick={onMenuClick}>
          <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
            <div className="w-4 h-0.5 bg-black"></div>
            <div className="w-4 h-0.5 bg-black"></div>
            <div className="w-4 h-0.5 bg-black"></div>
          </div>
        </button>
      </div>

      {/* Progress Indicator */}
      {currentStep !== 'overview' && currentStep !== 'completed' && (
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Step {
                currentStep === 'government-id' ? '1' :
                currentStep === 'selfie' ? '2' :
                currentStep === 'phone' ? '3' : '4'
              } of 4
            </span>
            <span className="text-sm text-gray-600">
              {
                currentStep === 'government-id' ? 'Government ID' :
                currentStep === 'selfie' ? 'Selfie' :
                currentStep === 'phone' ? 'Phone' : 'Review'
              }
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{
                width: `${
                  currentStep === 'government-id' ? '25%' :
                  currentStep === 'selfie' ? '50%' :
                  currentStep === 'phone' ? '75%' : '100%'
                }%`
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 'overview' && renderOverview()}
        {currentStep === 'government-id' && renderGovernmentId()}
        {currentStep === 'selfie' && renderSelfie()}
        {currentStep === 'phone' && renderPhone()}
        {currentStep === 'review' && renderReview()}
        {currentStep === 'completed' && renderCompleted()}
      </div>
    </div>
  );
}