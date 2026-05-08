// Supabase integration
// Check dynamically each time instead of once at load time
function isSupabaseReady() {
  return typeof window !== 'undefined' && window.supabase && typeof window.supabase.from === 'function';
}

// Supabase classes if available
class SupabaseCollection {
  constructor(name) {
    this.table = name;
  }

  async add(data) {
    const { data: result, error } = await window.supabase.from(this.table).insert(data, { returning: 'minimal' });
    if (error) {
      const message = error.message || '';
      if (error.code === '42703' || /column .* does not exist/i.test(message) || /schema cache/i.test(message) || /relation .* does not exist/i.test(message)) {
        console.warn('Supabase insert failed, falling back to local storage for', this.table, error);
        const coreDb = window.db || globalThis.db;
        const localCollection = new LocalCollection(this.table, coreDb?.db, coreDb?.initPromise, coreDb?.useIndexedDB ?? false);
        return localCollection.add(data);
      }
      console.error('❌ Supabase error adding to', this.table, ':', error);
      throw error;
    }
    console.log('✓ Added item to Supabase table:', this.table, '(minimal return)');
    return { id: null, data: () => data };
  }

  doc(id) {
    return new SupabaseDocument(this.table, id);
  }

  async get() {
    const { data, error } = await window.supabase.from(this.table).select('*');
    if (error) {
      const message = error.message || '';
      if (error.code === '42703' || /column .* does not exist/i.test(message) || /schema cache/i.test(message) || /relation .* does not exist/i.test(message)) {
        console.warn('Supabase fetch failed, falling back to local storage for', this.table, error);
        const coreDb = window.db || globalThis.db;
        const localCollection = new LocalCollection(this.table, coreDb?.db, coreDb?.initPromise, coreDb?.useIndexedDB ?? false);
        return localCollection.get();
      }
      console.error('❌ Supabase error fetching from', this.table, ':', error);
      throw error;
    }
    console.log('✓ Fetched', data.length, 'items from Supabase table:', this.table);
    const docs = data.map(item => ({
      id: item.id,
      data: () => {
        const copy = { ...item };
        delete copy.id;
        return copy;
      }
    }));
    return {
      empty: docs.length === 0,
      forEach: (callback) => docs.forEach(callback),
      docs: docs
    };
  }

  where(field, operator, value) {
    return new SupabaseQuery(this.table, field, operator, value);
  }
}

class SupabaseDocument {
  constructor(table, docId) {
    this.table = table;
    this.docId = docId;
  }

  async set(data) {
    const { error } = await window.supabase.from(this.table).upsert({ id: this.docId, ...data });
    if (error) {
      const message = error.message || '';
      if (error.code === '42703' || /column .* does not exist/i.test(message) || /schema cache/i.test(message) || /relation .* does not exist/i.test(message)) {
        console.warn('Supabase upsert failed, falling back to local storage for', this.table, error);
        const coreDb = window.db || globalThis.db;
        const localDoc = new LocalDocument(this.table, this.docId, coreDb?.db, coreDb?.initPromise, coreDb?.useIndexedDB ?? false);
        return localDoc.set(data);
      }
      throw error;
    }
  }

  async update(data) {
    const { error } = await window.supabase.from(this.table).update(data).eq('id', this.docId);
    if (error) {
      const message = error.message || '';
      if (error.code === '42703' || /column .* does not exist/i.test(message) || /schema cache/i.test(message) || /relation .* does not exist/i.test(message)) {
        console.warn('Supabase update failed, falling back to local storage for', this.table, error);
        const coreDb = window.db || globalThis.db;
        const localDoc = new LocalDocument(this.table, this.docId, coreDb?.db, coreDb?.initPromise, coreDb?.useIndexedDB ?? false);
        return localDoc.update(data);
      }
      throw error;
    }
  }

  async delete() {
    const { error } = await window.supabase.from(this.table).delete().eq('id', this.docId);
    if (error) throw error;
  }

  async get() {
    const { data, error } = await window.supabase.from(this.table).select('*').eq('id', this.docId).single();
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    const copy = { ...data };
    delete copy.id;
    return copy;
  }
}

