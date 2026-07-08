import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { GeminiService } from '../services/ai/GeminiService';

export default function SettingsScreen({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadKey();
  }, []);

  const loadKey = async () => {
    try {
      const key = await GeminiService.getApiKey();
      if (key) setApiKey(key);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await GeminiService.setApiKey(apiKey.trim());
      Alert.alert('Saved', 'API Key saved securely.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key first.');
      return;
    }
    setIsTesting(true);
    try {
      await GeminiService.testConnection(apiKey.trim());
      Alert.alert('Success', 'Connection to Gemini API successful!');
    } catch (e) {
      Alert.alert('Test Failed', e.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = async () => {
    Alert.alert('Clear Key', 'Are you sure you want to remove the API key?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        setApiKey('');
        await GeminiService.setApiKey('');
        Alert.alert('Cleared', 'API Key has been removed.');
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>AI Features</Text>
        <Text style={styles.description}>
          Enter your Google Gemini API key to enable the optional AI Flashcard Generator. Your key is stored securely on your device.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Gemini API Key..."
          placeholderTextColor={colors.textMuted}
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSave} disabled={isLoading || isTesting}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleTest} disabled={isLoading || isTesting}>
            {isTesting ? <ActivityIndicator color={colors.textPrimary} /> : <Text style={styles.btnTextSecondary}>Test Connection</Text>}
          </TouchableOpacity>
        </View>

        {apiKey.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearBtnText}>Clear API Key</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 12,
    padding: 16,
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.purple.primary,
  },
  btnSecondary: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  btnTextSecondary: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  clearBtn: {
    marginTop: 24,
    alignItems: 'center',
    padding: 12,
  },
  clearBtnText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 15,
  },
});
