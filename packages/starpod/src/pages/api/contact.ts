import type { APIRoute } from 'astro';

import { jsonError } from '../../lib/api-errors';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return jsonError(
      400,
      'invalid_body',
      'Request body could not be parsed as form data',
      'Send a multipart/form-data or application/x-www-form-urlencoded body with name, email, and message fields.'
    );
  }

  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  // Validate the data - you'll probably want to do more than this
  if (!name || !email || !message) {
    const missing = [
      !name && 'name',
      !email && 'email',
      !message && 'message'
    ].filter(Boolean);
    return jsonError(
      400,
      'missing_fields',
      `Missing required fields: ${missing.join(', ')}`,
      'Provide name, email, and message form fields.'
    );
  }

  if (!import.meta.env.DISCORD_WEBHOOK) {
    return jsonError(
      500,
      'not_configured',
      'The contact form is not configured on this deployment',
      'Set the DISCORD_WEBHOOK environment variable, or reach the hosts via the links on /contact.'
    );
  }

  try {
    const webhookResponse = await fetch(import.meta.env.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [
          {
            title: 'New Contact Form Submission',
            color: 0x5865f2,
            fields: [
              {
                name: 'Name',
                value: String(name),
                inline: true
              },
              {
                name: 'Email',
                value: String(email),
                inline: true
              },
              {
                name: 'Message',
                value: String(message),
                inline: false
              }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      })
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook responded with ${webhookResponse.status}`);
    }
  } catch {
    return jsonError(
      502,
      'delivery_failed',
      'Your message could not be delivered',
      'Try again in a few minutes, or reach the hosts via the links on /contact.'
    );
  }

  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      message: `Thanks for contacting us! We'll be in touch soon.`
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }
  );
};

// Any other method on this endpoint gets a structured JSON 405, not an HTML
// error page.
export const ALL: APIRoute = () => {
  return jsonError(
    405,
    'method_not_allowed',
    'Only POST is supported on this endpoint',
    'Send a POST request with name, email, and message form fields.',
    { Allow: 'POST' }
  );
};
