import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to DishGenie</h1>
      <p>
        DishGenie is your personal recipe assistant. Whether you're a busy student or a cooking
        enthusiast, DishGenie helps you discover delicious recipes tailored to your preferences,
        ingredients, and time constraints. Get personalized meal plans, save your favorite recipes,
        and much more!
      </p>
      <Link href="/recipe">
        <button className={styles.tryButton}>Try it out</button>
      </Link>
    </div>
  );
}