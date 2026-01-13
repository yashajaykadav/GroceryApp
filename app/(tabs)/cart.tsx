import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import Toast from "react-native-toast-message";
import { useCart } from "../context/CartContext";

// Define colors for consistency
const COLORS = {
  primary: "#4F46E5", // Indigo/Blue
  white: "#FFFFFF",
  background: "#F5F7FA",
  text: "#1F2937",
  textLight: "#6B7280",
  danger: "#EF4444",
  border: "#E5E7EB",
};
const router = useRouter();

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleDecrease = (id, qty) => {
    if (qty === 1) {
      removeFromCart(id);
      Toast.show({ type: "info", text1: "Item removed from cart" });
    } else {
      decreaseQty(id);
    }
  };

  const handleCheckout = () =>{
    router.push("/checkout");
  }

  // --- Render Functions ---

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Image 
        // Placeholder for an empty state illustration
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/11329/11329060.png" }} 
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubText}>Looks like you haven't added anything yet.</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Image Section */}
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="contain"
      />

      {/* Details Section */}
      <View style={styles.itemDetails}>
        <View>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>₹ {item.price.toFixed(2)}</Text>
        </View>

        {/* Controls Row */}
        <View style={styles.controlsRow}>
          {/* Quantity Stepper */}
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              onPress={() => handleDecrease(item.id, item.qty)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.qty}</Text>

            <TouchableOpacity
              onPress={() => increaseQty(item.id)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Remove Button (Small Text Link) */}
          <TouchableOpacity onPress={() => removeFromCart(item.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // --- Main Render ---

  if (cart.length === 0) {
    return renderEmptyCart();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart ({cart.length})</Text>
      </View>

      {/* Cart List */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Fixed Bottom Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹ {total.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
</TouchableOpacity>
 
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for footer
  },
  // Card Styles
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    // Shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  // Quantity Styles
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 4,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 18,
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  removeText: {
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: "500",
  },
  // Footer Styles
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 25,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.danger,
  },
  checkoutButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
  },
});