# Requirements Document

## Introduction

The Waitlist Status Page is a dedicated frontend page within the stellAIverse application that allows users to view their current position on the premium access waitlist, see an estimated time of arrival (ETA) for their access, and receive periodic position updates — all wrapped in the project's cosmic UI aesthetic. The page consumes the existing `/api/waitlist` backend endpoint and presents the data in an accessible, user-friendly format. Users can look up their status via email or connected Stellar wallet.

## Glossary

- **Waitlist_Page**: The dedicated `/waitlist/status` frontend page described in this document.
- **Position**: The user's 1-based numeric rank in the waitlist queue, as returned by the API (a positive integer ≥ 1).
- **ETA**: An estimated date or time range by which the user is expected to gain access, derived from their position and a configurable throughput rate.
- **Polling_Interval**: The fixed period (30 seconds) between automatic position refresh calls made by the Waitlist_Page.
- **Status_Lookup**: The mechanism by which a user identifies themselves — either by email address or by connected Stellar wallet address.
- **API_Client**: The browser-side HTTP fetch layer that calls `/api/waitlist`.
- **Wallet**: The user's connected Stellar wallet as provided by the `StellarWalletProvider` context.
- **Loading_State**: The UI condition shown while the API_Client is awaiting a response.
- **Error_State**: The UI condition shown when the API_Client receives a non-OK response or a network failure.
- **Not_Found_State**: The UI condition shown when the API returns `joined: false` for the provided identifier.
- **Throughput_Rate**: The configurable number of users admitted per day, defaulting to 10.

---

## Requirements

### Requirement 1: Position Display

**User Story:** As a waitlisted user, I want to see my current queue position on a dedicated status page, so that I know how far I am from gaining access to stellAIverse Premium.

#### Acceptance Criteria

1. WHEN the API_Client returns a response where `joined` is `true` and `position` is a positive integer, THE Waitlist_Page SHALL display the Position value as a numeric string rendered at a minimum font size of 32px in a visually distinct typographic style.
2. THE Waitlist_Page SHALL render the text label "Queue Position" immediately adjacent to the Position numeric value so that both are visible in the same viewport region without scrolling.
3. WHEN the Position value returned by the API is `1`, THE Waitlist_Page SHALL render a text element containing "Next in line" in the same card or section as the Position value.
4. IF the API_Client receives a response where `joined` is `false`, THEN THE Waitlist_Page SHALL display the Not_Found_State, which SHALL include a link element navigating to `/waitlist` with visible link text inviting the user to join.
5. IF the API_Client returns a response where `joined` is `true` but `position` is `null`, `undefined`, or not a positive integer, THEN THE Waitlist_Page SHALL display the Error_State with the message "Position data unavailable. Please try again."

---

### Requirement 2: ETA Display

**User Story:** As a waitlisted user, I want to see an estimated time until I receive access, so that I can plan accordingly.

#### Acceptance Criteria

1. WHEN the Waitlist_Page displays a valid Position (a positive integer ≥ 1), THE Waitlist_Page SHALL calculate an ETA using the formula `days = ceil(Position / Throughput_Rate)` where Throughput_Rate defaults to 10, and SHALL display the resulting ETA string.
2. THE Waitlist_Page SHALL map the calculated `days` value to a human-readable ETA string using the following bucketing rules: `days = 0` or Position ≤ 10 → "Within 24 hours"; `days = 1` → "~1 day"; `2 ≤ days ≤ 6` → "~{days} days"; `7 ≤ days ≤ 13` → "~1 week"; `14 ≤ days ≤ 27` → "~{weeks} weeks" (where `weeks = floor(days / 7)`); `days ≥ 28` → "~{months} month(s)" (where `months = floor(days / 30)`).
3. WHEN the Position is 10 or fewer, THE Waitlist_Page SHALL display "Within 24 hours" as the ETA string regardless of the Throughput_Rate value.
4. THE Waitlist_Page SHALL render the ETA string and the Position value within the same visible viewport region on a 1280×800 display at 100% zoom, without requiring the user to scroll.

---

### Requirement 3: Status Lookup

**User Story:** As a user, I want to look up my waitlist status using my email address or connected wallet, so that I can check my position without remembering a separate identifier.

#### Acceptance Criteria

