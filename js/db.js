// IndexedDB-based database system (No quota limits like localStorage)
// Data is stored locally in the browser with unlimited capacity

class SimpleDB {
  constructor() {
    this.dbName = 'KlyraStudio';
    this.version = 1;
    this.db = null;
    this.initPromise = this.initializeData();
  }

  async initializeData() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores for each collection
        const collections = ['products', 'collections', 'slideshow', 'orders', 'users', 'cart'];
        
        collections.forEach(collectionName => {
          if (!db.objectStoreNames.contains(collectionName)) {
            const store = db.createObjectStore(collectionName, { keyPath: 'id' });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            console.log(`Created object store: ${collectionName}`);
          }
        });
      };
    });
  }

  collection(name) {
    return new LocalCollection(name, this.db, this.initPromise);
  }
}

class LocalCollection {
  constructor(name, db, initPromise) {
    this.name = name;
    this.db = db;
    this.initPromise = initPromise;
  }

  async getDB() {
    await this.initPromise;
    return this.db;
  }

  async add(data) {
    const db = await this.getDB();
    const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newItem = { id, ...data };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.name], 'readwrite');
      const store = transaction.objectStore(this.name);
      const request = store.add(newItem);

      request.onsuccess = () => {
        console.log(`Added item to ${this.name}:`, id);
        resolve({ id, data: () => data });
      };

      request.onerror = () => reject(request.error);
    });
  }

  doc(id) {
    return new LocalDocument(this.name, id, this.db, this.initPromise);
  }

  async get() {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.name], 'readonly');
      const store = transaction.objectStore(this.name);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result;
        const docs = items.map(item => ({
          id: item.id,
          data: () => {
            const copy = { ...item };
            delete copy.id;
            return copy;
          }
        }));

        resolve({
          empty: docs.length === 0,
          forEach: function(callback) {
            docs.forEach(doc => callback(doc));
          },
          docs: docs
        });
      };

      request.onerror = () => reject(request.error);
    });
  }

  where(field, operator, value) {
    return new LocalQuery(this.name, field, operator, value, this.db, this.initPromise);
  }
}

class LocalQuery {
  constructor(collectionName, field, operator, value, db, initPromise) {
    this.collectionName = collectionName;
    this.field = field;
    this.operator = operator;
    this.value = value;
    this.db = db;
    this.initPromise = initPromise;
  }

  async getDB() {
    await this.initPromise;
    return this.db;
  }

  async get() {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.collectionName], 'readonly');
      const store = transaction.objectStore(this.collectionName);
      const request = store.getAll();

      request.onsuccess = () => {
        let items = request.result;

        // Filter based on operator
        if (this.operator === '==') {
          items = items.filter(item => item[this.field] === this.value);
        }

        const docs = items.map(item => ({
          id: item.id,
          data: () => {
            const copy = { ...item };
            delete copy.id;
            return copy;
          }
        }));

        resolve({
          empty: docs.length === 0,
          forEach: function(callback) {
            docs.forEach(doc => callback(doc));
          },
          docs: docs
        });
      };

      request.onerror = () => reject(request.error);
    });
  }
}

class LocalDocument {
  constructor(collectionName, docId, db, initPromise) {
    this.collectionName = collectionName;
    this.docId = docId;
    this.db = db;
    this.initPromise = initPromise;
  }

  async getDB() {
    await this.initPromise;
    return this.db;
  }

  async set(data) {
    const db = await this.getDB();
    const item = { id: this.docId, ...data };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.collectionName], 'readwrite');
      const store = transaction.objectStore(this.collectionName);
      const request = store.put(item);

      request.onsuccess = () => {
        console.log(`Updated document in ${this.collectionName}:`, this.docId);
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async update(data) {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.collectionName], 'readwrite');
      const store = transaction.objectStore(this.collectionName);
      const getRequest = store.get(this.docId);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (!item) {
          reject(new Error(`Document not found: ${this.docId}`));
          return;
        }

        const updatedItem = { ...item, ...data };
        const updateRequest = store.put(updatedItem);

        updateRequest.onsuccess = () => {
          console.log(`Updated document in ${this.collectionName}:`, this.docId);
          resolve();
        };

        updateRequest.onerror = () => reject(updateRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async delete() {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.collectionName], 'readwrite');
      const store = transaction.objectStore(this.collectionName);
      const request = store.delete(this.docId);

      request.onsuccess = () => {
        console.log(`Deleted document from ${this.collectionName}:`, this.docId);
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async get() {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.collectionName], 'readonly');
      const store = transaction.objectStore(this.collectionName);
      const request = store.get(this.docId);

      request.onsuccess = () => {
        const item = request.result;
        if (!item) {
          resolve(null);
          return;
        }

        const copy = { ...item };
        delete copy.id;
        resolve(copy);
      };

      request.onerror = () => reject(request.error);
    });
  }
}

// Initialize the database
const db = new SimpleDB();
