import axios from "axios";
import React, { FC, useState } from "react";

export interface IPokemonService {
  getListOfPokemon(recordCount: number, pagination: number): Promise<any>;
  getPokemonByName(name: string): Promise<any>;
  getPokemonById(id: number): Promise<any>;
}

export const PokemonServiceContext = React.createContext<
  IPokemonService | undefined
>(undefined);

const PokemonService: FC = ({ children }: any) => {
  const baseApiUrl = "https://pokeapi.co/api/v2/";
  const [apiUrl, setApiUrl] = useState("");
  const [returnData, setReturnData] = useState();

  const pokemonService = {
    async getListOfPokemon(
      recordCount: number,
      pagination: number
    ): Promise<any> {
      setApiUrl(
        baseApiUrl +
          `pokemon/limit=${recordCount}&offset=${recordCount * pagination}`
      );

      return executeCall(apiUrl);
      // return [];
    },
    async getPokemonByName(name: string): Promise<any> {
      // setApiUrl(baseApiUrl + `pokemon/${name}`);

      // return executeCall(apiUrl);

      await axios
        .get(baseApiUrl + `pokemon/pikachu`)
        .then((x) => setReturnData(x.data));

      return returnData;
    },
    async getPokemonById(id: number): Promise<any> {
      setApiUrl(baseApiUrl + `pokemon/${id}`);

      return executeCall(apiUrl);
    },
  };

  const executeCall = async (assd) => {
    await axios
      .get(assd)
      .then((x) => setReturnData(x.data))
      .catch((error) => {
        // Handle the error
        console.error(error);
      });

    return returnData;
  };

  return (
    <PokemonServiceContext.Provider value={pokemonService}>
      {children}
    </PokemonServiceContext.Provider>
  );
};

export default PokemonService;

/*
export const PokemonServiceA = (props) => {
  const baseApiUrl = "https://pokeapi.co/api/v2/";
  const [apiUrl, setApiUrl] = useState("");
  const [returnData, setReturnData] = useState();

  const getListOfPokemon = (recordCount: number, pagination: number) => {
    setApiUrl(
      baseApiUrl +
        `pokemon/limit=${recordCount}&offset=${recordCount * pagination}`
    );

    return executeCall(HTTPMethods.GET);
  };

  const getPokemonByName = (name: string) => {
    setApiUrl(baseApiUrl + `pokemon/${name}`);

    return executeCall(HTTPMethods.GET);
  };

  const getPokemonById = (id: number) => {
    setApiUrl(baseApiUrl + `pokemon/${id}`);

    return executeCall(HTTPMethods.GET);
  };

  const executeCall = (httpMethod: HTTPMethods) => {
    switch (httpMethod) {
      case HTTPMethods.GET:
        axios
          .get(apiUrl)
          .then((data) => setReturnData(data))
          .catch((error) => {
            // Handle the error
            console.error(error);
          });
        break;

      //TODO: Review if the below will ever be used.
      case HTTPMethods.POST:
        axios
          .post(apiUrl)
          .then((data) => setReturnData(data))
          .catch((error) => {
            // Handle the error
            console.error(error);
          });
        break;

      case HTTPMethods.PUT:
        axios
          .put(apiUrl)
          .then((data) => setReturnData(data))
          .catch((error) => {
            // Handle the error
            console.error(error);
          });
        break;

      case HTTPMethods.DELETE:
        axios
          .delete(apiUrl)
          .then((data) => setReturnData(data))
          .catch((error) => {
            // Handle the error
            console.error(error);
          });
        break;
    }

    return returnData;
  };

  return {
    getListOfPokemon,
    getPokemonByName,
    getPokemonById,
  };

  // return {
  //   count,
  //   setCount,
  //   increment: () => setCount(count + 1),
  //   decrement: () => setCount(count - 1),
  // };
};
*/
