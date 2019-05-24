const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {

  // Add a date formatter filter to Nunjucks
  eleventyConfig.addFilter("dateDisplay", require("./filters/dates.js"));

  // Minify our HTML
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
  if( outputPath.endsWith(".html") ) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
    return minified;
  }
  return content;
  });

  // Layout aliases
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');

  // Include our static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");

  return {
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,

    dir: {
      input: 'site',
      output: '_site',
      includes: 'includes',
      data: 'globals'
    }
  };

};
