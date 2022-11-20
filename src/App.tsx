import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import PromisePool from "@supercharge/promise-pool";

type PokemonListType = {
  count: number;
  next: string;
  previous?: string;
  results: {
    name: string;
    url: string;
  }[];
};

type PokemonType = {
  id: number;
  name: string;
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  };
};

const getPokemonList = async (): Promise<PokemonListType> => {
  const listResp = await fetch("https://pokeapi.co/api/v2/pokemon");
  return await listResp.json();
};

const getPokemon = async (url: string): Promise<PokemonType> => {
  const dataResp = await fetch(url);
  return await dataResp.json();
};

function App() {

  useEffect(() => {
    async function getData() {
      const list = await getPokemonList();

      const { results, errors } = await PromisePool.withConcurrency(2)
        .for(list.results)
        .process(async (userData, index, pool) => {
          return await getPokemon(userData.url);
        });

      console.log(
        results.map((pokemon) => pokemon.name),
        " >>>>>>> PromisePool"
      );
    }
    getData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
