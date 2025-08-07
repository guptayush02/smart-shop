const OpenAI = require("openai");

console.log("process.env:", process.env.DISTANCE_IN_KM)
const openai = new OpenAI({
  baseURL: 'https://api.perplexity.ai',
  apiKey: process.env.OPEN_AI_API_KEY
});

const openAIFunctions = {
  analysisQueryFromAi: async(query, content) => {
    const completion = await openai.chat.completions.create({
      model: 'sonar-pro',
      messages: [
        { role: 'system', content },
        { role: 'user', content: `User message: "${query}". Extract the request and respond only with a JSON.` },
      ],
      max_tokens: 1000,
    });
    return completion.choices[0].message.content;
  }
  
}

module.exports = openAIFunctions
