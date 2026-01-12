import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
    setProduct(res.data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex:1 }} />;

  return (
    <View style={{ padding:20 }}>
      <Image source={{ uri: product.image }} style={{ height:200, resizeMode:"contain" }} />
      <Text style={{ fontSize:18, fontWeight:"bold" }}>{product.title}</Text>
      <Text>{product.description}</Text>
      <Text style={{ fontSize:16, marginTop:10 }}>₹ {product.price}</Text>
    </View>
  );
}
