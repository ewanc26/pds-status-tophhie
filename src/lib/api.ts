import type { Repo } from "@atproto/api/dist/client/types/com/atproto/sync/listRepos";
import { Config } from "../config";
import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({
  service: Config.PDS_URL,
})

const getDidsFromPDS = async (): Promise<Repo[]> => {
    const { data } = await agent.com.atproto.sync.listRepos({
    });
    return data.repos;
}

const getHealthFromPDS = async (): Promise<any> => {
    const response = await fetch(`${Config.PDS_URL}/xrpc/_health`);
    const data = await response.json();
    return data;
}

const getDescriptionFromPDS = async (): Promise<any> => {
    const response = await fetch(`${Config.PDS_URL}/xrpc/com.atproto.server.describeServer`);
    const data = await response.json();
    return data;
}

const getHandleFromDid = async (did: string): Promise<string> => {
    const response = await fetch(`https://plc.directory/${did}`);
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

const getHeatmapData = async (): Promise<any> => {
    const response = await fetch(`${Config.TOPHHIE_CLOUD_API_URL}/pds/blueskyHeatmap`);
    const data = await response.json();
    return data;
}

const getTotalPostsThisYear = async (): Promise<any> => {
    const data = await getHeatmapData();
    return getTotalSum(data);
}

export { getDidsFromPDS, getHealthFromPDS, getDescriptionFromPDS, getHandleFromDid, getTotalPostsThisYear };

// Helper Functions

function getTotalSum(data: Record<string, number>): number {
  return Object.values(data).reduce((sum, value) => sum + value, 0);
}