/**
 * Database Module
 * Handles SQLite database initialization and operations for the quote service
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'quotes.db');
  }

  /**
   * Initialize database connection and create tables if they don't exist
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
          return;
        }
        console.log(`Connected to SQLite database at ${this.dbPath}`);
        
        // Create quotes table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            author TEXT NOT NULL,
            views INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating quotes table:', err.message);
            reject(err);
            return;
          }
          
          // Insert some seed data if the table is empty
          this.db.get('SELECT COUNT(*) as count FROM quotes', (err, row) => {
            if (err) {
              console.error('Error checking quotes count:', err.message);
              reject(err);
              return;
            }
            
            if (row.count === 0) {
              console.log('Seeding database with initial quotes...');
              const seedQuotes = [
                { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
                { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
                { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
                { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
                { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' }
              ];
              
              const stmt = this.db.prepare('INSERT INTO quotes (text, author) VALUES (?, ?)');
              seedQuotes.forEach(quote => {
                stmt.run(quote.text, quote.author);
              });
              stmt.finalize();
              console.log('Database seeded successfully');
            }
            
            resolve();
          });
        });
      });
    });
  }

  /**
   * Get a random quote and increment its view count
   * @returns {Promise<Object>} Random quote object
   */
  async getRandomQuote() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1', (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        // Increment view count
        this.db.run('UPDATE quotes SET views = views + 1 WHERE id = ?', [row.id], (err) => {
          if (err) {
            console.error('Error updating view count:', err.message);
          }
        });
        
        resolve({
          id: row.id,
          text: row.text,
          author: row.author,
          views: row.views + 1
        });
      });
    });
  }

  /**
   * Add a new quote to the database
   * @param {string} text - The quote text
   * @param {string} author - The quote author
   * @returns {Promise<Object>} The newly created quote
   */
  async addQuote(text, author) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO quotes (text, author) VALUES (?, ?)',
        [text, author],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({
            id: this.lastID,
            text,
            author,
            views: 0
          });
        }
      );
    });
  }

  /**
   * Get statistics about quotes
   * @returns {Promise<Object>} Statistics object
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT COUNT(*) as totalQuotes, SUM(views) as totalViews FROM quotes',
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({
            totalQuotes: row.totalQuotes || 0,
            totalViews: row.totalViews || 0
          });
        }
      );
    });
  }

  /**
   * Retrieve all quotes in the database ordered by creation date
   * @returns {Promise<Array>} List of quotes
   */
  async getAllQuotes() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, text, author, views, created_at FROM quotes ORDER BY datetime(created_at) DESC, id DESC',
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows || []);
        }
      );
    });
  }

  /**
   * Delete a quote by id
   * @param {number} id - Quote identifier
   * @returns {Promise<boolean>} True if a row was deleted
   */
  async deleteQuote(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM quotes WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes > 0);
      });
    });
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

// Export singleton instance
module.exports = new Database();
