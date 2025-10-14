import { useState } from 'react';

/**
 * Abbreviation Glossary Component
 *
 * Demonstrates WCAG 2.2 Success Criterion:
 * - 3.1.4 Abbreviations (Level AAA)
 *
 * Provides a searchable, filterable glossary of abbreviations with their
 * expanded forms and definitions.
 *
 * Features:
 * - Text search across abbreviations and full names
 * - Alphabet filtering
 * - Keyboard accessible
 * - Screen reader friendly with semantic HTML
 * - Responsive design
 *
 * @example
 * <AbbreviationGlossary />
 */

const DEFAULT_GLOSSARY = [
  { abbr: 'API', full: 'Application Programming Interface', definition: 'A set of rules and protocols for building software applications. It defines how software components should interact.' },
  { abbr: 'ARIA', full: 'Accessible Rich Internet Applications', definition: 'A set of attributes to make web content more accessible to people with disabilities, especially dynamic content and UI components.' },
  { abbr: 'CSS', full: 'Cascading Style Sheets', definition: 'A language for styling HTML documents, controlling layout, colors, fonts, and other visual aspects.' },
  { abbr: 'DOM', full: 'Document Object Model', definition: 'A programming interface for web documents that represents the page structure as a tree of objects.' },
  { abbr: 'FAQ', full: 'Frequently Asked Questions', definition: 'A list of common questions and answers about a topic or service.' },
  { abbr: 'HTML', full: 'HyperText Markup Language', definition: 'The standard markup language for creating web pages and web applications.' },
  { abbr: 'HTTP', full: 'HyperText Transfer Protocol', definition: 'The foundation of data communication on the World Wide Web.' },
  { abbr: 'HTTPS', full: 'HyperText Transfer Protocol Secure', definition: 'Secure version of HTTP that encrypts data transmitted between browser and server.' },
  { abbr: 'JSON', full: 'JavaScript Object Notation', definition: 'A lightweight data interchange format that is easy for humans to read and write.' },
  { abbr: 'JWT', full: 'JSON Web Token', definition: 'A compact, URL-safe means of representing claims to be transferred between two parties for authentication.' },
  { abbr: 'REST', full: 'Representational State Transfer', definition: 'An architectural style for designing networked applications using HTTP requests.' },
  { abbr: 'SEO', full: 'Search Engine Optimization', definition: 'The practice of increasing website traffic by improving search engine rankings.' },
  { abbr: 'SQL', full: 'Structured Query Language', definition: 'A language for managing and querying relational databases.' },
  { abbr: 'UI', full: 'User Interface', definition: 'The visual elements and controls through which users interact with a system.' },
  { abbr: 'URL', full: 'Uniform Resource Locator', definition: 'The address of a web page or resource on the internet.' },
  { abbr: 'UX', full: 'User Experience', definition: 'The overall experience a user has when interacting with a product or service.' },
  { abbr: 'WCAG', full: 'Web Content Accessibility Guidelines', definition: 'International standards developed by W3C to make web content accessible to people with disabilities.' },
  { abbr: 'W3C', full: 'World Wide Web Consortium', definition: 'The main international standards organization for the World Wide Web.' },
  { abbr: 'XML', full: 'Extensible Markup Language', definition: 'A markup language for storing and transporting data in a structured format.' },
];

