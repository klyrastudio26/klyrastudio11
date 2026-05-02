// Migration script: Move data from localStorage to IndexedDB
// This runs automatically on first page load

async function waitForDB() {
  // Wait for db to be defined globally
  let attempts = 0;
  while (typeof db === 'undefined' && attempts < 100) {
    await new Promise(resolve => setTimeout(resolve, 50));
    attempts++;
  }
  
  if (typeof db === 'undefined') {
    console.error('DB failed to load');
    return;
  }
  
  // Wait for db to initialize
  await db.initPromise;
}

async function migrateLocalStorageToIndexedDB() {
  console.log('Checking for localStorage data to migrate...');
  
  // Wait for db to initialize
  await waitForDB();
  
  const collections = ['products', 'collections', 'slideshow', 'orders', 'users'];
  let itemsMigrated = 0;
  
  for (const collectionName of collections) {
    try {
      const data = localStorage.getItem(collectionName);
      if (data) {
        const items = JSON.parse(data);
        console.log(`Found ${items.length} items in localStorage.${collectionName}`);
        
        // Get existing items in IndexedDB
        const existingSnapshot = await db.collection(collectionName).get();
        const existingIds = new Set();
        existingSnapshot.forEach(doc => {
          existingIds.add(doc.id);
        });
        
        // Only migrate items that don't already exist in IndexedDB
        for (const item of items) {
          try {
            if (!existingIds.has(item.id)) {
              await db.collection(collectionName).doc(item.id).set(item);
              itemsMigrated++;
            }
          } catch (error) {
            console.error(`Failed to migrate ${item.id}:`, error);
          }
        }
        
        console.log(`Migrated ${itemsMigrated} new items from ${collectionName}`);
      }
    } catch (error) {
      console.error(`Error migrating ${collectionName}:`, error);
    }
  }
  
  console.log(`✓ Migration complete! Migrated ${itemsMigrated} total items`);
  
  // Also migrate cart data
  const cartData = localStorage.getItem('cart');
  if (cartData) {
    localStorage.setItem('cart_migrated', 'true');
    console.log('Cart data preserved');
  }
  
  return itemsMigrated;
}

// Run migration automatically after db is defined
async function startMigration() {
  const migrationDone = sessionStorage.getItem('migration_done');
  if (!migrationDone) {
    try {
      await migrateLocalStorageToIndexedDB();
      sessionStorage.setItem('migration_done', 'true');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}

// Expose a global migration promise so pages can wait for the process
window.dbMigrationPromise = startMigration().catch((error) => {
  console.error('Migration startup failed:', error);
});

// Also retry on DOMContentLoaded if the first attempt did not run yet
window.addEventListener('DOMContentLoaded', () => {
  if (!window.dbMigrationPromise) {
    window.dbMigrationPromise = startMigration().catch((error) => {
      console.error('Migration startup failed:', error);
    });
  }
});
