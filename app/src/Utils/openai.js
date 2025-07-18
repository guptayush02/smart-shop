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
