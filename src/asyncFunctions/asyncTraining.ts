// .then

  // fetch("https://pokeapi.co/api/v2/pokemon")
  //   .then((response) => response.json())
  //   .then((data: PokemonListType) => {
  //     console.log(data, " === DATA");
  //     fetch(data.results[0].url)
  //       .then((response) => response.json())
  //       .then((data) => console.log(data, " === DATA 2"))
  //       .catch((err) => console.error(err));
  //   })
  //   .catch((err) => console.error(err));

  // Async / await

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

  (async function () {
    try {
      const pokemonList = await getPokemonList();
      const pokemon = await getPokemon(pokemonList.results[0].url);
      console.log(pokemon.name);
    } catch (err) {
      console.error(err);
    }
  })();

  (async function () {
    try {
      const list = await getPokemonList();

      for (const listItem of list.results) {
        const pokemon = await getPokemon(listItem.url);
        console.log(pokemon, " ==== pokemon element");
      }

      // The code belowe does the same

      list.results.reduce<Promise<unknown>>(async (pr, pokemon) => {
        await pr;
        return getPokemon(pokemon.url).then((p) =>
          console.log(p, " === resolve pookymoon")
        );
      }, Promise.resolve(undefined));
    } catch (err) {
      console.error(err);
    }
  })();

  (async function () {
    try {
      const list = await getPokemonList();
      const data = await Promise.all(
        list.results.map((pokemon) => getPokemon(pokemon.url))
      );
      console.log(data, ">>>>>>>>DONE");
    } catch (err) {
      console.error(err);
    }
  })();

  const getFirstPokemon = async (): Promise<PokemonType> => {
    console.log("Getting the list");
    return new Promise(async (resolve, reject) => {
      try {
        const list = await getPokemonList();
        resolve(await getPokemon(list.results[0].url));
      } catch (err) {
        reject(err);
      }
    });
  };

  (async function () {
    try {
      const pokemonPromise = getFirstPokemon();

      const firstPokemon = await pokemonPromise;
      const firstPokemon2 = await pokemonPromise;
      console.log(firstPokemon);
    } catch (err) {
      console.error(err);
    }
  })();

  (async function () {
    const list = await getPokemonList();

    const { results, errors } = await PromisePool.withConcurrency(2)
      .for(list.results)
      .process(async (userData, index, pool) => {
        return await getPokemon(userData.url);;
      });


      console.log(results.map(pokemon => pokemon.name), ' >>>>>>> PromisePool')

  })();