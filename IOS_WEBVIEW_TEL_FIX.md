# iOS WebView Tel: Link Fix - Instructions for Native App Developer

## Problem
The iOS WebView in the App Store app doesn't support `tel:` protocol links, causing error -1002 (NSURLErrorDomain - Unsupported URL) when users try to call phone numbers.

## Solution
The native app needs to be configured to allow `tel:` protocol links in the WebView.

## Implementation Steps

### Option 1: Configure WKWebView to Allow Tel: Protocol (Recommended)

In your iOS native app code, when setting up the WKWebView, add the following:

**Swift:**
```swift
import WebKit

// In your ViewController or WebView setup
let webView = WKWebView()

// Allow tel: protocol
webView.configuration.preferences.javaScriptEnabled = true

// Handle tel: links
func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    if let url = navigationAction.request.url {
        if url.scheme == "tel" {
            // Open tel: links in Phone app
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            }
            decisionHandler(.cancel)
            return
        }
    }
    decisionHandler(.allow)
}
```

**Objective-C:**
```objc
#import <WebKit/WebKit.h>

// In your ViewController
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *url = navigationAction.request.URL;
    
    if ([url.scheme isEqualToString:@"tel"]) {
        // Open tel: links in Phone app
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil];
        }
        decisionHandler(WKNavigationActionPolicyCancel);
        return;
    }
    
    decisionHandler(WKNavigationActionPolicyAllow);
}
```

### Option 2: Add URL Scheme to Info.plist

Add the `tel` URL scheme to your `Info.plist`:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>tel</string>
    <string>telprompt</string>
</array>
```

### Option 3: Use JavaScript Bridge (Alternative)

If you prefer to handle it via JavaScript bridge:

**Swift:**
```swift
// Add message handler
let contentController = WKUserContentController()
contentController.add(self, name: "phoneCall")

let config = WKWebViewConfiguration()
config.userContentController = contentController

// In your handler
func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    if message.name == "phoneCall", let phoneNumber = message.body as? String {
        if let url = URL(string: "tel://\(phoneNumber)") {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }
}
```

Then in the web code, you would call:
```javascript
window.webkit.messageHandlers.phoneCall.postMessage(phoneNumber);
```

## Testing

After implementing, test that:
1. Clicking phone numbers in the WebView opens the Phone app
2. The phone number is correctly formatted (e.g., `+971503043570`)
3. No error -1002 appears in the console

## Current Web Implementation

The web code already formats phone numbers correctly:
- Removes spaces, dashes, parentheses
- Ensures `+` prefix for international numbers
- Formats as `tel:+971503043570`

The web code will work once the native app is updated to handle `tel:` protocol.

## Priority

**HIGH** - This is blocking users from calling directly from the app, which is a critical feature for a business app.

