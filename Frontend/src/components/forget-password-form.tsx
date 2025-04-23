import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useForgetPasswordMutation, useResetPasswordMutation } from "@/slices/authApiSlice";
import { KeyRound, ArrowRight, ChevronLeft, Check, Clock, Mail } from "lucide-react";

function OTPTimer({
  initialSeconds,
  onTimerEnd,
}: {
  initialSeconds: number;
  onTimerEnd: () => void;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onTimerEnd();
    }
  }, [seconds, onTimerEnd]);

  return (
    <span className="flex items-center gap-1 text-sm">
      <Clock className="h-3 w-3" /> {seconds}s
    </span>
  );
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isForgotLoading }] = useForgetPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  const isLoading = isForgotLoading || isResetLoading;

  const handleApiError = (error: any) => {
    const message = error?.data?.message || error?.error || "Something went wrong";
    toast.error("Error", { description: message });
  };

  const sendOtp = async () => {
    if (!email) {
      toast.error("Email Required", { description: "Please enter your email address." });
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      
      toast.success("OTP Sent", {
        description: `OTP sent to ${email}. Please check your email.`,
      });
      setCanResend(false);
      if (step === "request") {
        setStep("verify");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === "request") {
      sendOtp();
      return;
    }
    
    if (!otp.trim()) {
      toast.error("OTP Required", { description: "Please enter the OTP sent to your email." });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords Don't Match", {
        description: "Please make sure both passwords are identical.",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password Too Short", {
        description: "Password must be at least 8 characters long.",
      });
      return;
    }
    
    try {
      await resetPassword({ 
        email, 
        otp, 
        newPassword 
      }).unwrap();
      
      toast.success("Password Reset Successful", {
        description: "Your password has been updated successfully.",
        action: {
          label: "Sign In",
          onClick: () => navigate('/accounts/sign-in', { replace: true }),
        },
      });
      
      setTimeout(() => {
        navigate('/accounts/sign-in', { replace: true });
      }, 2000);
      
    } catch (error) {
      handleApiError(error);
      
      if (error?.status === 400 && error?.data?.message?.includes('expired')) {
        setStep("request");
        toast.error("OTP Expired", { 
          description: "Your OTP has expired. Please request a new one." 
        });
      }
    }
  };

  const handleResend = () => {
    sendOtp();
  };

  const getPasswordStrength = () => {
    if (!newPassword) return { strength: 0, text: "" };
    
    let strength = 0;
    
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    
    const texts = ["Weak", "Fair", "Good", "Strong"];
    return { 
      strength, 
      text: strength > 0 ? texts[strength - 1] : "" 
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form 
            className="flex flex-col gap-6 p-6 md:p-8" 
            onSubmit={handleFormSubmit}
          >
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                  {step === "request" ? 
                    <Mail className="h-6 w-6" /> : 
                    <KeyRound className="h-6 w-6" />
                  }
                </div>
                <h1 className="text-2xl font-bold">
                  {step === "request" ? "Forgot Password" : "Reset Your Password"}
                </h1>
                <p className="text-muted-foreground text-sm max-w-xs">
                  {step === "request" 
                    ? "Enter your email to receive a verification code" 
                    : `We've sent an OTP to ${email}. Please verify and set your new password.`
                  }
                </p>
              </div>

              {/* Email field (step 1) */}
              {step === "request" && (
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg"
                    required
                  />
                </div>
              )}

              {/* Combined OTP and Password fields (step 2) */}
              {step === "verify" && (
                <>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp">Verification Code</Label>
                      {!canResend ? (
                        <OTPTimer
                          initialSeconds={60}
                          onTimerEnd={() => setCanResend(true)}
                        />
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleResend}
                          disabled={isLoading}
                          className="h-6 px-2 text-primary text-xs"
                        >
                          Resend Code
                        </Button>
                      )}
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-lg"
                      required
                      minLength={8}
                    />
                    {newPassword && (
                      <div className="mt-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            Password strength: <span className={cn(
                              passwordStrength.strength > 2 ? "text-green-500" : 
                              passwordStrength.strength > 1 ? "text-yellow-500" : 
                              "text-red-500"
                            )}>{passwordStrength.text}</span>
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((index) => (
                            <div 
                              key={index}
                              className={cn(
                                "h-1 flex-1 rounded-full",
                                index <= passwordStrength.strength ? 
                                  passwordStrength.strength > 2 ? "bg-green-500" : 
                                  passwordStrength.strength > 1 ? "bg-yellow-500" : 
                                  "bg-red-500"
                                : "bg-muted"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-lg"
                      required
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                    )}
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full rounded-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {step === "request" ? "Sending..." : "Resetting..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {step === "request" ? "Send Code" : "Reset Password"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                {step === "verify" && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full rounded-lg" 
                    onClick={() => setStep("request")}
                    disabled={isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Email
                  </Button>
                )}
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/reset-password.png"
              alt="Password Reset"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.25] dark:grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/5 dark:from-primary/10 dark:to-background/50"></div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs">
        By continuing, you agree to our{" "}
        <a href="/terms" className="font-medium text-primary hover:underline">Terms of Service</a> and{" "}
        <a href="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</a>.
      </div>
    </div>
  );
}