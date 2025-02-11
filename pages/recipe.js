import { useState } from 'react';
import styles from '../styles/Recipe.module.css';

export default function Recipe() {
  const [showAuthDialog, setShowAuthDialog] = useState(true);
  const [ingredients, setIngredients] = useState('');
  const [people, setPeople] = useState(1);
  const [cookTime, setCookTime] = useState(30);
  const [cuisine, setCuisine] = useState('');
  const [preferences, setPreferences] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError('');
    setIsLoading(true); // 2. Fixed typo (removed space before semicolon)

    try {
      const response = await fetch('/api/get-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          people,
          cookTime,
          cuisine,
          preferences,
          mode: 'ai' // 3. Added mode parameter (was missing)
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch recipes');
      
      const data = await response.json();
      setRecipe(data.recipe);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {showAuthDialog && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>
            <h2>Welcome to DishGenie</h2>
            <p>
              Log in or sign up to get smarter responses, personalized meal plans, and much more.
            </p>
            <button
              className={`${styles.dialogButton} ${styles.login}`}
              onClick={() => setShowAuthDialog(true)}
            >
              Log in
            </button>
            <button
              className={`${styles.dialogButton} ${styles.signup}`}
              onClick={() => setShowAuthDialog(true)}
            >
              Sign up
            </button>
            <button
              className={`${styles.dialogButton} ${styles.stayLoggedOut}`}
              onClick={() => setShowAuthDialog(false)}
            >
              Stay logged out
            </button>
          </div>
        </div>
      )}

      <h1>Recipe Suggester</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Ingredients: </label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, rice, tomatoes"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Number of People: </label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Cook Time (minutes): </label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Cuisine: </label>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="e.g., Italian, Indian"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Dietary Preferences: </label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., vegetarian, gluten-free"
          />
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Get AI Recipe'}
          </button>
        </div>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {recipe && (
        <div className={styles.recipe}>
          <h2>Suggested Recipe</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{recipe}</pre>
        </div>
      )}
    </div>
  );
}