function AbbreviationGlossary({ customGlossary = null }) {
  const glossary = customGlossary || DEFAULT_GLOSSARY;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');

  // Filter glossary based on search and letter selection
  const filteredGlossary = glossary.filter(item => {
    const matchesSearch =
      item.abbr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.full.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLetter =
      selectedLetter === 'all' ||
      item.abbr[0].toLowerCase() === selectedLetter.toLowerCase();

    return matchesSearch && matchesLetter;
  });

  // Sort alphabetically by abbreviation
  const sortedGlossary = [...filteredGlossary].sort((a, b) =>
    a.abbr.localeCompare(b.abbr)
  );

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Get count of abbreviations starting with each letter
  const letterCounts = letters.reduce((acc, letter) => {
    acc[letter] = glossary.filter(item =>
      item.abbr[0].toUpperCase() === letter
    ).length;
    return acc;
  }, {});

  return (
    <div className="abbreviation-glossary">
      <header className="glossary-header">
        <h1>Abbreviations Glossary</h1>
        <p className="glossary-description">
          Find the expanded forms and meanings of common abbreviations used
          throughout this site.
        </p>
      </header>

      {/* Search input */}
      <div className="glossary-search">
        <label htmlFor="glossary-search">
          Search abbreviations, full names, or definitions:
        </label>
        <input
          type="search"
          id="glossary-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., API, Accessibility, HTML"
          aria-describedby="search-instructions"
        />
        <span id="search-instructions" className="visually-hidden">
          Type to filter the glossary. Results update automatically as you type.
        </span>
      </div>

      {/* Alphabet filter */}
      <nav className="glossary-alphabet" aria-label="Filter by first letter">
        <button
          type="button"
          onClick={() => setSelectedLetter('all')}
          className={selectedLetter === 'all' ? 'active' : ''}
          aria-pressed={selectedLetter === 'all'}
        >
          All
        </button>
        {letters.map(letter => (
          <button
            key={letter}
            type="button"
            onClick={() => setSelectedLetter(letter)}
            className={selectedLetter === letter ? 'active' : ''}
            aria-pressed={selectedLetter === letter}
            disabled={letterCounts[letter] === 0}
            title={letterCounts[letter] === 0 ? `No abbreviations start with ${letter}` : `${letterCounts[letter]} abbreviation${letterCounts[letter] !== 1 ? 's' : ''} start with ${letter}`}
          >
            {letter}
          </button>
        ))}
      </nav>

      {/* Results count */}
      <div
        className="glossary-results-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {sortedGlossary.length > 0 ? (
          <p>
            Showing {sortedGlossary.length} abbreviation{sortedGlossary.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedLetter !== 'all' && ` starting with "${selectedLetter}"`}
          </p>
        ) : (
          <p>No abbreviations found.</p>
        )}
      </div>

      {/* Glossary list */}
      {sortedGlossary.length > 0 ? (
        <dl className="glossary-list">
          {sortedGlossary.map(item => (
            <div key={item.abbr} className="glossary-item" id={`abbr-${item.abbr.toLowerCase()}`}>
              <dt className="glossary-term">
                <strong className="glossary-abbr">{item.abbr}</strong>
              </dt>
              <dd className="glossary-definition">
                <span className="glossary-full">
                  <abbr title={item.full}>{item.abbr}</abbr> = {item.full}
                </span>
                <p className="glossary-description">{item.definition}</p>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="no-results">
          <p>
            No abbreviations found matching your search criteria.
            {searchTerm && (
              <>
                <br />
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                >
                  Clear search
                </button>
              </>
            )}
          </p>
        </div>
      )}

      <footer className="glossary-footer">
        <p>
          <strong>Don't see an abbreviation?</strong> Contact us to suggest additions
          to this glossary.
        </p>
      </footer>

      <style jsx>{`
        .abbreviation-glossary {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .glossary-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid #1976d2;
        }

        .glossary-header h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          color: #1976d2;
        }

        .glossary-description {
          margin: 0;
          font-size: 1.1rem;
          color: #555;
        }

        /* Search */
        .glossary-search {
          margin-bottom: 2rem;
        }

        .glossary-search label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          font-size: 1rem;
        }

        .glossary-search input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 2px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.2s;
        }

        .glossary-search input:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Alphabet filter */
        .glossary-alphabet {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }

        .glossary-alphabet button {
          min-width: 36px;
          height: 36px;
          padding: 0.25rem 0.5rem;
          background-color: #f5f5f5;
          border: 2px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .glossary-alphabet button:hover:not(:disabled) {
          background-color: #e3f2fd;
          border-color: #1976d2;
        }

        .glossary-alphabet button:focus {
          outline: 2px solid #1976d2;
          outline-offset: 2px;
        }

        .glossary-alphabet button.active {
          background-color: #1976d2;
          color: white;
          border-color: #1976d2;
          font-weight: bold;
        }

        .glossary-alphabet button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Results count */
        .glossary-results-count {
          margin-bottom: 1.5rem;
          font-weight: 500;
          color: #555;
        }

        .glossary-results-count p {
          margin: 0;
        }

        /* Glossary list */
        .glossary-list {
          margin: 0;
          padding: 0;
        }

        .glossary-item {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background-color: #f9f9f9;
          border-left: 4px solid #1976d2;
          border-radius: 4px;
        }

        .glossary-item:target {
          background-color: #fffbcc;
          border-left-color: #ffd700;
        }

        .glossary-term {
          margin-bottom: 0.5rem;
        }

        .glossary-abbr {
          font-size: 1.5rem;
          color: #1976d2;
          font-weight: bold;
        }

        .glossary-definition {
          margin-left: 0;
        }

        .glossary-full {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .glossary-full abbr {
          text-decoration: none;
          color: inherit;
        }

        .glossary-description {
          margin: 0;
          line-height: 1.6;
          color: #555;
        }

        /* No results */
        .no-results {
          text-align: center;
          padding: 3rem 1rem;
          color: #777;
          font-style: italic;
        }

        .no-results button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .no-results button:hover {
          background-color: #1565c0;
        }

        .no-results button:focus {
          outline: 2px solid #1976d2;
          outline-offset: 2px;
        }

        /* Footer */
        .glossary-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #eee;
          text-align: center;
          color: #777;
        }

        .glossary-footer p {
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .abbreviation-glossary {
            padding: 1rem;
          }

          .glossary-header h1 {
            font-size: 1.5rem;
          }

          .glossary-description {
            font-size: 1rem;
          }

          .glossary-alphabet button {
            min-width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }

          .glossary-abbr {
            font-size: 1.25rem;
          }

          .glossary-full {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AbbreviationGlossary;
