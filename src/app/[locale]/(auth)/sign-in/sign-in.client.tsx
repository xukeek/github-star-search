"use client";

import SSOButtons from "../_components/sso-buttons";

const SignInPage = () => {

  return (
    <div className="min-h-[90vh] flex flex-col items-center px-4 justify-center bg-background my-6 md:my-10">
      <div className="w-full max-w-md space-y-8 p-6 md:p-10 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Sign in to Starry AI Navigator
          </h2>
          <p className="mt-2 text-muted-foreground">
            Connect with GitHub to get started.
          </p>
        </div>

        <div className="space-y-4">
          <SSOButtons isSignIn />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
