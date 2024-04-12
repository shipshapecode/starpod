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
   * A very short description of your show
   */
  blurb: string;
  /**
   * A somewhat longer description of what your show is about
   */
  description: string;
  /**
   * A list of hosts and their info
   */
  hosts: Array<Host>;
  platforms: {
    apple?: string;
    overcast?: string;
    spotify?: string;
    youtube?: string;
  };
  /**
   * The url to the RSS feed where your podcast is hosted
   */
  rssFeed: string;
};

export const defineStarpodConfig = (config: StarpodConfig) => config;
