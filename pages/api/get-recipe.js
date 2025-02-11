import OpenAI from 'openai';
import axios from 'axios';
import cheerio from 'cheerio';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in .env.local
});


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ingredients, people, cookTime, cuisine, preferences, mode } = req.body;

  // Validate required fields for AI mode
  if (mode !== 'web' && (!ingredients || !people || !cookTime)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    if (mode === 'web') {
      const recipes = await scrapeRecipes(ingredients, cuisine, preferences);
      return res.status(200).json({ recipes });
    }

    // Original AI code
    const prompt = `Suggest a recipe based on the following:
- Ingredients available: ${ingredients}
- Number of people to serve: ${people}
- Cook time: ${cookTime} minutes
- Cuisine/type of dish: ${cuisine || 'any'}
- Dietary preferences: ${preferences || 'none'}

Provide a detailed recipe with steps and cooking instructions. Make sure to come up
with unique recipes without using additional ingredients apart from the ones mentioned
(except for staples like oil, sugar, salt, spices etc..) but if there are some ingredients
that are present in the recipe that you suggest and the user hasn't entered those, start 
off with warning them about the extra ingredients that will be required in the recipe.

End the suggestions with a unique tip related to that recipe.`;
    
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const recipe = response.choices[0].text.trim();
    return res.status(200).json({ recipe });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      message: `Failed to fetch ${mode === 'web' ? 'web recipes' : 'AI recipe'}`
    });
  }
}