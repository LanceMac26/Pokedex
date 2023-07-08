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
import * as Progress from "react-native-progress";

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
        <Progress.Circle
          size={80}
          indeterminate={true}
          animated={true}
          unfilledColor="white"
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {data?.map((pokemon) => (
            <PokemonCard pokemon={pokemon} navigation={navigation} />
          ))}

          {/* <FlatList
            data={[...data, navigation]}
            renderItem={(pokemon) => (
              <PokemonCard pokemon={pokemon} navigation={null} />
            )}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 20 }}
          /> */}
        </ScrollView>
      )}
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
