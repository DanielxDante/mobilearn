import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

import { VERSION } from "@/constants/routes";
import icons from "@/constants/icons"

const assetMap = {
  'terms': require('@/assets/documents/termsOfUse.pdf'),
  'privacy': require('@/assets/documents/privacyPolicy.pdf'),
};
type DocumentType = keyof typeof assetMap;

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const BUG_REPORT_URL = "https://forms.gle/snCu4EmktxYqDqge6";

  // Function to toggle between English and Chinese
  const toggleLanguage = async () => {
    const newLanguage = i18n.language === "en" ? "cn" : "en";
    await i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem("userLanguage", newLanguage); // Save the selected language
  };

  const downloadPdf = async (documentType: DocumentType, customFileName: string) => {
    try {
      // Get the asset reference from our map
      const asset = assetMap[documentType];
      
      if (!asset) {
        throw new Error(`Document type "${documentType}" not found`);
      }
      
      const [assetInfo] = await Asset.loadAsync(asset);
      const sourceUri = assetInfo.localUri;
      
      if (!sourceUri) {
        throw new Error('Failed to load asset');
      }

      const fileExtension = ".pdf";
      const destUri = `${FileSystem.cacheDirectory}${customFileName}${fileExtension}`

      await FileSystem.copyAsync({
        from: sourceUri,
        to: destUri
      });
      
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        await Sharing.shareAsync(destUri, {
          mimeType: 'application/pdf',
          dialogTitle: `Download ${documentType.charAt(0).toUpperCase() + documentType.slice(1)} Document`,
          UTI: 'com.adobe.pdf' // For iOS
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      Alert.alert('Download Failed', 'Could not download the document');
    }
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <BackButton />
        <Text style={styles.header}>{t("settings.title")}</Text>
        <Text style={styles.version}>{VERSION.replace("/", "v")}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.upperBody}>
          {/* Language Section */}
          <View style={styles.languageSection}>
            <Text style={styles.title}>{t("settings.changeLanguage")}</Text>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={toggleLanguage}
            >
              <Text style={styles.languageButtonText}>
                {i18n.language === "en" ? "EN" : "英文"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          {/* Legal Section */}
          <View style={styles.legalSection}>
            <Text style={styles.title}>{t("settings.termsOfUse")}</Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => { downloadPdf("terms", "mobilearn_terms_of_use") }}
            >
              <Image
                  source={icons.download}
                  style={styles.downloadIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.legalSection}>
            <Text style={styles.title}>{t("settings.privacyPolicy")}</Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => { downloadPdf("privacy", "mobilearn_privacy_policy") }}
            >
              <Image
                  source={icons.download}
                  style={styles.downloadIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          {/* Support Section */}
          <View style={styles.legalSection}>
            <Text style={styles.title}>{t("settings.bugReport")}</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => { router.push(BUG_REPORT_URL) }}
            >
              <Image
                  source={icons.chevronRight}
                  style={styles.linkIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 20
  },
  header: {
    color: "#356FC5", // Colors.defaultBlue
    fontFamily: "Plus-Jakarta-Sans",
    marginLeft: 25,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 30,
  },
  upperBody: {
    marginHorizontal: 30,
  },
  languageSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "#6C6C6C",
  },
  languageButton: {
    backgroundColor: "#356FC5", // Colors.defaultBlue
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  legalSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  downloadButton: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadIcon: {
    marginRight: 0,
    height: 50,
    width: 50,
    resizeMode: "stretch"
  },
  supportSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  linkButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  linkIcon: {
    marginRight: 0,
    height: 25,
    width: 17,
    resizeMode: "stretch"
  },
  languageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
    marginVertical: 10,
    marginHorizontal: 0,
  },
  version: {
    color: "#356FC5", // Colors.defaultBlue
    fontFamily: "Plus-Jakarta-Sans",
    marginLeft: "auto",
    paddingBottom: 2,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SettingsPage;
