import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in .env.local
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Extract data from the request body
  const { ingredients, people, cookTime, cuisine, preferences } = req.body;

  // Validate required fields
  if (!ingredients || !people || !cookTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create the prompt for OpenAI
  const prompt = `Suggest a recipe based on the following:
- Ingredients available: ${ingredients}
- Number of people to serve: ${people}
- Cook time: ${cookTime} minutes
- Cuisine/type of dish: ${cuisine || 'any'}
- Dietary preferences: ${preferences || 'none'}

Provide a detailed recipe with steps and cooking instructions.`;

  try {
    // Call OpenAI API
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct', // Use the updated model
      prompt,
      max_tokens: 500, // Adjust based on the length of the response you want
      temperature: 0.7, // Controls creativity (0 = deterministic, 1 = creative)
    });

    // Extract the recipe from the response
    const recipe = response.choices[0].text.trim();

    // Return the recipe to the frontend
    res.status(200).json({ recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Failed to fetch recipe' });
  }
}