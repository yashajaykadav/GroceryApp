import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useCart } from "../context/CartContext";



export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
      <Button title="Add to Cart" onPress={() => {addToCart(product);
       Toast.show({
        type:"success",
        text1:"Product added to cart",
        text2:"Go to cart to checkout"
       });
      }}/>
<Button title="Go to Cart" onPress={() => router.push("/cart")} />

    </View>
  );
}
