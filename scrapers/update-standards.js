/**
 * Accessibility Standards Web Scraper
 *
 * Monitors accessibility standards websites for updates:
 * - W3C WCAG 2.2 Quick Reference
 * - WebAIM Articles
 * - ARIA APG Patterns
 * - MDN Accessibility Docs
 *
 * Usage:
 *   node scrapers/update-standards.js
 *   npm run scrape:update
 *
 * Outputs:
 *   - Console log of changes detected
 *   - Updates scrapers/CHANGELOG-STANDARDS.md
 *   - Stores checksums in scrapers/checksums.json
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const config = {
  resources: [
    {
      name: 'WCAG 2.2 Quick Reference',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      priority: 'P0',
      selector: 'main',
      checkFrequency: 'monthly'
    },
    {
      name: 'ARIA APG Patterns',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
      priority: 'P1',
      selector: 'main',
      checkFrequency: 'quarterly'
    },
    {
      name: 'WebAIM Articles',
      url: 'https://webaim.org/articles/',
      priority: 'P0',
      selector: '#main',
      checkFrequency: 'monthly'
    }
  ],
  outputDir: path.join(__dirname, 'history'),
  checksumsFile: path.join(__dirname, 'checksums.json'),
  changelogFile: path.join(__dirname, 'CHANGELOG-STANDARDS.md')
};

/**
 * Calculate hash of content for change detection
 */
function calculateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Load existing checksums from file
 */
async function loadChecksums() {
  try {
    const data = await fs.readFile(config.checksumsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

/**
 * Save checksums to file
 */
async function saveChecksums(checksums) {
  await fs.writeFile(
    config.checksumsFile,
    JSON.stringify(checksums, null, 2),
    'utf-8'
  );
}

/**
 * Fetch and parse a web page
 */
async function fetchPage(url, selector = 'body') {
  try {
    console.log(`Fetching: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Accessibility-Standards-Monitor/1.0'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Extract main content using selector
    const mainContent = $(selector).html() || $('body').html();

    // Convert to markdown for easier comparison
    const markdown = NodeHtmlMarkdown.translate(mainContent);

    return {
      success: true,
      content: markdown,
      rawHtml: mainContent,
      statusCode: response.status
    };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check a single resource for changes
 */
async function checkResource(resource, existingChecksums) {
  console.log(`\n📄 Checking: ${resource.name}`);
  console.log(`   Priority: ${resource.priority}`);

  const result = await fetchPage(resource.url, resource.selector);

  if (!result.success) {
    console.log(`   ❌ Failed to fetch`);
    return {
      resource: resource.name,
      changed: false,
      error: result.error
    };
  }

  // Calculate hash
  const currentHash = calculateHash(result.content);
  const previousHash = existingChecksums[resource.name];

  // Check if changed
  const changed = previousHash && previousHash !== currentHash;

  if (!previousHash) {
    console.log(`   ℹ️  First check - establishing baseline`);
  } else if (changed) {
    console.log(`   🔔 CHANGE DETECTED!`);
  } else {
    console.log(`   ✅ No changes`);
  }

  // Save snapshot if changed
  if (changed) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${resource.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.md`;
    const filepath = path.join(config.outputDir, filename);

    await fs.mkdir(config.outputDir, { recursive: true });
    await fs.writeFile(filepath, result.content, 'utf-8');

    console.log(`   💾 Snapshot saved: ${filename}`);
  }

  return {
    resource: resource.name,
    url: resource.url,
    priority: resource.priority,
    changed,
    currentHash,
    timestamp: new Date().toISOString()
  };
}

/**
 * Update changelog with detected changes
 */
async function updateChangelog(changes) {
  const changedResources = changes.filter(c => c.changed);

  if (changedResources.length === 0) {
    return;
  }

  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];

  let changelogEntry = `\n## ${date}\n\n`;
  changelogEntry += `**Changes Detected:** ${changedResources.length} resource(s)\n\n`;

  for (const change of changedResources) {
    changelogEntry += `### ${change.resource}\n`;
    changelogEntry += `- **Priority:** ${change.priority}\n`;
    changelogEntry += `- **URL:** ${change.url}\n`;
    changelogEntry += `- **Detected:** ${timestamp}\n`;
    changelogEntry += `- **Action Required:** Review changes and update standards documentation\n\n`;
  }

  // Append to changelog
  try {
    let existingChangelog = '';
    try {
      existingChangelog = await fs.readFile(config.changelogFile, 'utf-8');
    } catch (error) {
      // File doesn't exist, create header
      existingChangelog = '# Accessibility Standards Change Log\n\n';
      existingChangelog += 'This file tracks changes detected in monitored accessibility standards resources.\n\n';
    }

    await fs.writeFile(
      config.changelogFile,
      existingChangelog + changelogEntry,
      'utf-8'
    );

    console.log(`\n📝 Changelog updated: ${config.changelogFile}`);
  } catch (error) {
    console.error('Error updating changelog:', error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Accessibility Standards Update Checker\n');
  console.log('=' .repeat(60));

  // Load existing checksums
  const existingChecksums = await loadChecksums();
  console.log(`Loaded ${Object.keys(existingChecksums).length} existing checksums\n`);

  // Check all resources
  const results = [];
  for (const resource of config.resources) {
    const result = await checkResource(resource, existingChecksums);
    results.push(result);

    // Update checksum
    if (result.currentHash) {
      existingChecksums[resource.name] = result.currentHash;
    }

    // Small delay between requests to be polite
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save updated checksums
  await saveChecksums(existingChecksums);

  // Update changelog if changes detected
  await updateChangelog(results);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary\n');

  const changed = results.filter(r => r.changed).length;
  const errors = results.filter(r => r.error).length;
  const noChange = results.filter(r => !r.changed && !r.error).length;

  console.log(`Total resources checked: ${results.length}`);
  console.log(`Changes detected: ${changed}`);
  console.log(`No changes: ${noChange}`);
  console.log(`Errors: ${errors}`);

  if (changed > 0) {
    console.log(`\n⚠️  CHANGES DETECTED!`);
    console.log(`Review changelog: ${config.changelogFile}`);
    console.log(`Snapshots saved in: ${config.outputDir}`);
  } else {
    console.log(`\n✅ All standards up to date`);
  }

  console.log('\n' + '='.repeat(60));
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
