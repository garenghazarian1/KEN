# Testing the App Install Banner

## Quick Start

The development server should be running. Open your browser and follow these steps:

## Method 1: Browser Dev Tools (Recommended)

### Test Android Banner:
1. Open your browser (Chrome/Edge recommended)
2. Press `F12` or `Right-click → Inspect` to open DevTools
3. Click the **Device Toolbar** icon (or press `Ctrl+Shift+M` / `Cmd+Shift+M`)
4. Select a mobile device (e.g., "Galaxy S20", "Pixel 5") or set custom dimensions
5. The banner should appear at the top showing "Get on Google Play"

### Test iOS Banner:
1. In Device Toolbar, select an iPhone (e.g., "iPhone 12 Pro", "iPhone SE")
2. The banner should appear showing "Get on App Store"

### Reset Banner (to test again):
1. Open DevTools Console (`F12` → Console tab)
2. Run this command:
   ```javascript
   localStorage.removeItem('appInstallBannerDismissed');
   location.reload();
   ```

## Method 2: URL Parameters (Development Mode)

### Test Android:
```
http://localhost:3000/?testAppBanner=true&device=android
```

### Test iOS:
```
http://localhost:3000/?testAppBanner=true&device=ios
```

### Reset and Test Again:
1. Open Console and run:
   ```javascript
   localStorage.removeItem('appInstallBannerDismissed');
   localStorage.setItem('forceShowAppBanner', 'true');
   localStorage.setItem('testDeviceType', 'android'); // or 'ios'
   location.reload();
   ```

## Method 3: Console Commands

Open Browser Console (`F12` → Console) and use these commands:

### Show Banner (Android):
```javascript
localStorage.removeItem('appInstallBannerDismissed');
localStorage.setItem('forceShowAppBanner', 'true');
localStorage.setItem('testDeviceType', 'android');
location.reload();
```

### Show Banner (iOS):
```javascript
localStorage.removeItem('appInstallBannerDismissed');
localStorage.setItem('forceShowAppBanner', 'true');
localStorage.setItem('testDeviceType', 'ios');
location.reload();
```

### Clear All Test Data:
```javascript
localStorage.removeItem('appInstallBannerDismissed');
localStorage.removeItem('forceShowAppBanner');
localStorage.removeItem('testDeviceType');
location.reload();
```

## What to Test

✅ **Banner Appearance:**
- Banner appears at the top of the page
- Shows correct store button (Google Play for Android, App Store for iOS)
- Smooth animation when appearing

✅ **Navbar Adjustment:**
- Navbar moves down when banner is visible
- Navbar returns to top when banner is dismissed

✅ **Dismiss Functionality:**
- Click the X button to dismiss
- Banner should not reappear after dismissal (check localStorage)

✅ **Install Button:**
- Clicking "Get on Google Play" opens Google Play Store in new tab
- Clicking "Get on App Store" opens App Store in new tab
- Banner dismisses after clicking install button

✅ **Responsive Design:**
- Test on different screen sizes (mobile, tablet)
- Banner should adapt to smaller screens
- Text and buttons should remain readable

✅ **LocalStorage:**
- After dismissing, check that `appInstallBannerDismissed` is set to `"true"`
- Banner should not show again until localStorage is cleared

## Testing on Real Devices

### Android:
1. Deploy to a staging environment or use ngrok/tunneling
2. Open the site on an Android device
3. Banner should automatically appear

### iOS:
1. Deploy to a staging environment or use ngrok/tunneling
2. Open the site on an iPhone/iPad
3. Banner should automatically appear

## Troubleshooting

**Banner not showing:**
- Check if `appInstallBannerDismissed` exists in localStorage
- Clear it: `localStorage.removeItem('appInstallBannerDismissed')`
- Make sure you're in mobile device mode in DevTools

**Navbar overlapping banner:**
- Check browser console for errors
- Verify CSS custom property `--app-banner-height` is being set
- Check that banner ref is working correctly

**Links not working:**
- Verify `APP_STORES` constants are correct in `config/constants.js`
- Check that links open in new tab (should have `target="_blank"`)

