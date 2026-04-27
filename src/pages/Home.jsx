import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CountryCard from "../components/CountryCard";

function Home() {
  const [query, setQuery] = useState("");

  // State
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries (debounced)
  useEffect(() => {
    // If input is empty → reset
    if (!query) {
      setCountries([]);
      setError(null);
      return;
    }

    // Optional: avoid API calls for very short input
    if (query.length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);

      fetch(`https://restcountries.com/v3.1/name/${query}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setCountries(data);
          setError(null);
        })
        .catch(() => {
          setCountries([]);
          setError("No countries found.");
        })
        .finally(() => setLoading(false));
    }, 400);

    // Cleanup (important for debounce)
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="home">
      {/* Search */}
      <SearchBar query={query} onQueryChange={setQuery} />

      {/* Loading */}
      {loading && <p className="home__status">Loading...</p>}

      {/* Error */}
      {error && (
        <p className="home__status home__status--error">{error}</p>
      )}

      {/* Results */}
      {!loading && !error && countries.length > 0 && (
        <div className="cards-grid">
          {countries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && countries.length === 0 && !query && (
        <p className="home__status">
          Start searching to explore countries.
        </p>
      )}
    </div>
  );
}

export default Home;