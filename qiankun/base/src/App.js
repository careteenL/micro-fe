import { BrowserRouter as Router, Link } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/vue">vue应用</Link>
        <Link to="/react">react应用</Link>
      </Router>
      <div id="container"></div>
    </div>
  );
}

export default App;
