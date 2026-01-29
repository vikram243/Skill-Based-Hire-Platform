import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  Briefcase,
  FileText,
  UserCheck,
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function ApplicationStatusPanel({ isOpen, onClose, status, submittedAt }) {

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-12 h-12 text-blue-500 animate-pulse" />,
          title: 'Application Pending',
          description: "Your application is currently being reviewed by our team. This usually takes 2-3 business days.",
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          badge: 'secondary',
          steps: [
            { title: 'Application Submitted', date: submittedAt, completed: true },
            { title: 'Identity Verification', date: 'Processing', current: true },
            { title: 'Background Check', date: 'Pending' },
            { title: 'Final Review', date: 'Pending' }
          ]
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-12 h-12 text-orange-500" />,
          title: 'Application Cancelled',
          description: "This application was cancelled. You can resubmit or update your details if you'd like to try again.",
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          badge: 'warning',
          steps: [
            { title: 'Application Started', date: submittedAt, completed: true },
            { title: 'Application Cancelled', date: 'Recently', completed: true, error: true }
          ]
        };
      case 'rejected':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title: 'Application Rejected',
          description: "Unfortunately, your application does not meet our current requirements. Please contact support for more details.",
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          badge: 'destructive',
          steps: [
            { title: 'Application Submitted', date: submittedAt, completed: true },
            { title: 'Under Review', date: 'Completed', completed: true },
            { title: 'Application Rejected', date: 'Recently', completed: true, error: true }
          ]
        };
      default:
        return {
          icon: <Clock className="w-12 h-12 text-gray-500" />,
          title: 'Status Unknown',
          description: "We're checking the status of your application. Please wait.",
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          badge: 'outline',
          steps: []
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-linear-to-br from-card/95 to-purple-50/30 dark:to-purple-950/20 border-2 border-purple-200/40 dark:border-purple-800/40 shadow-2xl overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="p-8 flex flex-col items-center text-center">
          <div className={`mb-4 p-4 rounded-full ${config.bgColor}`}>
            {config.icon}
          </div>

          <DialogHeader>
            <DialogTitle className={`text-2xl font-bold ${config.color}`}>
              {config.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-base">
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full mt-8 space-y-6">
            <div className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor} text-left`}>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Application Timeline
              </h4>

              <div className="space-y-4">
                {config.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 relative">
                    {index !== config.steps.length - 1 && (
                      <div className={`absolute left-[11px] top-6 w-0.5 h-6 ${step.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    )}

                    <div className="mt-1">
                      {step.completed ? (
                        <CheckCircle2 className={`w-[22px] h-[22px] ${step.error ? 'text-red-500' : 'text-green-500'}`} />
                      ) : step.current ? (
                        <div className="w-[22px] h-[22px] rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-200 dark:border-gray-700" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <p className={`text-sm font-medium ${step.current ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
                <Calendar className="w-4 h-4 text-purple-500" />
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground uppercase">Submitted</p>
                  <p className="text-xs font-semibold">{submittedAt}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-purple-500" />
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground uppercase">ID Verified</p>
                  <p className="text-xs font-semibold">{status === 'pending' ? 'Ongoing' : 'Completed'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-8 flex flex-col gap-3">
            {status === 'cancelled' && (
              <Button
                className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                onClick={() => {
                  onClose();
                  // Trigger resubmission flow
                }}
              >
                Resubmit Application
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Close
            </Button>

            <p className="text-[10px] text-muted-foreground">
              Questions? Contact our provider support at <span className="text-purple-600 font-medium">support@skillhub.com</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
