/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "../types";
import LoginUI from "./auth/LoginUI";
import RegisterUI from "./auth/RegisterUI";
import { useLogin } from "./auth/useLogin";
import { useRegister } from "./auth/useRegister";

interface AuthScreenProps {
  onLoginSuccess: (user: User, isNew?: boolean) => void;
  availableDemoUsers: User[];
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const loginState = useLogin({ onLoginSuccess });
  const registerState = useRegister({ onLoginSuccess });

  if (authMode === "login") {
    return (
      <LoginUI 
        {...loginState} 
        onSwitchToRegister={() => setAuthMode("register")} 
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
