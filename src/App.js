import React, { useState, useEffect, useCallback } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import "./App.scss";

const JokePage = () => {
  let { category } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [joke, setJoke] = useState("");

  const [error, setError] = useState("")

  const getRamdomJoke = useCallback(
    async () => {
        try {
          if (isLoading) return;
          setError("") 
          setJoke("")
          setIsLoading(true);
          const res = await fetch("https://v2.jokeapi.dev/joke/" + category.toLowerCase());
          const data = await res.json();
           const inappropriate = ["racist", "political", "religious", "sexist", "explicit", "nsfw"].some((key) => {
            return data.flags[key]
           })
           if (inappropriate) setError("Inappropriate Joke, click button to get another Joke.")
          // if (data.flags.racist)setError("This Joke has a racist content")
          // else if (data.flags.political)setError("This Joke has a political content")
          else if (data.setup) setJoke(data.setup + data.delivery)
          else setJoke(data.joke)
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
        }
    },
    [category,isLoading,setIsLoading,setJoke],
  )

  // useEffect(() => {
  //   getRamdomJoke();
  // }, [getRamdomJoke]);
  return (
    <div className="joke-page">
    <Link to="/">Back to homepage</Link>
    <div className="joke">
    <div className="joke-name">
    <h2>Category : {category}</h2>
      <button onClick={getRamdomJoke}>get joke</button>
      <p className={error ? 'error' : '' }>{error || joke}</p>
      {isLoading ? <p>Loading</p> : ""}
      </div>
      </div>
    </div>
  );
}



const categories = ["Programming", "Christmas", "Pun"]

const HomePage = () => {

  return (
    
     <div id="category">
     <div className="category-name">
     <h4>Welcome to the Joke App, Choose your category</h4>
     {categories.map((c) => <Link to={'/' + c.toLowerCase() } key={c} >{c}</Link>)}
     </div>
     </div>
  );
};

const App = () => {
  return (
    <div>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route path="/:category" component={JokePage} />
      </Router>
    </div>
  );
};

export default App;
