function extractJsonFromResponse(content) {
  const cleaned = content.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON:', err);
    return null;
  }
}

module.exports = extractJsonFromResponse
