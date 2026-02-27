# Push Notifications - Implementation Guide

## Overview
This document provides a comprehensive guide for completing the push notification system, including server-side tasks, suggested opportunities, and environment configuration.

## Current Status

### ✅ Completed (Client-Side)
- Bell icon integrated into platforms list (now positioned as the last icon)
- Welcome notification on subscription
- Browser support detection
- Push subscription management (subscribe/unsubscribe)
- Service worker for handling push events
- Conditional logging (only in dev mode)
- Test notification keyboard hotkey (Ctrl+Shift+P or Cmd+Shift+P)
- Episode artwork support in notifications
- Environment variable support for VAPID keys and API URLs

### ⚠️ Image Paths Verification
All notification image paths are valid:
- ✅ `/android-chrome-192x192.png` - EXISTS (used for notification icon)
- ✅ `/favicon-32x32.png` - EXISTS (used for notification badge)
- ✅ `/android-chrome-384x384.png` - EXISTS (used for test episode art)

## Environment Variables

Add these to your `.env` file:

```env
# VAPID Keys for Push Notifications
# Generate using: npx web-push generate-vapid-keys
PUBLIC_VAPID_KEY=your-public-vapid-key-here
VAPID_PRIVATE_KEY=your-private-vapid-key-here

# API URL for subscription management
PUBLIC_API_URL=https://your-api-domain.com
```

## Server-Side Tasks Remaining

### 1. Generate VAPID Keys
```bash
# Install web-push if not already installed
npm install -g web-push

# Generate VAPID keys
npx web-push generate-vapid-keys

# Add the keys to your environment variables
```

### 2. Create API Endpoints

#### POST `/api/subscribe`
**Purpose:** Store push subscription in database

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription saved"
}
```

**Implementation Tasks:**
- Create database table for subscriptions
- Validate subscription data
- Store subscription with user identification (if applicable)
- Handle duplicate subscriptions
- Return appropriate error codes

#### POST `/api/unsubscribe`
**Purpose:** Remove push subscription from database

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription removed"
}
```

**Implementation Tasks:**
- Find and delete subscription by endpoint
- Handle cases where subscription doesn't exist
- Return appropriate status codes

### 3. RSS Feed Monitor

**Purpose:** Detect new episodes and trigger push notifications

**Implementation Tasks:**
- Create scheduled job to check RSS feed periodically (e.g., every 15-30 minutes)
- Compare current episodes with last checked state
- Detect new episodes
- Extract episode metadata (title, description, image, URL)
- Trigger push notifications for all subscribers

**Suggested Technologies:**
- Cron job or scheduled task
- RSS parser library (e.g., `rss-parser` for Node.js)
- Database to track last checked episode

**Example Pseudocode:**
```javascript
async function checkForNewEpisodes() {
  const feed = await parseFeed(RSS_FEED_URL);
  const latestEpisode = feed.items[0];
  const lastCheckedEpisode = await getLastCheckedEpisode();
  
  if (latestEpisode.id !== lastCheckedEpisode.id) {
    // New episode detected!
    await sendPushNotificationToAllSubscribers({
      title: `New Episode: ${latestEpisode.title}`,
      body: latestEpisode.description,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      image: latestEpisode.imageUrl,
      url: `/${latestEpisode.slug}`,
      tag: 'new-episode'
    });
    
    await updateLastCheckedEpisode(latestEpisode);
  }
}
```

### 4. Push Notification Sender

**Purpose:** Send push notifications to subscribers

**Implementation Tasks:**
- Use web-push library to send notifications
- Retrieve all active subscriptions from database
- Send notification to each subscription
- Handle failed deliveries (expired/invalid subscriptions)
- Remove invalid subscriptions from database
- Implement rate limiting if needed

**Example Code (Node.js):**
```javascript
const webpush = require('web-push');

// Configure VAPID details
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendNotificationToSubscriber(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    if (error.statusCode === 410) {
      // Subscription expired - remove from database
      await removeSubscription(subscription.endpoint);
    }
    return { success: false, error };
  }
}

async function sendPushNotificationToAllSubscribers(notificationData) {
  const subscriptions = await getAllSubscriptions();
  
  const results = await Promise.allSettled(
    subscriptions.map(sub => 
      sendNotificationToSubscriber(sub, notificationData)
    )
  );
  
  return results;
}
```

### 5. Database Schema

**Subscriptions Table:**
```sql
CREATE TABLE push_subscriptions (
  id SERIAL PRIMARY KEY,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_id INTEGER, -- Optional: if you want to track per-user
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_notification_at TIMESTAMP
);

CREATE INDEX idx_endpoint ON push_subscriptions(endpoint);
CREATE INDEX idx_user_id ON push_subscriptions(user_id);
```

