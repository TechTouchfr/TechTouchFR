const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const articlesDir = 'src/content/articles';

async function checkArticles() {
  const requiredFields = ['title', 'date', 'layout', 'image', 'description', 'canonicalUrl'];

  try {
    const files = await fs.readdir(articlesDir);
    let errorCount = 0;

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(articlesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(content);

      for (const field of requiredFields) {
        if (!(field in data)) {
          console.error(`❌ ${file} missing required field: ${field}`);
          errorCount++;
        }
      }

      // Check for at least one interactive component (poll.njk)
      if (!content.includes('{% include "poll.njk" %}')) {
        console.error(`❌ ${file} missing interactive component (e.g., poll)`);
        errorCount++;
      }
    }

    if (errorCount === 0) {
      console.log(`✅ All articles passed validation.`);
    } else {
      console.log(`❌ Found ${errorCount} issue(s).`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error checking articles:', error.message);
    process.exit(1);
  }
}

checkArticles();