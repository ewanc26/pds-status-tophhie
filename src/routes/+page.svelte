<script lang="ts">
  import { onMount } from 'svelte';
  import { getDidsFromPDS, 
  getHealthFromPDS, 
  getDescriptionFromPDS, 
  getHandleFromDid,
  getTotalPostsThisYear,
  getBlobUsageFromPDS } from '$lib/api';
	import type { Repo } from '@atproto/api/dist/client/types/com/atproto/sync/listRepos';

  let metrics = {
    load: '0.00 / 0.00 / 0.00',
    cpu: '0.0%',
    mem: '611.8 MB / 3.7 GB',
    net: '3.4 GB / 1.9 GB',
    diskUsed: '2.3 GB',
    diskFree: '28.2 GB'
  };

  let accounts: Repo[] = [];
  let pdsHealth: any;
  let pdsDescription: any;
  let r2StorageUsage: string = 'Loading...';
  let totalPostsThisYear: number = 0;

  onMount(async () => {
    // Fetch accounts from PDS
    try {
      accounts = await getDidsFromPDS();
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }

    // Fetch PDS health metrics
    try {
      pdsHealth = await getHealthFromPDS();
    } catch (error) {
      console.error('Error fetching PDS health:', error);
    }

    // Fetch PDS description
    try {
      pdsDescription = await getDescriptionFromPDS();
    } catch (error) {
      console.error('Error fetching PDS description:', error);
    }

    // Fetch total posts this year
    try {
      totalPostsThisYear = await getTotalPostsThisYear();
    } catch (error) {
      console.error('Error fetching total posts this year:', error);
    }

    // Fetch R2 Storage Usage
    try {
      r2StorageUsage = await getBlobUsageFromPDS();
    } catch (error) {
      console.error('Error fetching R2 storage usage:', error);
    }
  });
</script>

<div class="min-h-screen bg-[#100235] text-gray-100 p-15">
  <!-- Page Header -->
   <img
    src="https://blob.tophhie.cloud/tophhiecloud-resources/Logos/tophhiecloud-white.png"
    height="50"
    alt="Tophhie Social Logo"
    id="Logo"
    style="max-height:50px; display:block; margin-bottom:20px;"
  />
  <h1 class="text-2xl font-bold mb-4">Tophhie Social Server Status</h1>

  <!-- Service Information -->
  <section class="mb-8">
    <h2 class="text-xl font-semibold mb-4">Service Information</h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center bg-gray-800 p-4 rounded-lg">
      <div>
        <p class="text-gray-400 text-xs">Service Reachable</p>
        <p class="font-semibold">{pdsHealth?.version != null ? "✅" : "❌"}</p>
      </div>
      <div>
        <p class="text-gray-400 text-xs">PDS Version</p>
        <p class="font-semibold">{pdsHealth?.version ?? 'Loading...'}</p>
      </div>
      <div>
        <p class="text-gray-400 text-xs">Server DID</p>
        <p class="font-semibold">{pdsDescription?.did ?? 'Loading...'}</p>
      </div>
      <div>
        <p class="text-gray-400 text-xs">No. of Accounts</p>
        <p class="font-semibold">{accounts.length}</p>
      </div>
      <div>
        <p class="text-gray-400 text-xs">Invite Required</p>
        <p class="font-semibold">{pdsDescription?.inviteCodeRequired ? "Yes" : "No"}</p>
      </div>
    </div>
  </section>

  <!-- Interesting Stats -->
   <section class="mb-8">
    <h2 class="text-xl font-semibold mb-4">Statistics</h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center bg-gray-800 p-4 rounded-lg">
      <div>
        <p class="text-gray-400 text-xs">Total Posts for {(new Date()).getFullYear()}</p>
        <p class="font-semibold">{totalPostsThisYear}</p>
      </div>
      <div>
        <p class="text-gray-400 text-xs">Cloudflare R2 Blob Usage</p>
        <p class="font-semibold">{r2StorageUsage}</p>
      </div>
    </div>
  </section>

  <!-- Accounts Table -->
  <section>
    <h2 class="text-xl font-semibold mb-4">Accounts on tophhie.social</h2>
    <div class="text-sm text-gray-400 mb-2">
      <p>
        <strong>Available User Domains:</strong> {pdsDescription?.availableUserDomains.join(", ")}
      </p>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm border border-gray-700 rounded-lg">
        <thead class="bg-gray-800 text-gray-300">
          <tr>
            <th class="px-4 py-2 text-left">DID</th>
            <th class="px-4 py-2 text-left">Handle</th>
            <th class="px-4 py-2 text-left">PLC Directory</th>
          </tr>
        </thead>
        <tbody>
          {#each accounts as acc}
            <tr class="border-t border-gray-700 hover:bg-gray-800">
              <td class="px-4 py-2">{acc.did}</td>
              {#await getHandleFromDid(acc.did)}
                <td>Loading...</td>
              {:then handle}
                <td>{handle}</td>
              {:catch error}
                <td>Error</td>
              {/await}
              <td class="px-4 py-2">
                <a href="https://plc.directory/{acc.did}" target="_blank" title="Open PLC Directory">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 3h7v7h-2V6.41l-9.29 9.29-1.42-1.42L17.59 5H14V3z"/>
                    <path d="M5 5h7v2H7v10h10v-5h2v7H5V5z"/>
                  </svg>
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Contact -->
    <section>
      <h2 class="text-xl font-semibold mb-4 mt-8">Contact</h2>
      {#if pdsDescription?.contact.email}
        <p class="text-sm">For support or enquiries, please contact us at <a href="mailto:{pdsDescription?.contact.email}" class="text-blue-400 hover:underline">{pdsDescription?.contact.email}</a>.</p>
      {/if}
    </section>

  <!-- Links -->
   <section>
    <h2 class="text-xl font-semibold mb-4 mt-8">Links</h2>
    <ul class="list-disc list-inside">
      <li><a href="{pdsDescription?.links.privacyPolicy}" class="text-blue-400 hover:underline">Privacy Policy</a></li>
      <li><a href="{pdsDescription?.links.termsOfService}" class="text-blue-400 hover:underline">Terms of Service</a></li>
    </ul>
   </section>
</div>
