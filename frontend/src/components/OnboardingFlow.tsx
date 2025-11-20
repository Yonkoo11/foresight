import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  X,
  Users,
  Sword,
  Target,
  Brain,
  ArrowRight,
  Check
} from '@phosphor-icons/react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  action?: {
    label: string;
    path: string;
  };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to Timecaster',
    description: 'The ultimate crypto prediction and fantasy platform on Base. Compete in 4 exciting game modes, earn reputation, and climb the leaderboards!',
    icon: Check,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/20',
  },
  {
    id: 2,
    title: 'CT Draft - Fantasy League',
    description: 'Draft 5 crypto influencers and earn points based on their weekly Twitter performance. Manage your 200-point budget wisely with dynamic pricing!',
    icon: Users,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    action: {
      label: 'Start Drafting',
      path: '/draft'
    }
  },
  {
    id: 3,
    title: 'Timecaster Arena - 1v1 Duels',
    description: 'Challenge others in price prediction duels. Stake ETH, pick OVER/UNDER, and win when you\'re right. Winner takes 95% of the pot!',
    icon: Sword,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/20',
    action: {
      label: 'Enter Arena',
      path: '/arena'
    }
  },
  {
    id: 4,
    title: 'Daily Gauntlet - 5 Predictions',
    description: 'Make 5 daily predictions for 0.05 ETH. Your accuracy score determines your share of the prize pool. Compete daily!',
    icon: Target,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/20',
    action: {
      label: 'Try Gauntlet',
      path: '/gauntlet'
    }
  },
  {
    id: 5,
    title: 'CT Whisperer - Quiz Game',
    description: 'Guess which crypto influencer tweeted it! Free to play, sponsored prizes, and climb the quiz leaderboard.',
    icon: Brain,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    action: {
      label: 'Play Quiz',
      path: '/whisperer'
    }
  },
];

export function OnboardingFlow() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('timecaster_onboarding_completed');

    // Show onboarding if:
    // 1. User hasn't seen it before
    // 2. User is on the homepage (to avoid interrupting mid-session)
    if (!hasSeenOnboarding && window.location.pathname === '/') {
      // Delay slightly for better UX
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('timecaster_onboarding_completed', 'true');
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleAction = (path: string) => {
    handleClose();
    navigate(path);
  };

  if (!showOnboarding) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-cyan-500/30 rounded-2xl shadow-2xl max-w-2xl w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-6 border-b border-gray-700">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${step.iconBg} border-2 border-${step.iconColor.split('-')[1]}-500/50 rounded-xl flex items-center justify-center`}>
              <Icon size={32} weight="duotone" className={step.iconColor} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </div>
              <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Quick Stats for Welcome Step */}
          {isFirstStep && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400 mb-1">4</div>
                <div className="text-sm text-gray-400">Game Modes</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400 mb-1">Base</div>
                <div className="text-sm text-gray-400">Built on Base L2</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400 mb-1">50+</div>
                <div className="text-sm text-gray-400">CT Influencers</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400 mb-1">Daily</div>
                <div className="text-sm text-gray-400">Competitions</div>
              </div>
            </div>
          )}

          {/* Action Button for Game Mode Steps */}
          {step.action && (
            <button
              onClick={() => handleAction(step.action!.path)}
              className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              {step.action.label}
              <ArrowRight size={20} weight="bold" />
            </button>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-800/50 border-t border-gray-700 p-6 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ArrowRight size={16} weight="bold" />}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 pb-4">
          {ONBOARDING_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-cyan-500 w-8'
                  : index < currentStep
                  ? 'bg-cyan-500/50'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
