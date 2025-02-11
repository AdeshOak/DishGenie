import { useState } from 'react';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [people, setPeople] = useState(1);
  const [cookTime, setCookTime] = useState(30);
  const [cuisine, setCuisine] = useState('');
  const [preferences, setPreferences] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear any previous errors
  
    try {
      // Send data to the backend
      const response = await fetch('/api/get-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          people,
          cookTime,
          cuisine,
          preferences,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch recipe. Please try again.');
      }
  
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); // Set the error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Recipe Suggester</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Ingredients: </label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, rice, tomatoes"
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Number of People: </label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Cook Time (minutes): </label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            min="1"
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Cuisine: </label>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="e.g., Italian, Indian"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Dietary Preferences: </label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., vegetarian, gluten-free"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Recipe'}
        </button>
      </form>

     {isLoading && <p>Loading recipe...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {recipe && (
    <div style={{ marginTop: '20px' }}>
        <h2>Suggested Recipe</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{recipe}</pre>
    </div>
    )}
    </div>
  );
}