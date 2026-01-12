import { Button, FlatList, Text, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>Cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={{ padding:10 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom:10 }}>
            <Text>{item.title}</Text>
            <Text>₹ {item.price}</Text>
            <Text>Qty: {item.qty}</Text>

            <Button title="+" onPress={() => increaseQty(item.id)} />
            <Button title="-" onPress={() => decreaseQty(item.id)} />
            <Button title="Remove" onPress={() => removeFromCart(item.id)} />
          </View>
        )}
      />

      <Text style={{ fontSize:18, fontWeight:"bold" }}>
        Total: ₹ {total.toFixed(2)}
      </Text>
    </View>
  );
}
