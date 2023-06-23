import { useContext } from "react";
import {
  IPokemonService,
  PokemonServiceContext,
} from "../services/pokemonService";

const usePokemonService = () => {
  const context = useContext<IPokemonService | undefined>(
    PokemonServiceContext
  );

  if (context === undefined) {
    throw new Error(
      "PokemonServiceContext was not provided. Make sure your component is a child of the PokemonService"
    );
  }

  return context;
};

export default usePokemonService;