class SupabaseQuery {
  constructor(table, field, operator, value) {
    this.table = table;
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  async get() {
    let query = window.supabase.from(this.table).select('*');
    if (this.operator === '==') {
      query = query.eq(this.field, this.value);
    }
    const { data, error } = await query;
    if (error) {
      const message = error.message || '';
      if (error.code === '42703' || /column .* does not exist/i.test(message) || /schema cache/i.test(message) || /relation .* does not exist/i.test(message)) {
        console.warn('Supabase query failed, falling back to local storage for', this.table, this.field);
        const localQuery = new LocalQuery(this.table, this.field, this.operator, this.value, null, Promise.resolve(), false);
        return localQuery.get();
      }
      throw error;
    }
    const docs = data.map(item => ({
      id: item.id,
      data: () => {
        const copy = { ...item };
        delete copy.id;
        return copy;
      }
    }));
    return {
      empty: docs.length === 0,
      forEach: (callback) => docs.forEach(callback),
      docs: docs
    };
  }
}

// Hybrid DB System: IndexedDB with localStorage fallback
// Automatically uses IndexedDB for large data, falls back to localStorage if needed

class SimpleDB {
  constructor() {
    this.dbName = 'KlyraStudio';
    this.version = 1;
    this.db = null;
    this.useIndexedDB = true;
    this.initPromise = this.initializeData();
  }

  async initializeData() {
    try {
      // Check if IndexedDB is supported
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, using localStorage');
        this.useIndexedDB = false;
        return this._initLocalStorage();
      }

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = () => {
          console.error('IndexedDB error:', request.error);
          console.warn('Falling back to localStorage');
          this.useIndexedDB = false;
          this._initLocalStorage();
          resolve();
        };

        request.onsuccess = () => {
          this.db = request.result;
          console.log('✓ IndexedDB initialized');
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const collections = ['products', 'collections', 'slideshow', 'orders', 'users', 'cart'];
          
          collections.forEach(collectionName => {
            if (!db.objectStoreNames.contains(collectionName)) {
              db.createObjectStore(collectionName, { keyPath: 'id' });
            }
          });
        };
      });
    } catch (error) {
      console.error('DB initialization error:', error);
      this.useIndexedDB = false;
      this._initLocalStorage();
    }
  }

  _initLocalStorage() {
    if (!localStorage.getItem('slideshow')) localStorage.setItem('slideshow', JSON.stringify([]));
    if (!localStorage.getItem('collections')) localStorage.setItem('collections', JSON.stringify([]));
    if (!localStorage.getItem('products')) localStorage.setItem('products', JSON.stringify([]));
    if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));
    if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
    console.log('✓ localStorage initialized');
  }

  collection(name) {
    const supabaseReady = isSupabaseReady();
    console.log(supabaseReady ? '✓ Using Supabase for collection:' : '⚠️ Supabase not ready, using local storage for collection:', name);
    if (supabaseReady) {
      return new SupabaseCollection(name);
    }
    return new LocalCollection(name, this.db, this.initPromise, this.useIndexedDB);
  }
}

class LocalCollection {
  constructor(name, db, initPromise, useIndexedDB) {
    this.name = name;
    this.db = db;
    this.initPromise = initPromise;
    this.useIndexedDB = useIndexedDB;
  }

  async getDB() {
    await this.initPromise;
    return this.db;
  }

  async add(data) {
    await this.initPromise;

    const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newItem = { id, ...data };

    if (!this.useIndexedDB) {
      // Fallback to localStorage
      try {
        const items = JSON.parse(localStorage.getItem(this.name) || '[]');
        items.push(newItem);
        localStorage.setItem(this.name, JSON.stringify(items));
      } catch (e) {
        console.error('localStorage quota exceeded:', e);
        throw e;
      }
    } else {
      // Use IndexedDB
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.name], 'readwrite');
        const store = transaction.objectStore(this.name);
        const request = store.add(newItem);

