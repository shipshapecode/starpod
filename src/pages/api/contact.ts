import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  // Validate the data - you'll probably want to do more than this
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({
        message: 'Missing required fields'
      }),
      { status: 400 }
    );
  }

  await fetch(import.meta.env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Name:* ${name}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Email:* ${email}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:* ${message}`
          }
        }
      ]
    })
  });

  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      message: `Thanks for contacting us! We'll be in touch soon.`
    }),
    { status: 200 }
  );
};
