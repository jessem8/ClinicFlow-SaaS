import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, CheckCircle2 } from "lucide-react";

interface OTPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phone: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<void>;
}

export function OTPModal({
  open,
  onOpenChange,
  phone,
  onVerify,
  onResend,
}: OTPModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (open) {
      setCode("");
      setError("");
      setVerified(false);
      setResendCooldown(60);
    }
  }, [open]);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    setIsVerifying(true);
    setError("");

    try {
      const success = await onVerify(code);
      if (success) {
        setVerified(true);
        setTimeout(() => onOpenChange(false), 1500);
      } else {
        setError("Code incorrect. Veuillez réessayer.");
        setCode("");
      }
    } catch (e) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setResendCooldown(60);
      setError("");
    } catch (e) {
      setError("Impossible de renvoyer le code.");
    } finally {
      setIsResending(false);
    }
  };

  const maskedPhone = phone.replace(/(\d{2})(\d+)(\d{2})/, "$1****$3");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {verified ? "Vérification réussie !" : "Vérification du numéro"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {verified ? (
              <span className="flex items-center justify-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                Votre rendez-vous est confirmé
              </span>
            ) : (
              <>
                Un code de vérification a été envoyé au
                <br />
                <span className="font-medium text-foreground">{maskedPhone}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {!verified && (
          <div className="flex flex-col items-center gap-6 py-4">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || isVerifying}
              className="w-full"
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Vérifier
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Vous n'avez pas reçu de code ?
              </p>
              <Button
                variant="link"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="text-primary"
              >
                {isResending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : resendCooldown > 0 ? (
                  `Renvoyer dans ${resendCooldown}s`
                ) : (
                  "Renvoyer le code"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
