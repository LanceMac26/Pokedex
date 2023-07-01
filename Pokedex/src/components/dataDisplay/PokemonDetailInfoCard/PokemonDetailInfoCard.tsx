import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import type { PropsWithChildren } from "react";

enum ContainerTabs {
  ABOUT = "About",
  BASE_STATS = "Base Stats",
  EVOLUTION = "Evolution",
  MOVES = "Moves",
}

type PreviewLayoutProps = PropsWithChildren<{
  //   label: string;
  values: string[];
  //selectedValue: string;
  selectedTab: string;
  setSelectedValue: (value: string) => void;
}>;

const PreviewLayout = ({
  children,
  values,
  selectedTab,
  setSelectedValue,
}: PreviewLayoutProps) => (
  <View
    style={{ padding: 10, flex: 1, backgroundColor: "white", borderRadius: 20 }}
  >
    <View style={styles.row}>
      {values.map((value) => (
        <TouchableOpacity
          key={value}
          onPress={() => setSelectedValue(value)}
          style={[styles.button, selectedTab === value && styles.selected]}
        >
          <Text
            style={[
              styles.buttonLabel,
              selectedTab === value && styles.selectedLabel,
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={[styles.container]}>{children}</View>
  </View>
);

const AboutDetail = (props: { title: string; value: string }) => {
  const { title, value } = props;

  return <Text>Asd</Text>;
};

const PokemonDetailInfoCard = (props) => {
  const { pokemonDetail } = props;
  const [selectedTab, setSelectedTab] = useState<string>(ContainerTabs.ABOUT);

  // TODO: Remove after MVP
  useEffect(() => {
    console.log("Data: ", pokemonDetail);
  }, []);

  // TODO: Extract to Utils
  //#region Helper funcs

  const sanitizeAbilities = (abbilityObj: [any]) => {
    let abilityArr = [];

    abbilityObj?.forEach((x) => abilityArr.push(sanitizeName(x.ability.name)));

    return abilityArr.join(", ");
  };

  const sanitizeName = (name: string) => {
    // TODO: Move to helper hook.
    let fistLetter = name.slice(0, 1);

    return fistLetter.toUpperCase() + name.substring(1, name.length);
  };

  const sanitizeHeight = (height) => {
    let cm = height / 10;

    let inches = cm / 2.54;
    let feet = Math.floor(inches / 12);

    return `${feet}'${(inches % 12).toFixed(2)}" (${cm} cm)`;
  };

  const sanitizeWeight = (weight: number) => {
    let convertedKg = weight / 100;
    let convertedLbs = weight * 2.2046;

    return `${convertedLbs} lbs (${convertedKg} kg)`;
  };

  const calcTotalStats = (stats: [any]) => {
    let totalStats = 0;

    stats.forEach((stat) => (totalStats += stat?.base_stat));

    return totalStats;
  };

  //#endregion Helper funcs

  return (
    <PreviewLayout
      selectedTab={selectedTab}
      values={[
        ContainerTabs.ABOUT,
        ContainerTabs.BASE_STATS,
        ContainerTabs.EVOLUTION,
        ContainerTabs.MOVES,
      ]}
      setSelectedValue={setSelectedTab}
    >
      {/* <AboutDetails */}
      {selectedTab == ContainerTabs.ABOUT && (
        <ScrollView>
          {/* Extract to component */}
          {/* <Text>Species: {pokemonDetail?.species.name}</Text>
          <Text>Height: {sanitizeHeight(pokemonDetail?.height)}</Text>
          <Text>Weight: {sanitizeWeight(pokemonDetail?.weight)}</Text>
          <Text>Abilities: {sanitizeAbilities(pokemonDetail?.abilities)}</Text> */}
          <AboutDetail title="Species" value={pokemonDetail?.species.name} />
          <AboutDetail
            title="Height"
            value={sanitizeHeight(pokemonDetail?.height)}
          />
          <AboutDetail
            title="Weight"
            value={sanitizeWeight(pokemonDetail?.weight)}
          />
          <AboutDetail
            title="Abilities"
            value={sanitizeAbilities(pokemonDetail?.abilities)}
          />

          <Text style={{ fontWeight: "bold", margin: "0,5" }}>Breeding</Text>
          <Text>Gender: Coming Soon!</Text>
          <Text>Egg Groups: Coming Soon!</Text>
          <Text>Egg Cycle: Coming Soon!</Text>
        </ScrollView>
      )}

      {/* Base Stats */}
      {selectedTab === ContainerTabs.BASE_STATS && (
        <ScrollView>
          <Text>Base Stats</Text>
          {/* Extract to component & map the stats array */}
          <Text>HP: {pokemonDetail?.stats[0].base_stat}</Text>
          <Text>Attack: {pokemonDetail?.stats[1].base_stat}</Text>
          <Text>Defense: {pokemonDetail?.stats[2].base_stat}</Text>
          <Text>Sp. Atk: {pokemonDetail?.stats[3].base_stat}</Text>
          <Text>Sp. Def: {pokemonDetail?.stats[4].base_stat}</Text>
          <Text>Speed: {pokemonDetail?.stats[5].base_stat}</Text>
          <Text>Total: {calcTotalStats(pokemonDetail?.stats)}</Text>

          <Text>""</Text>
          <Text>Type Defenses</Text>
          <Text>The effectiveness of each type on this Pokemon</Text>
        </ScrollView>
      )}

      {/* Evolution */}
      {selectedTab === ContainerTabs.EVOLUTION && <View>Coming soon</View>}

      {/* Moves */}
      {selectedTab === ContainerTabs.MOVES && (
        <ScrollView>
          {/* Extract to expanable component */}
          {pokemonDetail?.moves.map((move) => (
            <Text>{move.move.name}</Text>
          ))}
        </ScrollView>
      )}

      {/* <View style={[styles.box, { backgroundColor: "red" }]} />
      <View style={[styles.box, { backgroundColor: "skyblue" }]} />
      <View style={[styles.box, { backgroundColor: "steelblue" }]} /> */}
    </PreviewLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "aliceblue",
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "oldlace",
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "48%",
    textAlign: "center",
  },
  selected: {
    backgroundColor: "coral",
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "coral",
  },
  selectedLabel: {
    color: "white",
  },
  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },
});

export default PokemonDetailInfoCard;
