/**
 * Configuration module for the PDS Server Status
 */
export class Config {
  /**
   * The base URL of the PDS (Personal Data Server).
   * @default none
   */
  static readonly PDS_URL: string = "https://tophhie.social";

  /**
   * The base URL of the Tophhie Cloud API.
   * @default none
   */
  static readonly TOPHHIE_CLOUD_API_URL: string = "https://api.tophhie.cloud";
}