import React, { useState, useEffect, useMemo } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { useBookings } from '../context/BookingContext';
import { useVehicles } from '../context/VehicleContext';

// Professional Chart Component with Revenue
const ProfessionalChart = ({ bookingsData, revenueData, chartType }) => {
  const maxBookings = Math.max(...bookingsData.map(d => d.value), 1);
  const maxRevenue = Math.max(...revenueData.map(d => d.value), 1);
  
  return (
    <div style={styles.chartGrid}>
      {/* Bookings Chart */}
      <div style={styles.chartColumn}>
        <div style={styles.miniChartTitle}>Bookings Trend</div>
        <div style={styles.chartBars}>
          {bookingsData.map((item, index) => (
            <div key={index} style={styles.barItem}>
              <div style={styles.barWrapper}>
                <div 
                  style={{
                    ...styles.bar,
                    height: `${(item.value / maxBookings) * 120}px`,
                    background: 'linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)',
                  }}
                  title={`${item.label}: ${item.value} bookings`}
                />
              </div>
              <span style={styles.barLabel}>{item.label}</span>
              <span style={styles.barValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div style={styles.chartColumn}>
        <div style={styles.miniChartTitle}>Revenue Trend</div>
        <div style={styles.chartBars}>
          {revenueData.map((item, index) => (
            <div key={index} style={styles.barItem}>
              <div style={styles.barWrapper}>
                <div 
                  style={{
                    ...styles.bar,
                    height: `${(item.value / maxRevenue) * 120}px`,
                    background: 'linear-gradient(180deg, #10b981 0%, #047857 100%)',
                  }}
                  title={`${item.label}: ₱${item.value.toLocaleString()}`}
                />
              </div>
              <span style={styles.barLabel}>{item.label}</span>
              <span style={styles.barValue}>₱{(item.value / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Metrics Cards Component
const MetricsCards = ({ bookings, payments, vehicles }) => {
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  
  const occupancyRate = vehicles.length > 0 
    ? ((bookings.filter(b => b.status === 'Approved').length / vehicles.length) * 100).toFixed(1)
    : 0;
  
  const avgBookingValue = completedBookings > 0 ? (totalRevenue / completedBookings).toFixed(0) : 0;
  const conversionRate = totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0;

  return (
    <div style={styles.metricsGrid}>
      <MetricCard 
        title="Total Revenue"
        value={`₱${totalRevenue.toLocaleString()}`}
        icon="💰"
        bgColor="#e0f2fe"
        color="#0369a1"
        trend="+12.5%"
      />
      <MetricCard 
        title="Occupancy Rate"
        value={`${occupancyRate}%`}
        icon="🚗"
        bgColor="#dcfce7"
        color="#15803d"
        trend="+8.2%"
      />
      <MetricCard 
        title="Avg Booking Value"
        value={`₱${avgBookingValue.toLocaleString()}`}
        icon="📊"
        bgColor="#fef3c7"
        color="#b45309"
        trend="+3.1%"
      />
      <MetricCard 
        title="Conversion Rate"
        value={`${conversionRate}%`}
        icon="📈"
        bgColor="#fce7f3"
        color="#be185d"
        trend="+5.4%"
      />
      <MetricCard 
        title="Completed Bookings"
        value={completedBookings}
        icon="✓"
        bgColor="#e9d5ff"
        color="#7c3aed"
      />
      <MetricCard 
        title="Cancelled Bookings"
        value={cancelledBookings}
        icon="✕"
        bgColor="#fee2e2"
        color="#dc2626"
      />
    </div>
  );
};

// Individual Metric Card
const MetricCard = ({ title, value, icon, bgColor, color, trend }) => (
  <div style={{ ...styles.metricCard, backgroundColor: bgColor }}>
    <div style={styles.metricIcon}>{icon}</div>
    <div style={styles.metricContent}>
      <div style={styles.metricTitle}>{title}</div>
      <div style={{ ...styles.metricValue, color }}>{value}</div>
      {trend && <div style={styles.metricTrend}>{trend}</div>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const { getBookings, getPayments } = useBookings();
  const { vehicles } = useVehicles();
  const [stats, setStats] = useState({
    activeRentals: 0,
    vehiclesAvailable: 0,
    upcomingReservations: 0,
    totalEarnings: 0,
    totalBookings: 0,
    totalCustomers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartType, setChartType] = useState('weekly');
  const [statisticsTab, setStatisticsTab] = useState('overview'); // overview, detailed, trends

  // Get real data from contexts
  const allBookings = useMemo(() => getBookings(), [getBookings]);
  const allPayments = useMemo(() => getPayments(), [getPayments]);

  // Calculate monthly bookings from real data starting from March
  const monthlyBookingsData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // For weekly view, show last 7 days of bookings
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const bookingsOnDay = allBookings.filter(booking => {
        const bookingDate = new Date(booking.pickupDate || booking.createdAt);
        return bookingDate.toDateString() === date.toDateString();
      });
      weekData.push({
        label: dayName,
        value: bookingsOnDay.length
      });
    }
    return weekData;
  }, [allBookings]);

  // Calculate monthly bookings for monthly view (starting March)
  const monthlyViewData = useMemo(() => {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const currentYear = new Date().getFullYear();
    
    return months.map(month => {
      const monthIndex = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].indexOf(month);
      const bookingsInMonth = allBookings.filter(booking => {
        const bookingDate = new Date(booking.pickupDate || booking.createdAt);
        return bookingDate.getMonth() === monthIndex + 2 && bookingDate.getFullYear() === currentYear;
      });
      return {
        label: month,
        value: bookingsInMonth.length
      };
    });
  }, [allBookings]);

  // Calculate weekly revenue
  const weeklyRevenueData = useMemo(() => {
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const paymentsOnDay = allPayments.filter(payment => {
        const paymentDate = new Date(payment.paidAt || payment.createdAt);
        return paymentDate.toDateString() === date.toDateString() && payment.status === 'Completed';
      });
      const revenue = paymentsOnDay.reduce((sum, p) => sum + (p.amount || 0), 0);
      revenueData.push({
        label: dayName,
        value: revenue
      });
    }
    return revenueData;
  }, [allPayments]);

  // Calculate monthly revenue from real payments
  const monthlyRevenueData = useMemo(() => {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const currentYear = new Date().getFullYear();
    
    return months.map(month => {
      const monthIndex = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].indexOf(month);
      const paymentsInMonth = allPayments.filter(payment => {
        const paymentDate = new Date(payment.paidAt || payment.createdAt);
        return paymentDate.getMonth() === monthIndex + 2 && 
               paymentDate.getFullYear() === currentYear && 
               payment.status === 'Completed';
      });
      const revenue = paymentsInMonth.reduce((sum, p) => sum + (p.amount || 0), 0);
      return {
        label: month,
        value: revenue
      };
    });
  }, [allPayments]);

  useEffect(() => {
    // Calculate statistics
    const activeRentals = allBookings.filter(b => b.status === 'Approved').length;
    const vehiclesAvailable = vehicles.filter(v => v.status === 'active').length;
    const upcomingReservations = allBookings.filter(b => b.status === 'Pending').length;
    const completedPayments = allPayments.filter(p => p.status === 'Completed');
    const totalEarnings = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // Get unique customers
    const uniqueCustomers = new Set(allBookings.map(b => b.userId)).size;
    
    setStats({
      activeRentals,
      vehiclesAvailable,
      upcomingReservations,
      totalEarnings,
      totalBookings: allBookings.length,
      totalCustomers: uniqueCustomers
    });
    
    // Get recent bookings (last 5)
    const sorted = [...allBookings].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    }).slice(0, 5);
    setRecentBookings(sorted);
  }, [allBookings, allPayments, vehicles]);

  // Get chart data based on type
  const bookingsChartData = useMemo(() => {
    if (chartType === 'weekly') {
      return monthlyBookingsData;
    } else {
      return monthlyViewData;
    }
  }, [chartType, monthlyBookingsData, monthlyViewData]);

  const revenueChartData = useMemo(() => {
    if (chartType === 'weekly') {
      return weeklyRevenueData;
    } else {
      return monthlyRevenueData;
    }
  }, [chartType, weeklyRevenueData, monthlyRevenueData]);

  const formatBookingId = (value) => {
    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }
    return String(value).slice(-6).toUpperCase();
  };

  return (
    <div style={styles.container}>
      <AdminNavbar />
      <AdminSidebar />
      
      <main className="responsive-main" style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.pageTitle}>Dashboard Summary</h2>

          {/* Cards Row */}
          <div style={styles.cardsRow}>
            <div style={styles.card} aria-label={`Active Rentals ${stats.activeRentals}`}>
              <div style={styles.cardIconBg}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2846e3" strokeWidth="2" style={styles.cardIcon}>
                  <path d="M4 6h16v9h2v1h-1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4H2v-1h2V6Z"/>
                </svg>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardValue}>{stats.activeRentals}</div>
                <div style={styles.cardTitle}>Active Rentals</div>
              </div>
            </div>
            
            <div style={styles.card} aria-label={`Vehicles Available ${stats.vehiclesAvailable}`}>
              <div style={{...styles.cardIconBg, backgroundColor: '#fff3e0'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#ff9800" strokeWidth="2" style={styles.cardIcon}>
                  <path d="M3 11v6a3 3 0 0 0 6 0v-6H3Zm14 0v6a3 3 0 0 0 6 0v-6h-6ZM3 18v2h18v-2H3Z"/>
                </svg>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardValue}>{stats.vehiclesAvailable}</div>
                <div style={styles.cardTitle}>Vehicles Available</div>
              </div>
            </div>
            
            <div style={styles.card} aria-label={`Upcoming Reservations ${stats.upcomingReservations}`}>
              <div style={{...styles.cardIconBg, backgroundColor: '#e8f5e9'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" style={styles.cardIcon}>
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardValue}>{stats.upcomingReservations}</div>
                <div style={styles.cardTitle}>Upcoming Reservations</div>
              </div>
            </div>
            
            <div style={{...styles.card, ...styles.earningsCard}} aria-label={`Total Earnings ${stats.totalEarnings} Philippine Peso`}>
              <div style={{...styles.cardIconBg, backgroundColor: '#e8f5e9'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#22822d" strokeWidth="2" style={styles.cardIcon}>
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div style={styles.cardContent}>
                <div style={{...styles.cardValue, color: '#22822d'}}>₱{stats.totalEarnings.toLocaleString()}</div>
                <div style={styles.cardTitle}>Total Earnings</div>
              </div>
            </div>
          </div>

          {/* Professional Rental Statistics Section */}
          <div style={styles.statisticsSection}>
            <div style={styles.statisticsHeader}>
              <div>
                <h3 style={styles.statisticsTitle}>📊 Professional Rental Statistics</h3>
                <p style={styles.statisticsSubtitle}>Comprehensive analysis of bookings and revenue performance</p>
              </div>
              <div style={styles.chartControls}>
                <button 
                  style={chartType === 'weekly' ? {...styles.controlBtn, ...styles.controlBtnActive} : styles.controlBtn}
                  onClick={() => setChartType('weekly')}
                >
                  📅 Weekly
                </button>
                <button 
                  style={chartType === 'monthly' ? {...styles.controlBtn, ...styles.controlBtnActive} : styles.controlBtn}
                  onClick={() => setChartType('monthly')}
                >
                  📆 Monthly
                </button>
              </div>
            </div>

            {/* Charts Section */}
            <div style={styles.chartsWrapper}>
              <ProfessionalChart 
                bookingsData={bookingsChartData} 
                revenueData={revenueChartData}
                chartType={chartType}
              />
            </div>

            {/* Detailed Metrics Cards */}
            <MetricsCards 
              bookings={allBookings}
              payments={allPayments}
              vehicles={vehicles}
            />
          </div>

          {/* Stats and Recent Bookings */}
          <div style={styles.statsSection}>
            <section style={styles.statsContainer} aria-label="Quick Stats">
              <div style={styles.quickStats}>
                <div style={styles.quickStat}>
                  <span style={styles.quickStatValue}>{stats.totalBookings}</span>
                  <span style={styles.quickStatLabel}>Total Bookings</span>
                </div>
                <div style={styles.quickStat}>
                  <span style={{...styles.quickStatValue, color: '#2846e3'}}>{stats.totalCustomers}</span>
                  <span style={styles.quickStatLabel}>Total Customers</span>
                </div>
                <div style={styles.quickStat}>
                  <span style={{...styles.quickStatValue, color: '#ff9800'}}>{vehicles.length}</span>
                  <span style={styles.quickStatLabel}>Total Vehicles</span>
                </div>
              </div>
            </section>

            <aside style={styles.recentBookings} aria-label="Recent Bookings Summary">
              <h3 style={styles.recentTitle}>📋 Recent Bookings</h3>
              {recentBookings.length === 0 ? (
                <div style={styles.noBookings}>No recent bookings</div>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking.id} style={styles.bookingDetails} aria-live="polite">
                    <div style={styles.bookingHeader}>
                      <span style={styles.bookingId}>#{formatBookingId(booking.id)}</span>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: booking.status === 'Approved' ? '#28a745' : 
                          booking.status === 'Pending' ? '#ffc107' : 
                          booking.status === 'Completed' ? '#17a2b8' : '#dc3545'
                      }}>{booking.status || 'Pending'}</span>
                    </div>
                    <div style={styles.bookingInfo}>
                      <span>🚗 {booking.carName || 'N/A'}</span>
                      <span>👤 {booking.userName || 'Unknown User'}</span>
                      <span>💰 ₱{booking.totalPrice?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </aside>
          </div>

        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inria+Serif:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Inria Serif, serif' },
  mainContent: { flex: 1, marginLeft: '250px', marginTop: '60px', padding: '20px' },
  contentWrapper: { maxWidth: '1200px', margin: '0 auto' },
  pageTitle: { marginBottom: '24px', fontWeight: '700', fontSize: '28px', color: '#1a1a2e' },
  cardsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' },
  card: { flex: '1 1 220px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '200px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  cardIconBg: { width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#e8effc', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardIcon: { width: '28px', height: '28px' },
  cardContent: { flex: 1 },
  cardValue: { fontSize: '28px', fontWeight: '700', color: '#2846e3', lineHeight: 1.2 },
  cardTitle: { fontSize: '13px', color: '#666', marginTop: '4px', fontWeight: '600' },
  earningsCard: {},
  
  // Professional Statistics Section
  statisticsSection: { 
    background: '#fff', 
    borderRadius: '16px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
    padding: '28px', 
    marginBottom: '24px',
    border: '1px solid #f0f0f0'
  },
  statisticsHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  statisticsTitle: { 
    margin: 0, 
    fontSize: '22px', 
    fontWeight: '700', 
    color: '#1a1a2e',
    marginBottom: '4px'
  },
  statisticsSubtitle: { 
    margin: 0, 
    fontSize: '13px', 
    color: '#999',
    fontWeight: '500'
  },
  chartControls: { 
    display: 'flex', 
    gap: '10px' 
  },
  controlBtn: { 
    padding: '10px 18px', 
    borderRadius: '8px', 
    border: '1px solid #e0e0e0', 
    background: '#f8f9fa', 
    color: '#666', 
    fontWeight: '600', 
    cursor: 'pointer', 
    fontFamily: 'Inria Serif, serif',
    transition: 'all 0.2s ease',
    fontSize: '13px'
  },
  controlBtnActive: { 
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 
    color: '#fff',
    border: 'none'
  },
  chartsWrapper: { 
    background: '#f8f9fa', 
    borderRadius: '12px', 
    padding: '28px',
    marginBottom: '24px'
  },
  chartGrid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '40px',
    marginBottom: '0'
  },
  chartColumn: { 
    display: 'flex',
    flexDirection: 'column'
  },
  miniChartTitle: { 
    fontSize: '14px', 
    fontWeight: '700', 
    color: '#1a1a2e',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  chartBars: { 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    minHeight: '160px'
  },
  barItem: { 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1',
    gap: '6px'
  },
  barWrapper: { 
    width: '100%',
    height: '150px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  bar: { 
    width: '28px',
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    minHeight: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  barLabel: { 
    fontSize: '12px', 
    fontWeight: '600', 
    color: '#666',
    textAlign: 'center'
  },
  barValue: { 
    fontSize: '11px', 
    color: '#999',
    fontWeight: '500'
  },
  
  // Metrics Grid
  metricsGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
    gap: '16px',
    marginTop: '24px'
  },
  metricCard: { 
    padding: '18px', 
    borderRadius: '12px', 
    display: 'flex', 
    alignItems: 'center',
    gap: '12px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  metricIcon: { 
    fontSize: '28px',
    lineHeight: 1
  },
  metricContent: { 
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  metricTitle: { 
    fontSize: '11px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  metricValue: { 
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: 1.2
  },
  metricTrend: { 
    fontSize: '10px',
    color: '#10b981',
    fontWeight: '600'
  },

  statsSection: { display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' },
  statsContainer: { flex: '1 1 300px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '24px' },
  quickStats: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  quickStat: { flex: '1 1 100px', textAlign: 'center', padding: '15px', borderRadius: '12px', background: '#f8f9fa' },
  quickStatValue: { display: 'block', fontSize: '32px', fontWeight: '700', color: '#28a745' },
  quickStatLabel: { fontSize: '12px', color: '#666', fontWeight: '600', marginTop: '4px' },
  recentBookings: { flex: '1 1 350px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '24px' },
  recentTitle: { margin: '0 0 16px', fontSize: '20px', fontWeight: '700', color: '#1a1a2e' },
  noBookings: { textAlign: 'center', padding: '30px', color: '#999' },
  bookingDetails: { padding: '12px', borderRadius: '10px', background: '#f8f9fa', marginBottom: '10px' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  bookingId: { fontWeight: '700', color: '#2846e3', fontSize: '14px' },
  statusBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', color: '#fff' },
  bookingInfo: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#555' },
  infoRow: { marginTop: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '24px 30px', display: 'flex', gap: '30px', justifyContent: 'space-between', flexWrap: 'wrap' },
  infoBox: { display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 250px' },
  infoIconBox: { width: '50px', height: '50px', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  infoText: { display: 'flex', flexDirection: 'column' },
};

export default AdminDashboard;
