import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const CountdownTimer = ({id, initialMinutes = 1, deleteTimer}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // converting minutes to seconds
  const [isActive, setIsActive] = useState(false);

  // Format time as MM:SS
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  // Effect to handle countdown
  useEffect(() => {
    let timer = null;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); // Stop the timer if time reaches zero
    }

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [isActive, timeLeft]);

  // Start timer
  const startTimer = () => setIsActive(true);

  // Pause timer
  const pauseTimer = () => setIsActive(false);

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60); // Reset to initial time
  };

  // Delete timer by calling the parent deleteTimer function
  const handleDelete = () => {
    deleteTimer(id); // Pass the timer id to the delete function
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Start"
          onPress={startTimer}
          disabled={isActive || timeLeft === 0}
        />
        <Button title="Pause" onPress={pauseTimer} disabled={!isActive} />
        <Button title="Reset" onPress={resetTimer} />
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TimerApp = () => {
  const [timers, setTimers] = useState([{id: 1, initialMinutes: 1}]);

  // Delete timer by id
  const deleteTimer = id => {
    setTimers(prevTimers => prevTimers.filter(timer => timer.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {timers.map(timer => (
          <CountdownTimer
            key={timer.id}
            id={timer.id} // Pass the id to the child component
            initialMinutes={timer.initialMinutes}
            deleteTimer={deleteTimer} // Pass the delete function to the child
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scrollView: {
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 1,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TimerApp;
