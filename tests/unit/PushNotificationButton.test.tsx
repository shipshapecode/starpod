import { render, screen, waitFor } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PushNotificationButton from '../../src/components/PushNotificationButton';
import {
  notificationPermission,
  isSubscribed
} from '../../src/components/notificationState';

describe('PushNotificationButton', () => {
  beforeEach(() => {
    notificationPermission.value = 'default';
    isSubscribed.value = false;
    vi.clearAllMocks();
  });

  it('does not render when notifications are not supported', () => {
    // Mock unsupported browser
    const originalNotification = (window as any).Notification;
    delete (window as any).Notification;

    const { container } = render(<PushNotificationButton />);
    expect(container.firstChild).toBeNull();

    // Restore
    (window as any).Notification = originalNotification;
  });

  it('renders bell icon button when notifications are supported', async () => {
    // Mock supported browser
    (window as any).Notification = {
      permission: 'default',
      requestPermission: vi.fn()
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ready: Promise.resolve({
          pushManager: {
            getSubscription: vi.fn().mockResolvedValue(null)
          }
        })
      },
      writable: true
    });

    render(<PushNotificationButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute(
        'aria-label',
        'Enable push notifications'
      );
    });
  });

  it('shows filled bell icon when subscribed', async () => {
    (window as any).Notification = {
      permission: 'granted',
      requestPermission: vi.fn()
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ready: Promise.resolve({
          pushManager: {
            getSubscription: vi.fn().mockResolvedValue({})
          }
        })
      },
      writable: true
    });

    render(<PushNotificationButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute(
        'aria-label',
        'Disable push notifications'
      );
    });
  });

  it('has proper accessibility attributes', async () => {
    (window as any).Notification = {
      permission: 'default',
      requestPermission: vi.fn()
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ready: Promise.resolve({
          pushManager: {
            getSubscription: vi.fn().mockResolvedValue(null)
          }
        })
      },
      writable: true
    });

    render(<PushNotificationButton />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
    });
  });
});
