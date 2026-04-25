// Simple localStorage-based database system (No backend needed)
// Data is stored locally in the browser

class SimpleDB {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize collections if they don't exist
    if (!localStorage.getItem('slideshow')) localStorage.setItem('slideshow', JSON.stringify([]));
    if (!localStorage.getItem('collections')) localStorage.setItem('collections', JSON.stringify([]));
    if (!localStorage.getItem('products')) localStorage.setItem('products', JSON.stringify([]));
    if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));
    if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
  }

  collection(name) {
    return new LocalCollection(name);
  }
}

class LocalCollection {
  constructor(name) {
    this.name = name;
  }

  async add(data) {
    const items = JSON.parse(localStorage.getItem(this.name) || '[]');
    const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newItem = { id, ...data };
    items.push(newItem);
    localStorage.setItem(this.name, JSON.stringify(items));
    return { id, data: () => data };
  }

  doc(id) {
    return new LocalDocument(this.name, id);
  }

  async get() {
    const items = JSON.parse(localStorage.getItem(this.name) || '[]');
    const docs = items.map(item => ({
      id: item.id,
      data: () => {
        const copy = { ...item };
        delete copy.id;
        return copy;
      }
    }));

    return {
      empty: docs.length === 0,
      forEach: function(callback) {
        docs.forEach(doc => callback(doc));
      },
      docs: docs
    };
  }

  where(field, operator, value) {
    return new LocalQuery(this.name, field, operator, value);
  }
}

class LocalQuery {
  constructor(collectionName, field, operator, value) {
    this.collectionName = collectionName;
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  async get() {
    const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    let filtered = items;

    if (this.operator === '==') {
      filtered = items.filter(item => item[this.field] === this.value);
    }

    const docs = filtered.map(item => ({
      id: item.id,
      data: () => {
        const copy = { ...item };
        delete copy.id;
        return copy;
      }
    }));

    return {
      empty: docs.length === 0,
      forEach: function(callback) {
        docs.forEach(doc => callback(doc));
      },
      docs: docs
    };
  }
}

class LocalDocument {
  constructor(collectionName, docId) {
    this.collectionName = collectionName;
    this.docId = docId;
  }

  async set(data) {
    const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    const index = items.findIndex(item => item.id === this.docId);
    if (index >= 0) {
      items[index] = { id: this.docId, ...data };
      localStorage.setItem(this.collectionName, JSON.stringify(items));
    }
  }

  async update(data) {
    const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    const index = items.findIndex(item => item.id === this.docId);
    if (index >= 0) {
      items[index] = { ...items[index], ...data };
      localStorage.setItem(this.collectionName, JSON.stringify(items));
    }
  }

  async delete() {
    const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    const filtered = items.filter(item => item.id !== this.docId);
    localStorage.setItem(this.collectionName, JSON.stringify(filtered));
  }

  async get() {
    const items = JSON.parse(localStorage.getItem(this.collectionName) || '[]');
    const item = items.find(i => i.id === this.docId);
    if (!item) return null;
    const copy = { ...item };
    delete copy.id;
    return copy;
  }
}

// Initialize the database
const db = new SimpleDB();
