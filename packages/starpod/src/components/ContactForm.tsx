import { useState } from 'preact/hooks';

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; message: string }
  | { state: 'error'; message: string };

const FIELD =
  'block w-full rounded-thumb border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted outline-none! transition-[border-color,box-shadow] duration-200 focus:border-accent focus:ring-4 focus:ring-accent-soft';
const LABEL = 'text-ink mb-2 block text-md leading-5 font-semibold';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setStatus({ state: 'sending' });

    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      const data = await response.json().catch(() => ({}));
      const message: string | undefined = data.message ?? data.error?.message;

      setStatus(
        response.ok
          ? { state: 'sent', message: message ?? 'Thanks! Your message is on its way.' }
          : {
              state: 'error',
              message: message ?? 'Your message didn’t go through. Please try again.'
            }
      );
    } catch {
      setStatus({
        state: 'error',
        message: 'We couldn’t reach the server. Check your connection and try again.'
      });
    }
  }

  if (status.state === 'sent') {
    return (
      <div
        class="border-line bg-surface max-w-xl rounded-card border p-6"
        role="status"
      >
        <p class="text-ink m-0 text-2xl leading-7 font-bold">Message sent</p>
        <p class="text-text mt-1 mb-0">{status.message}</p>
      </div>
    );
  }

  const sending = status.state === 'sending';

  return (
    <form class="flex max-w-xl flex-col gap-5" data-props-for="form-state" onSubmit={submit}>
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="ep-field" data-props-for="field">
          <label class={LABEL} for="name">
            Name
          </label>
          <input autocomplete="name" class={FIELD} id="name" name="name" required type="text" />
        </div>
        <div class="ep-field" data-props-for="field">
          <label class={LABEL} for="email">
            Email
          </label>
          <input
            autocomplete="email"
            class={FIELD}
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
      </div>

      <div class="ep-field" data-props-for="field">
        <label class={LABEL} for="message">
          Message
        </label>
        <textarea
          class={`${FIELD} min-h-40 resize-y`}
          id="message"
          name="message"
          placeholder="A question, a topic for the show, a whiskey we should try…"
          required
        />
      </div>

      {status.state === 'error' && (
        <p class="text-ink border-line m-0 rounded-row border px-4 py-3 text-md leading-5" role="alert">
          {status.message}
        </p>
      )}

      <div>
        <button
          class="button-secondary ep-send w-full justify-center disabled:cursor-progress disabled:opacity-70 sm:w-auto"
          disabled={sending}
          type="submit"
        >
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}
