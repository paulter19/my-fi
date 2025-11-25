import { AccountCard } from '@/components/AccountCard';
import { AddAccountModal } from '@/components/AddAccountModal';
import { Card } from '@/components/Card';
import { ConnectBankModal } from '@/components/ConnectBankModal';
import { ListItem } from '@/components/ListItem';
import { StatBox } from '@/components/StatBox';
import {
  selectIncomeVsBills,
  selectMonthlySpending,
  selectRemainingBalance,
  selectSpendingByCategory,
  selectTotalBills,
  selectTotalIncome,
  selectUpcomingBills
} from '@/store/selectors/chartsSelectors';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const totalIncome = useSelector(selectTotalIncome);
  const totalBills = useSelector(selectTotalBills);
  const remainingBalance = useSelector(selectRemainingBalance);
  const spendingByCategory = useSelector(selectSpendingByCategory);
  const monthlySpending = useSelector(selectMonthlySpending);
  const incomeVsBills = useSelector(selectIncomeVsBills);
  const upcomingBills = useSelector(selectUpcomingBills);
  const accounts = useSelector((state: RootState) => state.accounts.items);
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isDark = theme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [isAddAccountVisible, setIsAddAccountVisible] = useState(false);
  const [isConnectBankVisible, setIsConnectBankVisible] = useState(false);
  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  useFocusEffect(
    React.useCallback(() => {
      setRefreshing(false);
    }, [])
  );

  const chartConfig = {
    backgroundGradientFrom: isDark ? "#1E1E1E" : "#ffffff",
    backgroundGradientTo: isDark ? "#1E1E1E" : "#ffffff",
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Dashboard</Text>

        <View style={styles.statsContainer}>
          <StatBox label="Income" value={`$${totalIncome}`} color="#27AE60" />
          <StatBox label="Bills" value={`$${totalBills}`} color="#EB5757" />
          <View style={[styles.balanceContainer, isDark && styles.balanceContainerDark]}>
            <Text style={[styles.balanceLabel, isDark && styles.balanceLabelDark]}>Balance</Text>
            <Text
              style={[styles.balanceValue, { color: '#4A90E2' }]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              ${remainingBalance}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Accounts</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => setIsConnectBankVisible(true)} style={styles.iconButton}>
              <Ionicons name="link" size={24} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsAddAccountVisible(true)} style={styles.iconButton}>
              <Ionicons name="add-circle" size={24} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onPress={(acc) => router.push(`/account/${acc.id}`)}
            isDark={isDark}
          />
        ))}

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Income vs Bills</Text>
        <Card>
          <PieChart
            data={incomeVsBills}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </Card>

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Upcoming Bills (This Week)</Text>
        {upcomingBills.length > 0 ? (
          <Card>
            {upcomingBills.map(bill => (
              <ListItem
                key={bill.id}
                title={bill.title}
                subtitle={`Due: ${bill.dueDate}`}
                amount={`$${bill.amount}`}
                amountColor="#EB5757"
                icon="receipt-outline"
              />
            ))}
          </Card>
        ) : (
          <Text style={styles.emptyText}>No upcoming bills this week.</Text>
        )}

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Monthly Spending</Text>
        <Card>
          <BarChart
            data={monthlySpending}
            width={screenWidth - 64}
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        </Card>

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Spending by Category</Text>
        <Card>
          <PieChart
            data={spendingByCategory}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </Card>
      </ScrollView>

      <AddAccountModal
        visible={isAddAccountVisible}
        onClose={() => setIsAddAccountVisible(false)}
        isDark={isDark}
      />

      <ConnectBankModal
        visible={isConnectBankVisible}
        onClose={() => setIsConnectBankVisible(false)}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  headerTitleDark: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitleDark: {
    color: 'white',
  },
  balanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceContainerDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceLabelDark: {
    color: '#AAA',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 8,
    marginBottom: 16,
  },
});
