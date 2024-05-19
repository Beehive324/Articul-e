import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [title, setTitle] = React.useState('');

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    const uri = recording.getURI();
    const newRecording = {
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: uri,
      title: title,
      date: new Date().toLocaleDateString()
    };
    
    const analysis = await analyzeRecording(uri);
    newRecording.tempo = analysis.tempo;
    newRecording.mood = analysis.mood;

    setRecordings([...recordings, newRecording]);
    setTitle('');
  }

  async function analyzeRecording(uri) {
    // Replace with your API call to analyze the recording
    // Here is an example using a placeholder API call
    try {
      const response = await axios.post('https://api.example.com/analyze', {
        audioUri: uri,
      });
      return {
        tempo: response.data.tempo,
        mood: response.data.mood,
      };
    } catch (err) {
      console.error('Failed to analyze recording', err);
      return { tempo: 'Unknown', mood: 'Unknown' };
    }
  }

  function getDurationFormatted(milliseconds) {
    if (milliseconds === 0) {
      return '0:00';
    }
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.fill}>
          {recordingLine.title || `Recording #${index + 1}`} | {recordingLine.duration} | {recordingLine.date} | Tempo: {recordingLine.tempo} | Mood: {recordingLine.mood}
        </Text>
        <Button onPress={() => recordingLine.sound.replayAsync()} title="Play" color="#1E90FF"></Button>
      </View>
    ));
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.recordingCount}>Total Recordings: {recordings.length}</Text>
        {getRecordingLines()}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter title for the recording"
            value={title}
            onChangeText={setTitle}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} color="#1E90FF" />
        {recordings.length > 0 && <Button title="Clear Recordings" onPress={clearRecordings} color="#FF4500" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  recordingCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  fill: {
    flex: 1,
    marginHorizontal: 15,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  bottomContainer: {
    padding: 10,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
});
