const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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'
});

async function analysisQueryFromAi(query) {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that extracts purchase requests in structured JSON format also tell us in which vendor category that product fall, also please make the response and the key same one key should be product and another key will be catrgory also let me know the quantity user wants.' },
      { role: 'user', content: `User message: "${query}". Extract the request and respond only with a JSON.` },
    ],
    max_tokens: 1000,
  });
  return completion.choices[0].message.content;
}

module.exports = analysisQueryFromAi
