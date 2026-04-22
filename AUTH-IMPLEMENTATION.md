# SureLink Auth UX Implementation

This document maps the frontend auth implementation to the shared-entry blueprint (A1-A10), including validation, OTP behavior, routing, and analytics hooks for engineering handoff.

## Flow Coverage (A1-A10)

| ID | Screen | Frontend Status |
| --- | --- | --- |
| A1 | Welcome / Entry | Implemented in `Auth.jsx` (`welcome`) with Sign in + Create account CTAs and footer legal/help links |
| A2 | Sign in | Implemented in `Auth.jsx` (`signIn`) with identifier + password, forgot password, OTP switch |
| A3 | Sign in with OTP | Implemented in `Auth.jsx` (`otpSignIn`) with identifier entry, OTP input, resend timer, destination edit |
| A4 | Register basics | Implemented in `Auth.jsx` (`registerBasics`) with name, identifier, password, confirm password |
| A5 | OTP verification (signup) | Implemented in `Auth.jsx` (`otpSignup`) with masked destination confirmation + resend rules |
| A6 | Role selection | Implemented in `Auth.jsx` (`roleSelection`) using reusable `RoleCard` components |
| A7 | Terms + privacy consent | Implemented in `Auth.jsx` (`consent`) with required legal checkbox + optional marketing checkbox |
| A8 | Account created / redirect | Implemented in `Auth.jsx` (`accountCreated`) with success + auto-route |
| A9 | Consumer landing | Redirect to `/` after successful auth when role is `consumer` |
| A10 | Provider onboarding gate | Redirect to `/provider/onboarding` when role is `provider` |

## Field Validation Rules

- `fullName`: required, non-empty trimmed value.
- `identifier`: required; must pass email regex or Ghana phone regex (`+233` or `0` prefix + 9 digits).
- `password`: required for password login, minimum 8 characters for registration.
- `confirmPassword`: must match `password`.
- `otp`: exactly 6 numeric digits.
- `termsAccepted`: required before account creation.

## OTP Rules

- Length: 6 digits.
- Expiry: handled by backend contract; frontend displays "incorrect or expired" microcopy.
- Resend interval: 30 seconds (`OTP_RESEND_SECONDS = 30`).
- Max attempts: frontend is backend-driven; display lock/error when backend returns attempt-limit code.
- Paste support: OTP component accepts full-code paste and normalizes numeric input.

## Routing Logic By Role

- `goToLandingByRole("consumer")` -> `/`
- `goToLandingByRole("provider")` -> `/provider/onboarding`
- Signup path:
  - `registerBasics` -> `otpSignup` -> `roleSelection` -> `consent` -> `accountCreated` -> role route
- Login path:
  - Password sign in (`signIn`) -> role route
  - OTP sign in (`otpSignIn`) -> role route

## Error Contract Mapping

`mapErrorToMicrocopy` centralizes UI copy mapping:

- `AUTH_LOGIN_FAILED` -> `We couldn't sign you in. Check your details and try again.`
- `AUTH_OTP_INVALID` -> `That code is incorrect or expired. Request a new one.`
- `NETWORK_OFFLINE` -> `No internet connection. Check your network and retry.`

For unknown server errors, use fallback:

- `Something went wrong. Please retry.`

## Required UI State Variants

The auth flow supports and displays:

- Default
- Loading (`AuthButton` loading state + disabled controls)
- Validation error (field-level errors via `AuthTextInput`)
- API/server error (top `FeedbackBanner` + retry affordance)
- Offline / slow network (warning banners)
- Success (success banner and success transition states)
- Disabled CTA (buttons disabled while loading or invalid)

## Auth Component Kit

Reusable auth primitives live in `src/components/auth/AuthComponents.jsx`:

- `AuthTextInput` (default/focus/error/disabled handling)
- `AuthButton` (primary/secondary/loading/disabled support)
- `OtpInputGroup` (6-digit cells + paste behavior)
- `FeedbackBanner` (error/warning/success + optional retry action)
- `RoleCard` (default/selected/disabled)
- `ConsentRow` (checkbox + legal text row)

## Analytics Hooks

Tracked events:

- `login_started`, `login_success`, `login_failed`
- `signup_started`, `signup_completed`
- `role_selected`
- `otp_requested`, `otp_verified`, `otp_failed`

Current implementation uses `trackAuthEvent()` console stubs and is ready for SDK replacement.
