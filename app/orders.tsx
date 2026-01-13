import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#4F46E5",
  background: "#F5F7FA",
  white: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  success: "#10B981", // Green for 'Delivered'
  border: "#E5E7EB",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    AsyncStorage.getItem("orders").then((data) => {
      if (data) setOrders(JSON.parse(data));
    });
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      {/* Header: Order ID and Date */}
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Body: Details and Status */}
      <View style={styles.bodyRow}>
        <View>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.totalPrice}>₹ {item.total}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Success</Text>
        </View>
      </View>

      {/* Optional: Details Button */}
      <TouchableOpacity style={styles.detailsButton}>
         <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  // Empty State
  if (!orders.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No orders placed yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  screenHeader: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  // Card Styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  bodyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7", // Light green background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsButton: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    alignItems: "center",
  },
  detailsButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  }
});