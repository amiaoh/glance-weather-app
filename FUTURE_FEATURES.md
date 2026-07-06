# Future features

## Customizable gear recommendation thresholds

`analyzeGear()` (in `src/components/forecast/forecast.utils.ts`) currently
uses fixed thresholds for every user - e.g. "moderate" rain starts at
2.5mm, "strong" wind starts at 40km/h, UV protection kicks in at index 3.
Different people have different tolerances (someone's jumper threshold is
someone else's t-shirt weather), so these should eventually be
per-user rather than hardcoded.

Options considered, roughly in increasing complexity:

1. **Onboarding questionnaire** - ask a few questions on first use (e.g.
   "At what temperature do you start wanting a jacket?", "How much rain
   before you grab an umbrella?") and derive initial thresholds from the
   answers.
2. **Manual settings** - a settings screen where the temperature/rainfall/
   wind speed ranges that trigger each gear recommendation can be directly
   adjusted.
3. **Learned from feedback** - periodically ask "Did you end up using a
   jumper/umbrella/waterproof jacket today?" and adjust thresholds based
   on actual behavior over time.
4. **Combination** - onboarding sets sensible defaults, settings allow
   manual overrides, and feedback nudges thresholds over time.

Feedback-based learning (#3) is expected to be the trickiest: it needs a
feedback prompt UX that doesn't feel naggy, a way to store/aggregate
responses over time, and a sensible algorithm for turning "used umbrella
at 1.5mm rain" data points into updated thresholds.

No decisions made yet on which approach(es) to build - just capturing the
idea for later.
