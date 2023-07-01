import { PokemonClient, Pokemon } from "pokenode-ts";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from "react-native";

// TODO: Move to constants
const windowWidth = Dimensions.get("window").width;
const imageWidth = windowWidth / 3 + 30;
const imageHeight = windowWidth / 3;

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

  const sanitizeName = (name: string) => {
    // TODO: Move to helper hook.
    let fistLetter = name.slice(0, 1);

    return fistLetter.toUpperCase() + name.substring(1, name.length);
  };

  const sanitizePokemonId = (id: string) => {
    switch (id?.length) {
      case 1:
        return `00${id}`;

      case 2:
        return `0${id}`;

      default:
        return id;
    }
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
            {sanitizeName(name)}
          </Text>
          <Text>#{sanitizePokemonId(cardData?.id.toString())}</Text>
          <Image
            source={{
              uri: `${cardData?.sprites.front_default}`,
            }}
            style={styles.image}
          />
          {/* {cardData?.types.map((type) => (
            <Text style={{ margin: 5 }}>{sanitizeName(type.type.name)}</Text>
          ))} */}
          {cardData?.types.map((type) => (
            <PokemonTypeBanner
              name={sanitizeName(type.type.name)}
              color="red"
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const PokemonTypeBanner = (props) => {
  const { name, color } = props;

  return (
    <View
      style={{
        backgroundColor: "#FC8583",
        width: "43%",
        alignItems: "center",
        margin: 1,
        borderRadius: 10,
      }}
    >
      <Text>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pokeCard: {
    borderColor: "#69D149",
    borderWidth: 2,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#49D0B0",
  },
  child: {
    width: windowWidth / 2,
    alignItems: "center",
    height: imageHeight + 5,
    marginTop: 10,

    borderColor: "red",
    borderWidth: 2,
    margin: 5,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
});

export default PokemonCard;
