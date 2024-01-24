import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "7a8e29cc41af5423b1f70349a3474d33";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rain",
  Atomosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    console.log(location[0]);
    let roundLatitude = latitude.toFixed(2);
    let roundLongitude = longitude.toFixed(2);
    setCity(location[0].region);
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${roundLatitude}&lon=${roundLongitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    console.log(json.daily);
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={{ height: "70%" }}>
        <ScrollView contentContainerStyle={styles.weather}>
          {days.length === 0 ? (
            <View style={{ ...styles.day, alignItems: "center" }}>
              <ActivityIndicator
                color="black"
                style={{ marginTop: 10 }}
                size="large"
              />
            </View>
          ) : (
            days.map((day, index) => (
              <View
                key={index}
                style={{
                  ...styles.day,
                  borderRadius: 10,
                  overflow: "hidden",
                  margin: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "gray",
                  }}
                >
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Fontisto
                    name={icons[day.weather[0].main]}
                    size={50}
                    color="black"
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "black",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
    color: "black",
    height: "30%",
  },
  weather: {
    width: SCREEN_WIDTH,
    color: "black",
  },
  tinyText: {
    fontSize: 20,
    color: "black",
  },
  dayContainer: {
    flex: 1,
    marginBottom: 10,
    borderRadius: "50%",
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "gray",
  },
  temp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: "black",
  },
});
