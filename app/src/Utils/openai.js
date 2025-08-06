const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: 'https://api.perplexity.ai',
  apiKey: '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'
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
