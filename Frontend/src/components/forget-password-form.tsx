"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"

function OTPTimer({
  initialSeconds,
  onTimerEnd,
}: {
  initialSeconds: number
  onTimerEnd: () => void
}) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onTimerEnd()
    }
  }, [seconds, onTimerEnd])

  return <span>{seconds}s</span>
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<"request" | "otp" | "reset">("request")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [canResend, setCanResend] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const navigate = useNavigate();

  const sendOtp = () => {
    setIsSending(true)
    // Simulated delay
    setTimeout(() => {
      setIsSending(false)
      setStep("otp")
      setCanResend(false)
      toast(`OTP sent to ${email}`, {
        description: "Please check your email for the OTP.",
      })
    }, 1000)
  }

  const handleResend = () => {
    sendOtp()
  }

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendOtp()
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.trim() !== "") {
      setStep("reset")
      toast("OTP Verified", {
        description: "You can now reset your password.",
      })
    } else {
      toast("Please enter a valid OTP", { description: "OTP cannot be empty." })
    }
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword === confirmPassword) {
      console.log("Password reset successful for", email)
      toast("Password Reset Successful", {
        description: "Your password has been updated.",
        action: {
          label: "Sign In",
          onClick: () => navigate('/accounts/sign-in', {replace: true}),
        },
      })
    } else {
      toast("Passwords do not match", {
        description: "Please make sure both passwords are identical.",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {step === "request" && (
            <form className="p-6 md:p-8" onSubmit={handleRequestSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Forgot Password</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your email to receive an OTP.
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <form className="p-6 md:p-8" onSubmit={handleOtpSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Enter OTP</h1>
                  <p className="text-muted-foreground text-balance">
                    We sent an OTP to <strong>{email}</strong>
                  </p>
                  <div className="mt-2">
                    {!canResend ? (
                      <OTPTimer
                        initialSeconds={60}
                        onTimerEnd={() => setCanResend(true)}
                      />
                    ) : (
                      <Button variant="link" onClick={handleResend}>
                        Resend OTP
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form className="p-6 md:p-8" onSubmit={handleResetSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your new password for <strong>{email}</strong>
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
            </form>
          )}

          <div className="bg-muted relative hidden md:block">
            <img
              src="/reset-password.png"
              alt="Forgot Password Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
