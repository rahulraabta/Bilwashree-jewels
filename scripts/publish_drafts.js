// scripts/publish_drafts.js
const { createClient } = require('next-sanity');

async function publishAllDrafts() {
  const client = createClient({
    projectId: '93zlbnv8',
    dataset: 'production',
    apiVersion: '2024-04-04',
    useCdn: false,
    token: process.env.SANITY_TOKEN,
  });

  if (!client.config().token) {
    console.error('Error: SANITY_TOKEN is not set.');
    process.exit(1);
  }

  const drafts = await client.fetch('*[_id in path("drafts.**")]');
  console.log(`Found ${drafts.length} drafts.`);

  if (drafts.length === 0) {
    console.log('Nothing to publish.');
    return;
  }

  for (const draft of drafts) {
    const publishedId = draft._id.replace('drafts.', '');
    const { _id, ...rest } = draft;

    console.log(`Publishing: ${draft.name || draft._id}`);
    try {
      await client.transaction()
        .createOrReplace({ _id: publishedId, ...rest })
        .delete(draft._id)
        .commit();
    } catch (e) {
      console.error(`Failed to publish ${draft._id}: ${e.message}`);
    }
  }

  console.log('All drafts published successfully.');
}

publishAllDrafts().catch(console.error);
