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
  BackHandler,
} from "react-native";
import usePokemonService from "../../hooks/usePokemonService";
import AntIcon from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonDetailInfoCard from "../../components/dataDisplay/PokemonDetailInfoCard/PokemonDetailInfoCard";

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

  useEffect(() => {
    // TODO: Create your own service to interact with the Pokedex service.
    setLoading(true);
    fetchData(api);
  }, []);

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
      <View style={styles.container}>
        {loading ? (
          <View>
            <Text>Loading...</Text>
          </View>
        ) : (
          <DetailContainer>
            <SafeAreaView aria-hidden={false} />
            <Header
              name={data?.name}
              id={data?.id}
              attributes={data?.types}
              favorited={false}
              navigation={navigation}
            />
            <ImageCarousel uri={data?.sprites.front_default} />
            <PokemonDetailInfoCard pokemonDetail={data} />
          </DetailContainer>
        )}
      </View>
    </>
  );
}

const DetailContainer = (props) => {
  const backgroundColor = "unset";

  return (
    <View
      style={{
        //backgroundColor: `${backgroundColor}`,
        height: `100%`,
        width: `100%`,
      }}
    >
      {props.children}
    </View>
  );
};

const Header = (props) => {
  const { name, id, attributes, favorited } = props;
  const { goBack } = props.navigation;

  const [isFavorited, setIsFavorited] = useState(favorited);

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

  const sanitizeName = (name: string) => {
    // TODO: Move to helper hook.
    let fistLetter = name?.slice(0, 1);

    return fistLetter?.toUpperCase() + name?.substring(1, name.length);
  };

  const handleBackButton = () => goBack();

  const handleFavorited = () => setIsFavorited(!isFavorited);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <AntIcon
          name="arrowleft"
          color="white"
          size={50}
          onPress={handleBackButton}
          style={{
            alignSelf: "flex-start",
            marginHorizontal: "1%",
            marginBottom: 6,
            minWidth: "48%",
            textAlign: "center",
          }}
        />
        <AntIcon
          name={isFavorited ? "heart" : "hearto"}
          color={isFavorited ? "red" : "white"}
          size={40}
          onPress={handleFavorited}
          style={{
            alignSelf: "flex-start",
            marginHorizontal: "1%",
            marginBottom: 6,
            minWidth: "48%",
            textAlign: "center",
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 35,
          fontWeight: "bold",
        }}
      >
        {sanitizeName(name)}
      </Text>
      <Text>#{sanitizePokemonId(id)}</Text>

      {attributes?.map((type) => (
        <PokemonTypeBanner
          style={{ width: "10%" }}
          name={sanitizeName(type.type.name)}
          color="red"
        />
      ))}
    </View>
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

const ImageCarousel = (props) => {
  const { uri } = props;

  return (
    <Image
      source={{
        uri: `${uri}`,
      }}
      style={{ width: 200, height: 200 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#49D0B0",
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default DetailPage;
