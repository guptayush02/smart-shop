const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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'
});

const openAIFunctions = {
  analysisQueryFromAi: async(query, content) => {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
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
