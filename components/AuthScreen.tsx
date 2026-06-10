/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "../types";
import LoginUI from "./auth/LoginUI";
import RegisterUI from "./auth/RegisterUI";
import ResetPasswordUI from "./auth/ResetPasswordUI";
import { useLogin } from "./auth/useLogin";
import { useRegister } from "./auth/useRegister";
import { useResetPassword } from "./auth/useResetPassword";

interface AuthScreenProps {
  onLoginSuccess: (user: User, isNew?: boolean) => void;
  availableDemoUsers: User[];
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset_password">("login");

  const loginState = useLogin({ onLoginSuccess });
  const registerState = useRegister({ onLoginSuccess });
  const resetPasswordState = useResetPassword();

  if (authMode === "reset_password") {
    return (
      <ResetPasswordUI
        {...resetPasswordState}
        onSwitchToLogin={() => setAuthMode("login")}
      />
    );
  }

  if (authMode === "login") {
    return (
      <LoginUI 
        {...loginState} 
        onSwitchToRegister={() => setAuthMode("register")} 
        onSwitchToResetPassword={() => setAuthMode("reset_password")}
      />
    );
  }

  return (
    <RegisterUI 
      {...registerState} 
      onSwitchToLogin={() => setAuthMode("login")} 
    />
  );
}