**Episodes Tracking Table:**
```sql
CREATE TABLE episode_notifications (
  id SERIAL PRIMARY KEY,
  episode_id TEXT UNIQUE NOT NULL,
  episode_title TEXT NOT NULL,
  notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Error Handling & Monitoring

**Implementation Tasks:**
- Log all push notification attempts
- Track success/failure rates
- Set up alerts for high failure rates
- Monitor subscription database size
- Track notification engagement (clicks)

## Push Notification Opportunities

### 1. Episode Release Schedule
**Opportunity:** Pre-announcement notifications
- Send notification 1 hour before scheduled episode release
- "New episode dropping in 1 hour!"
- Build anticipation and improve immediate engagement

### 2. Episode Highlights/Quotes
**Opportunity:** Content teasers
- Send interesting quotes or highlights from recent episodes
- Can be scheduled 1-2 days after release
- Increases engagement with older content

### 3. Series/Theme Notifications
**Opportunity:** Topical grouping
- When starting a new series or theme
- "New series alert: AI Deep Dives"
- Help listeners follow multi-episode storylines

### 4. Guest Announcements
**Opportunity:** Celebrity/Notable guest hype
- Announce special guests before episode release
- "Tomorrow: Interview with [Notable Person]"
- Leverage guest's fanbase

### 5. Live Recording Notifications
**Opportunity:** Real-time engagement
- If you do live recordings or streams
- Notify subscribers when going live
- Build community engagement

### 6. Milestone Celebrations
**Opportunity:** Community building
- Episode 100, 1M downloads, etc.
- "We hit 100 episodes! Thank you!"
- Strengthen listener relationship

### 7. User Preferences & Frequency
**Opportunity:** Personalization
- Allow users to choose notification types
- Frequency preferences (all episodes, weekly digest, etc.)
- Episode categories of interest
- Implement preference management UI

### 8. Time Zone Optimization
**Opportunity:** Optimal delivery timing
- Send notifications at optimal times based on user location
- Avoid late night notifications
- Improve engagement rates

### 9. Interactive Notifications
**Opportunity:** Direct actions
- Add action buttons to notifications:
  - "Listen Now"
  - "Remind Me Later"
  - "Share"
- Quick engagement without opening browser

### 10. Sponsor/Partner Promotions
**Opportunity:** Monetization
- Occasional sponsor highlights (with clear opt-in)
- Special offers for listeners
- Revenue generation while respecting user experience

### 11. Episode Recommendations
**Opportunity:** Content discovery
- "Based on what you liked: Episode X"
- Help users discover older content
- Increase overall listening time

### 12. Listener Engagement
**Opportunity:** Two-way communication
- Ask for feedback: "Rate this episode"
- Polls or questions related to episode topics
- Build community participation

## Testing

### Manual Testing Checklist
1. ✅ Subscribe to notifications
2. ✅ Receive welcome notification
3. ✅ Test keyboard shortcut (Ctrl+Shift+P / Cmd+Shift+P)
4. ✅ Verify test notification displays correctly with episode art
5. ⚠️ Unsubscribe from notifications (requires server API)
6. ⚠️ Test actual episode notification (requires server implementation)

### Automated Testing
- Unit tests for client-side components ✅
- Integration tests for API endpoints (TODO)
- End-to-end tests for subscription flow (TODO)

## Security Considerations

1. **VAPID Keys**: Keep private key secure, never expose in client code
2. **Rate Limiting**: Implement rate limits on subscription endpoints
3. **Validation**: Validate all subscription data
4. **HTTPS Only**: Push notifications require HTTPS
5. **User Privacy**: Store minimal data, respect user preferences
6. **Spam Prevention**: Limit notification frequency

## Performance Considerations

1. **Batch Processing**: Send notifications in batches to avoid overwhelming server
2. **Retry Logic**: Implement exponential backoff for failed deliveries
3. **Database Indexing**: Index endpoint field for fast lookups
4. **Caching**: Cache subscription list between notifications
5. **Queue System**: Use message queue for large subscriber bases (e.g., Redis, RabbitMQ)

## Compliance & Best Practices

1. **User Consent**: Always get explicit permission
2. **Easy Unsubscribe**: Make it simple to opt-out
3. **Clear Communication**: Be transparent about notification types
4. **Frequency Limits**: Don't spam users
5. **Value Delivery**: Only send notifications users will appreciate
6. **Accessibility**: Ensure notifications are accessible

## Next Steps

### Immediate (High Priority)
1. Generate and configure VAPID keys
2. Set up database for subscriptions
3. Create `/api/subscribe` and `/api/unsubscribe` endpoints
4. Implement RSS feed monitor

### Short Term (Medium Priority)
5. Build notification sender service
6. Add error handling and monitoring
7. Test end-to-end flow in production

### Long Term (Enhancement)
8. Implement user preferences system
9. Add notification analytics
10. Explore advanced features (see opportunities above)

## Resources

- [Web Push API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push npm package](https://www.npmjs.com/package/web-push)
- [VAPID Key Generation](https://web.dev/push-notifications-server-codelab/)
- [Best Practices for Push Notifications](https://web.dev/notifications/)
