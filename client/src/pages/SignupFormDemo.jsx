
import { SignupFormDemo, LoginFormDemo } from "../components/ui/AuthForms";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <SignupFormDemo />
      <div className="mt-8">
        <LoginFormDemo />
      </div>
    </div>
  );
}