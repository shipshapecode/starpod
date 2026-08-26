import {
  array,
  minLength,
  nonEmpty,
  object,
  optional,
  pipe,
  safeParse,
  string,
  url,
  type GenericSchema
} from 'valibot';

export type Host = {
  /**
   * The name of the host
   */
  name: string;
  /**
   * A bio about the host to display
   */
  bio: string;
  /**
   * A url to an image to use for the host
   */
  img: string;
  /**
   * A url to the host's GitHub
   */
  github?: string;
  /**
   * A url to the host's Twitter
   */
  twitter?: string;
  /**
   * A url to the host's website
   */
  website?: string;
};

export type NavLink = {
  /**
   * Link text, e.g. "Store".
   */
  label: string;
  /**
   * Destination: an external URL or a local path like "/sponsor" for a
   * custom page you added to your site's src/pages/.
   */
  href: string;
};

export type StarpodConfig = {
  /**
   * A very short tagline for your show. Generally, no more than one sentence. Less is more here.
   */
  blurb: string;
  /**
   * A somewhat longer description of what your show is about. This should still ideally be fairly short, and should usually be 2-4 sentences.
   */
  description: string;
  /**
   * A list of your show's hosts and their info.
   */
  hosts: Array<Host>;
  /**
   * Links to the platforms your show is available on.
   */
  platforms: {
    apple?: string;
    appleIdNumber?: string;
    overcast?: string;
    pocketCasts?: string;
    spotify?: string;
    youtube?: string;
  };
  /**
   * The url to the RSS feed where your podcast is hosted.
   */
  rssFeed: string;
  /**
   * Extra navigation links shown after About and Contact — e.g. a merch
   * store, or custom pages your site adds (like a sponsor page).
   */
  links?: Array<NavLink>;
};

const urlField = (name: string) =>
  pipe(string(`${name} must be a string`), url(`${name} must be a valid URL`));

const HostSchema: GenericSchema<Host> = object({
  name: pipe(string(), nonEmpty('every host needs a name')),
  bio: string('every host needs a bio (an empty string is fine)'),
  img: pipe(
    string(),
    nonEmpty(
      "every host needs an img — a filename inside your site's src/img/people/"
    )
  ),
  github: optional(urlField('host github')),
  twitter: optional(urlField('host twitter')),
  website: optional(urlField('host website'))
});

const NavLinkSchema: GenericSchema<NavLink> = object({
  label: pipe(string(), nonEmpty('every link needs a label')),
  href: pipe(string(), nonEmpty('every link needs an href'))
});

const StarpodConfigSchema: GenericSchema<StarpodConfig> = object({
  blurb: pipe(
    string('blurb must be a string'),
    nonEmpty('blurb is required — a one-line tagline for your show')
  ),
  description: pipe(
    string('description must be a string'),
    nonEmpty('description is required — a few sentences about your show')
  ),
  hosts: pipe(
    array(HostSchema, 'hosts must be an array'),
    minLength(1, 'add at least one host')
  ),
  platforms: object(
    {
      apple: optional(urlField('platforms.apple')),
      appleIdNumber: optional(string()),
      overcast: optional(urlField('platforms.overcast')),
      pocketCasts: optional(urlField('platforms.pocketCasts')),
      spotify: optional(urlField('platforms.spotify')),
      youtube: optional(urlField('platforms.youtube'))
    },
    'platforms is required (an empty object is fine)'
  ),
  rssFeed: urlField('rssFeed'),
  links: optional(array(NavLinkSchema, 'links must be an array'))
});

/**
 * Validates a Starpod config, throwing a readable error listing every
 * problem. Runs both from `defineStarpodConfig` (so mistakes surface the
 * moment the config file loads) and inside the integration (so a config
 * that skipped the helper is still checked).
 */
export function validateStarpodConfig(config: StarpodConfig): StarpodConfig {
  const result = safeParse(StarpodConfigSchema, config);
  if (!result.success) {
    const problems = result.issues
      .map((issue) => {
        const path = issue.path?.map((segment) => segment.key).join('.');
        return `  - ${path ? `${path}: ` : ''}${issue.message}`;
      })
      .join('\n');
    throw new Error(
      `[starpod] Invalid Starpod config:\n${problems}\n\nSee https://github.com/shipshapecode/starpod#configuration for the full reference.`
    );
  }
  return result.output;
}

export const defineStarpodConfig = (config: StarpodConfig) =>
  validateStarpodConfig(config);
