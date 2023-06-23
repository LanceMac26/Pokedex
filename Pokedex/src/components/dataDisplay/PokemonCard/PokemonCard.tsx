import { PokemonClient, Pokemon } from "pokenode-ts";
import { useState, useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native";

const PokemonCard = (props) => {
  const { pokemon, navigation } = props;
  const { name } = pokemon;
  const innerApi = new PokemonClient();

  const [cardData, setCardData] = useState<Pokemon>();
  const [loading, setLoading] = useState(false);

  const handleClick = () =>
    navigation.navigate("DetailPage", { searchString: name });

  const loadPokemonData = async () => {
    setLoading(true);

    await innerApi
      .getPokemonByName(name)
      .then((data) => setCardData(data))
      .catch((error) => {
        // Handle the error

        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPokemonData();
  }, []);

  return (
    <TouchableOpacity onPress={handleClick}>
      {loading ? (
        <Text>Loading ....</Text>
      ) : (
        <View style={styles.pokeCard}>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            {name}
          </Text>
          <Text>#{cardData?.id}</Text>
          <Image
            source={{
              uri: `${cardData?.sprites.front_default}`,
            }}
            style={{ width: 200, height: 200 }}
          />
          {cardData?.types.map((type) => (
            <Text style={{ margin: 5 }}>{type.type.name}</Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pokeCard: {
    borderColor: "red",
    borderWidth: 2,
    margin: 5,
  },
});

export default PokemonCard;
