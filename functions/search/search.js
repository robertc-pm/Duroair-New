const path = require("path");
const lunr = require("lunr");

const handler = async (event) => {
  try {
    // Ensure query parameter is sanitized
    const subject = event.queryStringParameters?.search?.trim() || "World";
    
    // Load search index JSON
    const json_data = require(path.join(__dirname, "../../build/search-index.json"));
    
    // Load Lunr index
    const idx = lunr.Index.load(json_data.index);
    const result = idx.search(subject);
    
    // Format the output
    const out = result.slice(0, 12).map((val) => ({
      score: val.score,
      title: json_data.store[val.ref]?.title || "Unknown Title",
      path: "/" + val.ref
    }));
    
    return {
      statusCode: 200,
      body: JSON.stringify(out),
    };
  } catch (error) {
    console.error("Search Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};

module.exports = { handler };
