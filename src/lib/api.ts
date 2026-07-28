import type { Repo } from "@atproto/api/dist/client/types/com/atproto/sync/listRepos";
import { Config } from "../config";
import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({
  service: Config.PDS_URL,
})

/**
 * Shapes of the remote responses this module consumes. Every field is optional:
 * these come from a third-party server and must not be assumed present.
 */
export interface PdsHealth {
  version?: string;
}

export interface PdsDescription {
  did?: string;
  inviteCodeRequired?: boolean;
  availableUserDomains?: string[];
  contact?: { email?: string };
  links?: { privacyPolicy?: string; termsOfService?: string };
}

const getDidsFromPDS = async (): Promise<Repo[]> => {
    const { data } = await agent.com.atproto.sync.listRepos({
    });
    return data.repos;
}

const getHealthFromPDS = async (): Promise<PdsHealth> => {
    const response = await fetch(`${Config.PDS_URL}/xrpc/_health`);
    const data = await response.json();
    return data as PdsHealth;
}

const getDescriptionFromPDS = async (): Promise<PdsDescription> => {
    const response = await fetch(`${Config.PDS_URL}/xrpc/com.atproto.server.describeServer`);
    const data = await response.json();
    return data as PdsDescription;
}

const getHandleFromDid = async (did: string): Promise<string> => {
    const response = await fetch(`https://plc.directory/${encodeURIComponent(did)}`);
    const data = await response.json();

    if (data.alsoKnownAs) {
      const handleAtUri = (data.alsoKnownAs as string[]).find((url: string) => url.startsWith("at://"));
      const handle = handleAtUri?.split("/")[2];
      if (!handle) {
        return "Handle not found";
      } else {
        return handle;
      }
    } else {
      return "Handle not found";
    }
}

const getHeatmapData = async (): Promise<Record<string, number>> => {
    const response = await fetch(`${Config.TOPHHIE_CLOUD_API_URL}/pds/blueskyHeatmap`);
    const data = await response.json();
    return data as Record<string, number>;
}

const getTotalPostsThisYear = async (): Promise<number> => {
    const data = await getHeatmapData();
    return getTotalSum(data);
}

const getBlobUsageFromPDS = async (): Promise<string> => {
    const response = await fetch(`${Config.TOPHHIE_CLOUD_API_URL}/pds/blobStorageUsageBytes`);
    const data = await response.json();
    return formatBlobUsageResponse(data);
}

export { getDidsFromPDS, getHealthFromPDS, getDescriptionFromPDS, getHandleFromDid, getTotalPostsThisYear, getBlobUsageFromPDS };

// Helper Functions

function getTotalSum(data: Record<string, number>): number {
  if (data == null || typeof data !== "object") {
    return 0;
  }

  return Object.values(data).reduce<number>(
    (sum, value) => (typeof value === "number" && Number.isFinite(value) ? sum + value : sum),
    0
  );
}

function formatBlobUsageResponse(data: { usageBytes: string }): string {
  const bytes = Number.parseInt(data?.usageBytes, 10);
  if (!Number.isFinite(bytes)) {
    return "Unavailable";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}