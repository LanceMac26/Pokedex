import { PokemonClient } from "pokenode-ts";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import PokemonCard from "../../components/dataDisplay/PokemonCard/PokemonCard";

interface CardResult {
  name: string;
  url: string;
}

function LandingPage({ navigation }) {
  const api = new PokemonClient();

  const [data, setData] = useState<CardResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    setLoading(true);
    loadLists();
  }, []);

  const loadLists = async () => {
    // TODO: Implement paginations for the scrolling - Check ScrollView docs

    await api
      .listPokemons() // TODO: Change to internal GQL service, needs cant run 20 queries just to load the dashboard
      .then((data) => setData(data.results))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const deviceWidth = Dimensions.get("window").width;

  return (
    <View style={styles.centered}>
      <Text style={styles.titleText}>Pokedex</Text>

      {loading ? (
        <Text>Loading....</Text>
      ) : (
        <ScrollView>
          {data?.map((pokemon) => (
            <PokemonCard pokemon={pokemon} navigation={navigation} />
          ))}
        </ScrollView>
        // <FlatList
        //   style={{ width: deviceWidth }}
        //   data={data}
        //   numColumns={2}
        //   renderItem={(pokemon) => (
        //     <PokemonCard pokemon={pokemon.item} navigation={navigation} />
        //   )}
        // />
      )}

      {/* <TextInput
        style={styles.input}
        onChangeText={setSearchString}
        value={searchString}
      />
      <Button
        title="Search"
        onPress={() =>
          navigation.navigate("DetailPage", {
            searchString: searchString.toLocaleLowerCase().trim(),
          })
        }
      /> */}
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 180,
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LandingPage;
