// Firebase Configuration - Using simple fetch-based API instead of SDK
// This avoids ES6 module conflicts

const firebaseConfig = {
  apiKey: "AIzaSyAZhcr4BEtOnE1kvSuUSYNhUthWrP7rko4",
  authDomain: "klyrastudio-36415.firebaseapp.com",
  projectId: "klyrastudio-36415",
  storageBucket: "klyrastudio-36415.firebasestorage.app",
  messagingSenderId: "335942360395",
  appId: "1:335942360395:web:9478bb1d8a6afacc46dcce"
};

// Simple Firestore API wrapper using REST API
class FirestoreDB {
  constructor(projectId, apiKey) {
    this.projectId = projectId;
    this.apiKey = apiKey;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
  }

  async get(collectionName, docId = null) {
    try {
      if (docId) {
        const response = await fetch(`${this.baseUrl}/${collectionName}/${docId}?key=${this.apiKey}`);
        return response.json();
      } else {
        const response = await fetch(`${this.baseUrl}/${collectionName}?key=${this.apiKey}`);
        return response.json();
      }
    } catch (error) {
      console.error('Error fetching from Firestore:', error);
      return null;
    }
  }

  collection(name) {
    return new Collection(this.projectId, this.apiKey, name, this.baseUrl);
  }
}

class Collection {
  constructor(projectId, apiKey, name, baseUrl) {
    this.projectId = projectId;
    this.apiKey = apiKey;
    this.name = name;
    this.baseUrl = baseUrl;
  }

  async add(data) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.name}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: this._convertData(data) })
      });
      const result = await response.json();
      return { id: result.name.split('/').pop(), data: () => data };
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  doc(id) {
    return new Document(this.projectId, this.apiKey, this.name, id, this.baseUrl);
  }

  async get() {
    try {
      const response = await fetch(`${this.baseUrl}/${this.name}?key=${this.apiKey}`);
      const data = await response.json();
      
      return {
        empty: !data.documents || data.documents.length === 0,
        forEach: function(callback) {
          if (data.documents) {
            data.documents.forEach(doc => {
              callback({
                id: doc.name.split('/').pop(),
                data: () => this._extractFields(doc.fields)
              });
            });
          }
        },
        docs: (data.documents || []).map(doc => ({
          id: doc.name.split('/').pop(),
          data: () => this._extractFields(doc.fields)
        })),
        _extractFields: (fields) => {
          const result = {};
          for (let key in fields) {
            result[key] = this._extractValue(fields[key]);
          }
          return result;
        },
        _extractValue: (field) => {
          if (field.stringValue) return field.stringValue;
          if (field.numberValue) return parseFloat(field.numberValue);
          if (field.booleanValue) return field.booleanValue;
          if (field.timestampValue) return new Date(field.timestampValue);
          if (field.mapValue) {
            const result = {};
            for (let key in field.mapValue.fields) {
              result[key] = this._extractValue(field.mapValue.fields[key]);
            }
            return result;
          }
          return null;
        }
      };
    } catch (error) {
      console.error('Error getting collection:', error);
      return { empty: true, forEach: () => {}, docs: [] };
    }
  }

  _convertData(data) {
    const fields = {};
    for (let key in data) {
      fields[key] = this._convertValue(data[key]);
    }
    return fields;
  }

  _convertValue(value) {
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'number') return { numberValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (typeof value === 'object') {
      return { mapValue: { fields: this._convertData(value) } };
    }
    return { nullValue: null };
  }

  where(field, operator, value) {
    return this; // Simplified - would need full implementation
  }

  orderBy(field, direction = 'asc') {
    return this; // Simplified
  }
}

class Document {
  constructor(projectId, apiKey, collectionName, docId, baseUrl) {
    this.projectId = projectId;
    this.apiKey = apiKey;
    this.collectionName = collectionName;
    this.docId = docId;
    this.baseUrl = baseUrl;
  }

  async set(data) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.collectionName}/${this.docId}?key=${this.apiKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: this._convertData(data) })
      });
      return response.json();
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }

  async update(data) {
    return this.set(data);
  }

  async delete() {
    try {
      await fetch(`${this.baseUrl}/${this.collectionName}/${this.docId}?key=${this.apiKey}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  _convertData(data) {
    const fields = {};
    for (let key in data) {
      fields[key] = this._convertValue(data[key]);
    }
    return fields;
  }

  _convertValue(value) {
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'number') return { numberValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    return { nullValue: null };
  }
}

// Initialize Firestore DB
const db = new FirestoreDB(firebaseConfig.projectId, firebaseConfig.apiKey);
const auth = { currentUser: null }; // Simplified auth

// Make globally available
window.db = db;
window.auth = auth;
window.firebaseConfig = firebaseConfig;
