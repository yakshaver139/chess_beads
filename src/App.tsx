import "./App.css";
import Header from "./components/Header";
import TreePanel from "./components/TreePanel";
import DetailsPanel from "./components/DetailsPanel";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <TreePanel />
        <DetailsPanel />
      </main>
    </div>
  );
}
