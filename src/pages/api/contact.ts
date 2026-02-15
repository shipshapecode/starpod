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

  await fetch(import.meta.env.DISCORD_WEBHOOK, {
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

  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      message: `Thanks for contacting us! We'll be in touch soon.`
    }),
    { status: 200 }
  );
};
