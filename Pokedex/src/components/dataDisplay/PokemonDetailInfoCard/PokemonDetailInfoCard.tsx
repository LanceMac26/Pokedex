import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import type { PropsWithChildren } from "react";
import * as Progress from "react-native-progress";
import { FlatGrid, SimpleGrid } from "react-native-super-grid";

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

  return (
    <View style={{ flex: 1, padding: 2, flexDirection: "row" }}>
      <Text style={{ flex: 1, color: "#BDBEC2" }}>{title}</Text>
      <Text style={{ flex: 2 }}>{value}</Text>
    </View>
  );
};

const BaseStatDetail = (props: {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}) => {
  const { base_stat, stat } = props;
  const titleArray = {
    hp: { title: "HP", color: "#FE9999" },
    attack: { title: "Attack", color: "#79BF94" },
    defense: { title: "Defense", color: "#FE9999" },
    "special-attack": { title: "Sp. Atk", color: "#79BF94" },
    "special-defense": { title: "Sp. Def", color: "#79BF94" },
    speed: { title: "Speed", color: "#FE9999" },
  };

  const sanitizeStatName = (name: string) => {
    if (titleArray[name] !== undefined) {
      return titleArray[name];
    }

    return { title: "Total", color: "#79BF94" };
  };

  return (
    <View style={{ flex: 1, padding: 2, flexDirection: "row" }}>
      <Text style={{ flex: 1, color: "#BDBEC2" }}>
        {sanitizeStatName(stat.name).title}
      </Text>
      <Text style={{ flex: 2, color: "black", fontWeight: "bold" }}>
        {base_stat}
      </Text>
      <Progress.Bar
        style={{ flex: 3 }}
        progress={base_stat / (stat.name == "Total" ? 600 : 100)}
        width={200}
        height={20}
        color={sanitizeStatName(stat.name).color}
      />
    </View>
  );
};

const MoveDetail = (props: { move: { name: string; url: string } }) => {
  const { move } = props;

  const sanitizeName = (name: string) => {
    let splitName = name.split("-");
    splitName.forEach(
      (word) =>
        (splitName[splitName.indexOf(word)] =
          word.slice(0, 1).toUpperCase() + word.slice(1, word.length))
    );

    return splitName.join(" ");
  };

  return (
    <Text
      style={{
        textAlign: "center",
        alignContent: "center",
        justifyContent: "space-around",
      }}
    >
      {sanitizeName(move.name)}
    </Text>
  );
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
          <FlatList
            data={[
              {
                title: "Species",
                value: sanitizeName(
                  pokemonDetail?.species.name ? pokemonDetail?.species.name : ""
                ),
              },
              { title: "Height", value: sanitizeHeight(pokemonDetail?.height) },
              { title: "Weight", value: sanitizeWeight(pokemonDetail?.weight) },
              {
                title: "Abilities",
                value: sanitizeAbilities(pokemonDetail?.abilities),
              },
            ]}
            renderItem={({ item }) => (
              <AboutDetail title={item.title} value={item.value} />
            )}
            keyExtractor={(item) => item.title}
            numColumns={1}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 20 }}
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
          {/* Extract to component & map the stats array */}
          <FlatList
            data={[
              ...pokemonDetail?.stats,
              {
                base_stat: calcTotalStats(pokemonDetail?.stats),
                effort: 0,
                stat: {
                  name: "Total",
                  url: "",
                },
              },
            ]}
            renderItem={({ item }) => (
              <BaseStatDetail
                base_stat={item.base_stat}
                effort={item.effort}
                stat={item.stat}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={1}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 20 }}
          />

          <Text style={{ fontWeight: "bold" }}>Type Defenses</Text>
          <Text>The effectiveness of each type on this Pokemon</Text>
        </ScrollView>
      )}

      {/* Evolution */}
      {selectedTab === ContainerTabs.EVOLUTION && <View>Coming soon</View>}

      {/* Moves */}
      {selectedTab === ContainerTabs.MOVES && (
        <ScrollView>
          {/* Extract to expanable component */}
          <FlatList
            data={pokemonDetail?.moves}
            renderItem={({ item }) => <MoveDetail move={item.move} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 20 }}
          />
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
