/**
 * Profanity Filter Module
 * Checks text for inappropriate content before storing quotes
 */

const Filter = require('bad-words');

class ProfanityFilter {
  constructor() {
    this.filter = new Filter();
    
    // You can add custom words to the filter if needed
    // this.filter.addWords('customword1', 'customword2');
  }

  /**
   * Check if text contains profanity
   * @param {string} text - Text to check
   * @returns {boolean} True if profanity is detected
   */
  containsProfanity(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }
    
    return this.filter.isProfane(text);
  }

  /**
   * Clean profanity from text (replace with asterisks)
   * @param {string} text - Text to clean
   * @returns {string} Cleaned text
   */
  cleanText(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }
    
    return this.filter.clean(text);
  }

  /**
   * Validate quote text and author for profanity
   * @param {string} text - Quote text
   * @param {string} author - Quote author
   * @returns {Object} Validation result with isValid and message
   */
  validateQuote(text, author) {
    if (this.containsProfanity(text)) {
      return {
        isValid: false,
        message: 'Quote text contains inappropriate language and cannot be added.'
      };
    }
    
    if (this.containsProfanity(author)) {
      return {
        isValid: false,
        message: 'Author name contains inappropriate language and cannot be added.'
      };
    }
    
    return {
      isValid: true,
      message: 'Quote is valid'
    };
  }
}

// Export singleton instance
module.exports = new ProfanityFilter();
