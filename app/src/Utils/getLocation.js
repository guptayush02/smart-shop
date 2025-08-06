const openAIFunctions = require("./openai");
const extractJsonFromResponse = require("./extractJSONContent");

const getLocation = async(address) => {
  const prompt = "You are a helpful assistant that extracts the lat long from the given address";
  const content = await openAIFunctions.analysisQueryFromAi(address, prompt);
  const extracted = extractJsonFromResponse(content);
  console.log("extracted:", extracted)
  const { latitude: lat, longitude: long } = extracted;
  return { lat, long };
}

module.exports = getLocation;