        request.onsuccess = () => resolve({ id, data: () => data });
        request.onerror = () => reject(request.error);
      });
    }

    return { id, data: () => data };
  }

  doc(id) {
    return new LocalDocument(this.name, id, this.db, this.initPromise, this.useIndexedDB);
  }

  async get() {
    await this.initPromise;

    if (!this.useIndexedDB) {
      // localStorage version
      const items = JSON.parse(localStorage.getItem(this.name) || '[]');
      const docs = items.map(item => ({
        id: item.id,
        data: () => { const copy = { ...item }; delete copy.id; return copy; }
      }));
      return {
        empty: docs.length === 0,
        forEach: (callback) => docs.forEach(callback),
        docs: docs
      };
    }

    // IndexedDB version
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.name], 'readonly');
      const store = transaction.objectStore(this.name);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result;
        const docs = items.map(item => ({
          id: item.id,
          data: () => { const copy = { ...item }; delete copy.id; return copy; }
        }));
        resolve({
          empty: docs.length === 0,
          forEach: (callback) => docs.forEach(callback),
          docs: docs
        });
      };
      request.onerror = () => reject(request.error);
    });
  }

  where(field, operator, value) {
    return new LocalQuery(this.name, field, operator, value, this.db, this.initPromise, this.useIndexedDB);
  }
}

class LocalQuery {
  constructor(collectionName, field, operator, value, db, initPromise, useIndexedDB) {
    this.collectionName = collectionName;
    this.field = field;
    this.operator = operator;
    this.value = value;
    this.db = db;
    this.initPromise = initPromise;
    this.useIndexedDB = useIndexedDB;
  }

  async getDB() {
    await this.initPromise;
    return this.db;
  }

  async get() {
    await this.initPromise;

    if (!this.useIndexedDB) {
      // localStorage version
      const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
      let filtered = items;
      if (this.operator === '==') {
        filtered = items.filter(item => item[this.field] === this.value);
      }
      const docs = filtered.map(item => ({
        id: item.id,
        data: () => { const copy = { ...item }; delete copy.id; return copy; }
      }));
      return {
        empty: docs.length === 0,
        forEach: (callback) => docs.forEach(callback),
        docs: docs
      };
    }

    // IndexedDB version
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.collectionName], 'readonly');
      const store = transaction.objectStore(this.collectionName);
      const request = store.getAll();

      request.onsuccess = () => {
        let items = request.result;
        if (this.operator === '==') {
          items = items.filter(item => item[this.field] === this.value);
        }
        const docs = items.map(item => ({
          id: item.id,
          data: () => { const copy = { ...item }; delete copy.id; return copy; }
        }));
        resolve({
          empty: docs.length === 0,
          forEach: (callback) => docs.forEach(callback),
          docs: docs
        });
      };
      request.onerror = () => reject(request.error);
    });
  }
}

class LocalDocument {
  constructor(collectionName, docId, db, initPromise, useIndexedDB) {
    this.collectionName = collectionName;
    this.docId = docId;
    this.db = db;
    this.initPromise = initPromise;
    this.useIndexedDB = useIndexedDB;
  }

  async getDB() {
    await this.initPromise;
    return this.db;
  }

  async set(data) {
    await this.initPromise;
    const item = { id: this.docId, ...data };

    if (!this.useIndexedDB) {
      const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
      const index = items.findIndex(i => i.id === this.docId);
      if (index >= 0) {
        items[index] = item;
      } else {
        items.push(item);
      }
      localStorage.setItem(this.collectionName, JSON.stringify(items));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.collectionName], 'readwrite');
      const store = transaction.objectStore(this.collectionName);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async update(data) {
    await this.initPromise;

    if (!this.useIndexedDB) {
      const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
      const index = items.findIndex(i => i.id === this.docId);
      if (index >= 0) {
        items[index] = { ...items[index], ...data };
        localStorage.setItem(this.collectionName, JSON.stringify(items));
      }
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.collectionName], 'readwrite');
      const store = transaction.objectStore(this.collectionName);
      const getRequest = store.get(this.docId);

      getRequest.onsuccess = () => {
        const item = getRequest.result || { id: this.docId };
        const updatedItem = { ...item, ...data };
        const updateRequest = store.put(updatedItem);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async delete() {
    await this.initPromise;

    if (!this.useIndexedDB) {
      const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
      const filtered = items.filter(i => i.id !== this.docId);
      localStorage.setItem(this.collectionName, JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.collectionName], 'readwrite');
      const store = transaction.objectStore(this.collectionName);
      const request = store.delete(this.docId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get() {
    await this.initPromise;

    if (!this.useIndexedDB) {
      const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
      const item = items.find(i => i.id === this.docId);
      if (!item) return null;
      const copy = { ...item };
      delete copy.id;
      return copy;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.collectionName], 'readonly');
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
