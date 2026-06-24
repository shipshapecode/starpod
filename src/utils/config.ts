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
   * Optional call-to-action shown in the nav rail and mobile app-bar. When
   * omitted, Starpod renders a "Subscribe" button pointing at your primary
   * platform link (or RSS feed). Repoint it at anything you like — newsletter,
   * Patreon, live-show tickets, a Discord invite, etc.
   */
  cta?: {
    /**
     * The button label. Defaults to "Subscribe".
     */
    label?: string;
    /**
     * Where the button links. Defaults to your first platform link, then RSS.
     */
    href?: string;
  };
};

export const defineStarpodConfig = (config: StarpodConfig) => config;
