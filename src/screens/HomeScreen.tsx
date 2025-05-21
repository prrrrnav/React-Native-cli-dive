import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface ContributionDay {
  date: string;
  count: number;
}

const HomeScreen = (_props: Props) => {
  const [username, setUsername] = useState('prrrrnav');
  const [data, setData] = useState<ContributionDay[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStreak = async () => {
    if (!username.trim()) return;
    try {
      setLoading(true);
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
      const json = await response.json();
      const recent = json?.contributions?.slice(-30) || [];
      setData(recent);
    } catch (error) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter your GitHub username:</Text>
          <TextInput
            style={styles.input}
            placeholder='Enter here'
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.label}>Your Activity</Text>
          <Button title='Fetch' onPress={fetchStreak} />
        </View>

        <View>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {data && data.length > 0 ? (
            data.map((day, index) => (
              <View key={index} style={styles.day}>
                <Text>{day.date}</Text>
                <Text>{day.count} contributions</Text>
              </View>
            ))
          ) : (
            !loading && <Text>No data available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  day: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
  }
});

export default HomeScreen;
