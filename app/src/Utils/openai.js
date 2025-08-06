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
