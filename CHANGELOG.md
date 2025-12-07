# Changelog

All notable changes to the Ken Beauty Salon project will be documented in this file.

## [Unreleased] - January 2025

### Added

- **App Install Banner Component** (`src/components/AppInstallBanner/`)

  - Smart device detection (Android/iOS)
  - Automatic banner display for mobile users
  - Links to Google Play Store and Apple App Store
  - Dismissible with localStorage persistence
  - Responsive design with animations
  - Navbar auto-adjustment when banner is visible

- **App Store Links in Footer**

  - Professional Google Play and App Store installation buttons
  - New "Get Our App" section in footer
  - Glassmorphism styling matching footer design
  - Responsive button layouts

- **Phone Number Formatting Helper**

  - `formatPhoneForTel()` function in `config/constants.js`
  - Properly formats phone numbers for `tel:` links
  - Removes spaces, dashes, and parentheses

- **WhatsApp Integration**
  - WhatsApp links added to contact section
  - WhatsApp links added to footer locations
  - Pre-filled message templates
  - WhatsApp icon buttons next to phone numbers

### Changed

- **Contact Section** (`src/components/contact/ContactContent.jsx`)

  - All phone numbers now clickable with proper `tel:` links
  - Added WhatsApp links next to mobile numbers
  - Added icons (Phone, Mail, MessageCircle) for better UX
  - Improved styling and hover effects

- **Footer** (`src/components/footer/Footer.modern.jsx`)

  - Primary phone number uses formatted link
  - Added WhatsApp link in contact info section
  - Location phone numbers show correct mobile numbers
  - Added WhatsApp icon buttons for each location
  - Added app store installation buttons section

- **Email Links**

  - All email links now have pre-filled subject and body
  - Improved styling with hover effects
  - Better accessibility with proper aria-labels

- **Loading Spinner** (`src/components/loading/LoadingSkeleton.modern.module.css`)

  - Fixed logo container sizing (160px with padding)
  - Logo now fully visible inside circular spinner
  - Improved object-fit for better logo display
  - Better responsive sizing for mobile devices

- **InitialLoader** (`src/components/InitialLoader.jsx`)
  - Simplified and fixed timer management
  - Proper cleanup of event listeners
  - Better handling of page load states
  - Fixed infinite loading issues

### Fixed

- Phone number links now work correctly on all devices
- Email links open with pre-filled information
- Loading spinner logo no longer gets cut off
- InitialLoader no longer causes infinite loading
- Footer app store buttons properly styled and responsive

### Technical Details

#### App Store Configuration

Added to `config/constants.js`:

```javascript
export const APP_STORES = {
  googlePlay: "https://play.google.com/store/apps/details?id=com.kenbeautyapp",
  appleAppStore: "https://apps.apple.com/app/id6752693871",
  bundleId: "com.garenghazarian.kenbeautysalon",
  appleId: "6752693871",
};
```

#### Helper Functions

- `formatPhoneForTel(phone)` - Formats phone numbers for tel: links
- `getWhatsAppUrl(phoneNumber, message)` - Generates WhatsApp links

#### Files Created

- `src/components/AppInstallBanner/AppInstallBanner.jsx`
- `src/components/AppInstallBanner/AppInstallBanner.module.css`
- `TESTING_APP_BANNER.md` - Testing guide for app banner

#### Files Modified

- `src/config/constants.js` - Added APP_STORES and formatPhoneForTel
- `src/components/contact/ContactContent.jsx` - Added clickable links
- `src/components/footer/Footer.modern.jsx` - Added app store buttons
- `src/components/footer/Footer.modern.module.css` - Added app store styles
- `src/app/(navPages)/contact/Contact.module.css` - Enhanced link styles
- `src/components/loading/LoadingSkeleton.modern.module.css` - Fixed logo sizing
- `src/components/InitialLoader.jsx` - Fixed timer issues
- `src/app/layout.jsx` - Added AppInstallBanner component

---

## Previous Updates

See `IMPROVEMENT_PLAN.md` for detailed history of all improvements.
