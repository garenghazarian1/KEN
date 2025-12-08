# TODO List - Ken Beauty Salon

## ✅ Completed (January 2025)

### App Installation Features
- [x] Create App Install Banner component with device detection
- [x] Add Google Play Store link support
- [x] Add Apple App Store link support
- [x] Implement banner dismissal with localStorage
- [x] Add navbar auto-adjustment when banner is visible
- [x] Create responsive design for banner
- [x] Add app store buttons to footer
- [x] Test banner on Android devices
- [x] Test banner on iOS devices

### Contact Information Enhancements
- [x] Make all phone numbers clickable
- [x] Add phone number formatting helper function
- [x] Add WhatsApp links to contact section
- [x] Add WhatsApp links to footer
- [x] Make all email addresses clickable
- [x] Add pre-filled email subjects and bodies
- [x] Add icons to contact information
- [x] Improve contact link styling and hover effects

### Bug Fixes
- [x] Fix loading spinner logo sizing issue
- [x] Fix InitialLoader infinite loading bug
- [x] Fix phone number link formatting
- [x] Fix email link functionality

### Documentation
- [x] Create testing guide for app banner
- [x] Update IMPROVEMENT_PLAN.md
- [x] Create CHANGELOG.md
- [x] Create TODO.md

## 🔄 In Progress

None at the moment.

## 📋 Planned

### Future Enhancements
- [ ] Add contact form with email submission
- [ ] Add SMS link support for phone numbers
- [ ] Add deep linking for app (if user has app installed)
- [ ] Add analytics tracking for app install clicks
- [ ] Consider adding app install prompt for desktop users
- [ ] Add app store rating prompts after app usage

### Performance
- [ ] Optimize app banner component loading
- [ ] Add lazy loading for app store buttons
- [ ] Consider code splitting for app banner

### Testing
- [ ] Test on real Android devices
- [ ] Test on real iOS devices
- [ ] Test email links on different email clients
- [ ] Test WhatsApp links on different devices
- [ ] Cross-browser testing for app banner

---

## References (merged)
- App install banner quick test: use DevTools mobile toolbar or `?testAppBanner=true&device=android|ios`; reset via `localStorage.removeItem('appInstallBannerDismissed')`; force show by setting `forceShowAppBanner` and `testDeviceType`.
- iOS WebView tel: allow `tel` in WKWebView `decidePolicyFor`, add `tel/telprompt` to Info.plist schemes, keep links as `tel:+971...`.

---

## Notes

- App banner only shows on mobile devices (Android/iOS)
- App store buttons in footer are always visible
- All contact links are now functional and clickable
- Email links include pre-filled subjects for better UX

---

_Last Updated: January 2025_

