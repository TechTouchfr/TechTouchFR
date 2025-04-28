const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://techtouch.fr"
    }
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/webmentions");

  // Minify HTML in production
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (process.env.ELEVENTY_ENV === "production" && outputPath && outputPath.endsWith(".html")) {
      return content.replace(/\s+/g, " ").trim();
    }
    return content;
  });

  // Add a filter to filter collections by layout
  eleventyConfig.addFilter("filterByLayout", (collection, layout) => {
    return collection.filter(item => item.data.layout === layout);
  });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "templates/_includes",
      data: "templates/_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};