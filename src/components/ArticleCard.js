import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ArticleCard = ({ article, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => onPress(article)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: article.imageUrl }} // Expects imageUrl
          style={styles.image}
          resizeMode="cover"
        />
        {article.featured && ( // Expects featured
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Destacado</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={1}>{article.title}</Text>
          {article.isNew && ( // Expects isNew
            <View style={styles.newBadge}>
              <Text style={styles.newText}>Nuevo</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {article.description}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="calendar" size={14} color="#666" />
            <Text style={styles.metaText}>{article.date}</Text> {/* Expects date */}
          </View>

          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="eye-outline" size={14} color="#666" />
            {/* Display views if available */}
            {article.views !== undefined && <Text style={styles.metaText}>{article.views} vistas</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    backgroundColor: '#111111', // Fondo negro
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#34D399', // Fondo verde
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: '#ffffff', // Texto blanco
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // Texto blanco
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#aaaaaa', // Texto gris claro
    marginBottom: 8,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#aaaaaa', // Texto gris claro
    marginLeft: 4,
  },
});

export default ArticleCard;
