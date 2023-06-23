import { PokemonClient } from "pokenode-ts";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, ScrollView, FlatList } from "react-native";
import usePokemonService from "../../hooks/usePokemonService";
//import { getPokemonByName } from "../../services/pokemonService";

function DetailPage({ navigation, route }) {
  const pokemonService = usePokemonService();
  const pokemon = useRef<any>([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    pokemonService
      .getPokemonByName(route.params.searchString)
      .then((result) => {
        pokemon.current = result;
        setData(result);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  // useEffect(() => {
  //   // TODO: Create your own service to interact with the Pokedex service.
  //   const api = new PokemonClient();

  //   setLoading(true);

  //   async function fetchData() {
  //     await api
  //       .getPokemonByName(route.params.searchString)
  //       .then((data) => setData(data))
  //       .catch((error) => {
  //         // Handle the error

  //         console.error(error);
  //       })
  //       .finally(() => setLoading(false));
  //   }

  //   fetchData();
  // }, []);

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
            <Text>Data: {JSON.stringify(pokemon.current)}</Text>
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
