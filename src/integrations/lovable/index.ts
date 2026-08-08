import { createLovableAuth } from "@lovable.dev/cloud-auth-js";

// Thin wrapper so call sites can use `lovable.auth.signInWithOAuth(...)`.
export const lovable = {
  auth: createLovableAuth(),
};
