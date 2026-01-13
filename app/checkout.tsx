import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Built-in icons for Expo
import { useCart } from "./context/CartContext";
import { useRouter } from "expo-router";

// Reuse consistency colors
const COLORS = {
  primary: "#4F46E5",
  white: "#FFFFFF",
  background: "#F5F7FA",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
};

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = 50; // Example fixed fee
  const finalTotal = total + deliveryFee;

  const confirmOrder = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const oldOrders = await AsyncStorage.getItem("orders");
      const orders = oldOrders ? JSON.parse(oldOrders) : [];

      const newOrder = {
        id: Date.now(),
        items: cart,
        total: finalTotal,
        date: new Date().toISOString(),
        status: "Pending"
      };

      orders.push(newOrder);
      await AsyncStorage.setItem("orders", JSON.stringify(orders));

      clearCart();
      router.replace("/orders"); // Use replace to prevent going back to checkout
    } catch (error) {
      Alert.alert("Error", "Something went wrong saving your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Delivery Address (Mock) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={22} color={COLORS.primary} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.cardTitle}>Home</Text>
                <Text style={styles.cardSubtitle}>
                  123, React Native Street, Code Valley, India - 400001
                </Text>
              </View>
              <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
            </View>
          </View>
        </View>

        {/* Section 2: Payment Method (Mock) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="cash-outline" size={22} color={COLORS.success} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.cardTitle}>Cash on Delivery</Text>
                <Text style={styles.cardSubtitle}>Pay when you receive the order</Text>
              </View>
              <Ionicons name="radio-button-on" size={22} color={COLORS.primary} />
            </View>
          </View>
        </View>

        {/* Section 3: Order Summary List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.card}>
            {cart.map((item, index) => (
              <View key={item.id} style={[
                styles.itemRow, 
                index !== cart.length - 1 && styles.borderBottom
              ]}>
                <Text style={styles.itemText}>
                  <Text style={styles.qtyBadge}>{item.qty}x </Text> 
                  {item.title}
                </Text>
                <Text style={styles.itemPrice}>₹ {(item.price * item.qty).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 4: Bill Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.card}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>₹ {total.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹ {deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total Pay</Text>
              <Text style={styles.totalValue}>₹ {finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={confirmOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.payButtonText}>Place Order • ₹ {finalTotal.toFixed(2)}</Text>
          )}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for footer
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  // Order Item Styles
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  qtyBadge: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  // Bill Details Styles
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  billValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  // Footer Styles
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
});