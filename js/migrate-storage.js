// Migration script: Move data from localStorage to IndexedDB
// This runs automatically on first page load

async function migrateLocalStorageToIndexedDB() {
  console.log('Checking for localStorage data to migrate...');
  
  // Wait for db to initialize
  await db.initPromise;
  
  const collections = ['products', 'collections', 'slideshow', 'orders', 'users'];
  let itemsMigrated = 0;
  
  for (const collectionName of collections) {
    try {
      const data = localStorage.getItem(collectionName);
      if (data) {
        const items = JSON.parse(data);
        console.log(`Found ${items.length} items in localStorage.${collectionName}`);
        
        // Migrate to IndexedDB
        for (const item of items) {
          try {
            await db.collection(collectionName).doc(item.id).set(item);
            itemsMigrated++;
          } catch (error) {
            console.error(`Failed to migrate ${item.id}:`, error);
          }
        }
        
        console.log(`Migrated ${items.length} items from ${collectionName}`);
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

// Run migration automatically
document.addEventListener('DOMContentLoaded', async () => {
  const migrationDone = sessionStorage.getItem('migration_done');
  if (!migrationDone) {
    try {
      await migrateLocalStorageToIndexedDB();
      sessionStorage.setItem('migration_done', 'true');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
});