1. THE Waitlist_Page SHALL render an email input field with a maximum character length of 254 and a submit button, accepting a string for Status_Lookup when no Wallet is connected or when the wallet lookup returned `joined: false`.
2. WHEN a Wallet is connected on page mount, THE Waitlist_Page SHALL automatically perform a Status_Lookup by calling `GET /api/waitlist?wallet={walletPublicKey}`; IF that call fails due to a network error or HTTP error, THE Waitlist_Page SHALL fall back to showing the email input form without displaying an error message attributable to the wallet lookup.
3. WHEN a Wallet is connected and a Status_Lookup by wallet public key returns `joined: true`, THE Waitlist_Page SHALL display the position result and hide the email input form element from the DOM.
4. WHEN the user submits the email input form with a valid email, THE API_Client SHALL call `GET /api/waitlist?email={encodedEmail}` (with the email URI-encoded) and render the result according to Requirements 1, 2, and 5.
5. IF the submitted email fails the format check `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, THEN THE Waitlist_Page SHALL display an inline validation error message "Please enter a valid email address" adjacent to the email input field without making an API call.
6. IF the API_Client returns a response where `joined` is `false` for the submitted email, THEN THE Waitlist_Page SHALL display the Not_Found_State as defined in Requirement 1, criterion 4.

---

### Requirement 4: Periodic Refresh (Real-Time Updates)

**User Story:** As a waitlisted user, I want my position to update automatically at regular intervals, so that I always see current information without manually refreshing the page.

#### Acceptance Criteria

1. WHILE the Waitlist_Page is mounted and is displaying a Position value ≥ 1, THE Waitlist_Page SHALL schedule a recurring fetch of the user's position from the API_Client at an interval of exactly 30 seconds (the Polling_Interval).
2. WHEN a refresh fetch is in progress, THE Waitlist_Page SHALL render an "Updating…" text indicator in a DOM element positioned outside the Position display area so that the current Position value remains fully visible.
3. WHEN a refresh fetch completes successfully and the returned Position differs from the currently displayed Position, THE Waitlist_Page SHALL update both the Position numeric value and the ETA string to reflect the new values within one render cycle.
4. WHEN a refresh fetch completes successfully and the returned Position is identical to the currently displayed Position, THE Waitlist_Page SHALL leave the displayed Position and ETA string unchanged and remove the "Updating…" indicator.
5. WHEN a refresh fetch fails (network error or HTTP error response), THE Waitlist_Page SHALL retain the last successfully fetched Position value, remove the "Updating…" indicator, and render a warning message "Could not refresh — showing last known position" in a DOM element that does not overlap or obscure the Position display area.
6. WHEN the Waitlist_Page is unmounted, THE Waitlist_Page SHALL clear the Polling_Interval timer via `clearInterval` and abort any in-flight fetch request to prevent state updates on an unmounted component.

---

### Requirement 5: Loading and Error States

**User Story:** As a user, I want clear feedback during data loading and on errors, so that I know the page is working and understand what went wrong.

#### Acceptance Criteria

1. WHEN the Waitlist_Page is performing the initial Status_Lookup, THE Waitlist_Page SHALL render skeleton placeholder elements in place of the Position display and ETA display, each skeleton matching the width and height of the final rendered element to within 8px.
2. IF the API_Client receives an HTTP response with status code 500 or above during the initial Status_Lookup, THEN THE Waitlist_Page SHALL display the Error_State containing the exact message "Something went wrong. Please try again." and a button labeled "Retry".
3. IF the API_Client receives an HTTP response with status code 400–499 during the initial Status_Lookup (excluding the not-found case handled by Requirement 1, criterion 4), THEN THE Waitlist_Page SHALL display the Error_State containing the message "Request failed. Please check your input and try again."
4. WHEN the user activates the "Retry" button in the Error_State, THE API_Client SHALL re-issue the most recently attempted Status_Lookup request using the same identifier (email or wallet public key).
5. IF the API_Client encounters a network failure (fetch rejects without a response) during the initial Status_Lookup, THEN THE Waitlist_Page SHALL display the Error_State with the exact message "Network error. Check your connection and try again."

---

### Requirement 6: Join Date Display

**User Story:** As a waitlisted user, I want to see when I joined the waitlist, so that I have a record of my registration.

#### Acceptance Criteria

1. WHEN a valid Position is displayed and the API response includes a `joinedAt` field containing a valid ISO 8601 date-time string, THE Waitlist_Page SHALL parse the `joinedAt` value and render it as a human-readable local date string using the format `{MonthName} {Day}, {Year}` (e.g., "June 12, 2025") in the user's browser locale.
2. THE Waitlist_Page SHALL render a text label "Joined on" immediately preceding the formatted join date value within the same UI element so that both the label and the date are visible together without scrolling.
3. IF the `joinedAt` field is absent from the API response or is not a parseable date-time string, THE Waitlist_Page SHALL omit the join date element entirely without displaying an error or placeholder text.

---

### Requirement 7: Accessibility and Responsiveness

**User Story:** As any user, I want the Waitlist_Page to be usable on any screen size and with assistive technologies, so that it is inclusive and accessible.

#### Acceptance Criteria

1. THE Waitlist_Page SHALL render without horizontal scrollbar or content clipping at any viewport width between 320px and 2560px inclusive, verified at 320px, 768px, 1280px, and 2560px breakpoints.
2. THE Waitlist_Page SHALL assign an `aria-label` attribute to the Position display element using the format "Queue position: {value}" and to the ETA display element using the format "Estimated wait time: {value}", so that screen readers announce them with their respective labels and values.
3. THE Waitlist_Page SHALL assign an `aria-label` attribute to the join date display element using the format "Joined on: {formattedDate}" when the join date is present.
4. THE Waitlist_Page SHALL maintain a minimum color contrast ratio of 4.5:1 between foreground text color and background color for all informational text elements (Position, ETA, join date, labels, error messages), consistent with WCAG 2.1 AA Success Criterion 1.4.3.
5. THE Waitlist_Page SHALL ensure all interactive elements (email input, submit button, retry button) are reachable via sequential keyboard navigation (Tab key) in document order, and each interactive element SHALL display a visible focus indicator (outline or equivalent) when focused.
