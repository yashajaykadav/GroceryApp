import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://fakestoreapi.com/products");
      setProducts(res.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>Failed to load products</Text>
      </View>
    );
  }

  return (
    <>

    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/product/${item.id}`)}
          style={{ backgroundColor:"#fff", padding:10, marginBottom:10, borderRadius:8 }}
        >
          <Image source={{ uri: item.image }} style={{ height:100, resizeMode:"contain" }} />
          <Text numberOfLines={1} style={{ fontWeight:"bold" }}>{item.title}</Text>
          <Text>₹ {item.price}</Text>
        </TouchableOpacity>
      )}
      />
          <TouchableOpacity
  onPress={() => router.push("/cart")}
  style={{ padding:10, backgroundColor:"#000", marginBottom:10 }}
>
  <Text style={{ color:"#fff", textAlign:"center" }}>Go to Cart</Text>
</TouchableOpacity>
      </>
  );
}
