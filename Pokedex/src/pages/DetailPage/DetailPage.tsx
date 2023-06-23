import {
  Gender,
  Genders,
  Pokemon,
  PokemonClient,
  PokemonSpeciesGender,
} from "pokenode-ts";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import usePokemonService from "../../hooks/usePokemonService";
//import { getPokemonByName } from "../../services/pokemonService";

interface LegibleGenderData {
  femaleProbability: number;
  maleProbability: number;
  genderless: boolean;
}

function DetailPage({ navigation, route }) {
  const api = new PokemonClient();
  const pokemonService = usePokemonService();
  const pokemon = useRef<any>([]);

  const [data, setData] = useState<Pokemon>();
  const [genderData, setGenderData] = useState<LegibleGenderData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const [abilityStr, setAbilityStr] = useState<String[]>();

  // useEffect(() => {
  //   setLoading(true);
  //   pokemonService
  //     .getPokemonByName(route.params.searchString)
  //     .then((result) => {
  //       pokemon.current = result;
  //       setData(result);
  //     })
  //     .catch((error) => {
  //       setError(error);
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    // TODO: Create your own service to interact with the Pokedex service.
    setLoading(true);
    fetchData(api);
  }, []);

  // async function fetchData(api) {
  //   // await api
  //   //   .getPokemonByName(route.params.searchString)
  //   await api
  //     .getPokemonByName("pikachu")
  //     .then((data) => setData(data))
  //     .then((data) => loadGenderData(api, data.id))
  //     .catch((error) => {
  //       // Handle the error

  //       console.error(error);
  //     })
  //     .finally(() => setLoading(false));
  // }

  const fetchData = async (api) => {
    await api
      .getPokemonByName(route.params.searchString)
      .then((data) => setData(data))
      .then(() => loadGenderData())
      .catch((error) => {
        // Handle the error

        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const loadGenderData = async () => {
    let femaleGenderData: Gender;
    let maleGenderData: Gender;

    await api
      .getGenderByName("female")
      .then((res) => (femaleGenderData = res))
      .catch((error) => {
        // Handle the error

        console.error(error);
      });
  };

  return (
    <>
      {/* <Text>This is {route.params.searchString}'s profile</Text> */}
      <View style={styles.container}>
        {loading ? (
          <View>
            <Text>Loading...</Text>
          </View>
        ) : (
          // TODO : Handle a check here that will implement a not found page
          <ScrollView>
            {/* <Text>Data: {JSON.stringify(pokemon.current)}</Text> */}

            <Image
              source={{
                uri: `${data?.sprites.front_default}`,
              }}
              style={{ width: 200, height: 200 }}
            />

            <Text style={{ fontWeight: "bold" }}>About!</Text>

            <Text style={{ fontWeight: "bold" }}>Name: {data?.name}</Text>
            <Text>Species: {data?.species.name}</Text>
            <Text>Height: {data?.height}</Text>
            <Text>Weight: {data?.weight}</Text>
            <Text>Abilities: </Text>
            <FlatList
              data={data?.abilities}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginLeft: 15 }}>
                    <Text>{`\u2022 ${item.ability.name}`}</Text>
                  </View>
                );
              }}
            />
            <Text style={{ fontWeight: "bold" }}>Breeding!</Text>

            {/* <Text>Gender: {JSON.stringify(genderData)}</Text> */}
            <Text>Egg Groups: </Text>
            <Text>Egg Cycle: </Text>

            <Text>Error: {error}</Text>
            {/* <Text>Name: {data.name}</Text>
            <Text style={{ marginTop: 15 }}>Abilities: </Text>
            <FlatList
              data={data.abilities}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginLeft: 15 }}>
                    <Text>{`\u2022 ${item.ability.name}`}</Text>
                  </View>
                );
              }}
            />
            <Text style={{ marginTop: 15 }}>Moves: </Text>
            <FlatList
              data={data.moves}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginLeft: 15 }}>
                    <Text>{`\u2022 ${item.move.name}`}</Text>
                  </View>
                );
              }}
            /> */}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default DetailPage;
