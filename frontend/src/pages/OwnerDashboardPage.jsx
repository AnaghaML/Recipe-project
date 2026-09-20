import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Clock, CheckCircle, ChefHat, IndianRupee, Plus,
  Edit3, Trash2, Eye, RefreshCw, AlertCircle, Loader2, Check,
  SlidersHorizontal, UtensilsCrossed, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import OrderDetailsModal from '../components/OrderDetailsModal';
import MenuItemModal from '../components/MenuItemModal';

const STATUS_FLOW = ['Pending', 'Preparing', 'Ready', 'Completed'];

export default function OwnerDashboardPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'orders' or 'menu'
  const [activeTab, setActiveTab] = useState('orders');

  // Stats state
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All');
  const [inspectingOrder, setInspectingOrder] = useState(null);

  // Menu items state
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuFilterCategory, setMenuFilterCategory] = useState('All');

  const [loadingData, setLoadingData] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/owner/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const showNotification = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(''), 4000);
  };

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      const [statsRes, ordersRes, menuRes] = await Promise.all([
        axiosClient.get('/orders/stats'),
        axiosClient.get('/orders'),
        axiosClient.get('/menu')
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setMenuItems(menuRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      showNotification('Error refreshing dashboard data. Check backend logs.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Order status update handler
  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      const res = await axiosClient.patch(`/orders/${orderId}/status`, { status: nextStatus });
      const updated = res.data.order;

      // Update state in orders list
      setOrders((prev) =>
        prev.map((o) => (String(o._id) === String(orderId) ? { ...o, status: nextStatus } : o))
      );

      // Also update currently inspected order modal if open
      if (inspectingOrder && String(inspectingOrder._id) === String(orderId)) {
        setInspectingOrder((prev) => ({ ...prev, status: nextStatus }));
      }

      showNotification(`Order #${orderId} moved to ${nextStatus}!`);

      // Refresh stats
      const statsRes = await axiosClient.get('/orders/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Could not update status');
    }
  };

  // Menu items CRUD handlers
  const handleSaveMenuItem = async (itemData) => {
    if (editingMenuItem && editingMenuItem._id) {
      // Update
      const res = await axiosClient.put(`/menu/${editingMenuItem._id}`, itemData);
      setMenuItems((prev) =>
        prev.map((i) => (String(i._id) === String(editingMenuItem._id) ? res.data.item : i))
      );
      showNotification(`"${itemData.name}" updated successfully!`);
    } else {
      // Create
      const res = await axiosClient.post('/menu', itemData);
      setMenuItems((prev) => [res.data.item, ...prev]);
      showNotification(`"${itemData.name}" added to menu!`);
    }
    setIsMenuModalOpen(false);
    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      return;
    }

    try {
      await axiosClient.delete(`/menu/${id}`);
      setMenuItems((prev) => prev.filter((i) => String(i._id) !== String(id)));
      showNotification(`"${name}" was deleted from menu.`);
    } catch (err) {
      console.error('Delete menu item error:', err);
      alert(err.response?.data?.message || 'Failed to delete dish');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedAvailable = !item.available;
      const res = await axiosClient.put(`/menu/${item._id}`, {
        available: updatedAvailable
      });
      setMenuItems((prev) =>
        prev.map((i) => (String(i._id) === String(item._id) ? res.data.item : i))
      );
      showNotification(`"${item.name}" availability set to ${updatedAvailable ? 'In Stock' : 'Sold Out'}.`);
    } catch (err) {
      console.error('Toggle availability error:', err);
      alert('Could not change availability');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (selectedOrderStatus === 'All') return true;
    return o.status === selectedOrderStatus;
  });

  // Filtered menu
  const filteredMenuItems = menuItems.filter((i) => {
    if (menuFilterCategory === 'All') return true;
    return i.category === menuFilterCategory;
  });

  if (authLoading) {
    return (
      <div className="dashboard-loading-screen">
        <Loader2 size={36} className="spinner-icon" />
        <p>Verifying owner credentials...</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard-page">
      <div className="dashboard-container">
        {/* Top Header Banner */}
        <div className="dashboard-header-bar">
          <div className="dashboard-header-left">
            <span className="owner-badge">
              <ChefHat size={15} /> RESTAURANT OWNER PORTAL
            </span>
            <h1 className="dashboard-title">Command & Kitchen Dashboard</h1>
            <p className="dashboard-welcome">
              Welcome, <strong>{user?.name || 'Owner'}</strong> ({user?.email})
            </p>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              className="btn-secondary refresh-btn"
              onClick={fetchDashboardData}
              disabled={loadingData}
            >
              <RefreshCw size={16} className={loadingData ? 'spinning' : ''} />
              <span>Refresh Data</span>
            </button>
            <button
              type="button"
              className="btn-secondary logout-dashboard-btn"
              onClick={() => {
                logout();
                navigate('/owner/login');
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {feedbackMessage && (
          <div className="dashboard-toast">
            <Check size={18} />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Statistics Metric Cards */}
        <div className="stats-cards-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap total">
              <ShoppingBag size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Orders</span>
              <strong className="stat-val">{stats.totalOrders}</strong>
            </div>
          </div>

          <div className="stat-card highlight-pending">
            <div className="stat-icon-wrap pending">
              <Clock size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pending Orders</span>
              <strong className="stat-val">{stats.pendingOrders}</strong>
            </div>
          </div>

          <div className="stat-card highlight-preparing">
            <div className="stat-icon-wrap preparing">
              <ChefHat size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">In Preparation</span>
              <strong className="stat-val">{stats.preparingOrders}</strong>
            </div>
          </div>

          <div className="stat-card highlight-completed">
            <div className="stat-icon-wrap completed">
              <CheckCircle size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Completed Orders</span>
              <strong className="stat-val">{stats.completedOrders}</strong>
            </div>
          </div>

          <div className="stat-card highlight-revenue">
            <div className="stat-icon-wrap revenue">
              <IndianRupee size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Revenue</span>
              <strong className="stat-val">₹{stats.totalRevenue.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Orders vs Menu) */}
        <div className="dashboard-tabs-bar">
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>Orders Management ({orders.length})</span>
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <UtensilsCrossed size={18} />
            <span>Menu Catalog & Dishes ({menuItems.length})</span>
          </button>
        </div>

        {/* ==================== TAB 1: ORDERS MANAGEMENT ==================== */}
        {activeTab === 'orders' && (
          <div className="tab-pane orders-pane">
            <div className="table-controls-bar">
              <div className="status-filter-pills">
                <span className="filter-label">Filter by Status:</span>
                {['All', 'Pending', 'Preparing', 'Ready', 'Completed'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`status-filter-pill ${selectedOrderStatus === s ? 'active' : ''}`}
                    onClick={() => setSelectedOrderStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {loadingData ? (
              <div className="dashboard-loading-box">
                <Loader2 size={32} className="spinner-icon" />
                <p>Loading live kitchen orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-dashboard-table">
                <Clock size={40} />
                <h3>No Orders Found</h3>
                <p>No orders currently match the selected filter ({selectedOrderStatus}).</p>
              </div>
            ) : (
              <div className="orders-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Placed Time</th>
                      <th>Customer Details</th>
                      <th>Items Summary</th>
                      <th>Total Amount</th>
                      <th>Current Status</th>
                      <th>Status Action</th>
                      <th>Inspection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const currentIdx = STATUS_FLOW.indexOf(order.status);
                      const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
                        ? STATUS_FLOW[currentIdx + 1]
                        : null;

                      return (
                        <tr key={order._id}>
                          <td className="order-id-cell">
                            <strong>#{order._id}</strong>
                          </td>
                          <td className="time-cell">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            <span className="date-sub">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="cust-cell">
                            <strong>{order.customerName}</strong>
                            <span className="cust-contact-sub">{order.customerPhone}</span>
                            <span className="cust-contact-sub">{order.customerEmail}</span>
                          </td>
                          <td className="items-cell">
                            <div className="items-summary-list">
                              {order.items?.map((it, idx) => (
                                <span key={idx} className="item-badge-pill">
                                  {it.quantity}x {it.name}
                                </span>
                              ))}
                            </div>
                            {order.orderNotes && (
                              <span className="order-note-alert">
                                💬 "{order.orderNotes}"
                              </span>
                            )}
                          </td>
                          <td className="amount-cell">
                            <strong>₹{order.totalAmount}</strong>
                          </td>
                          <td className="status-cell">
                            <span className={`status-pill status-${order.status?.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="action-advance-cell">
                            {nextStatus ? (
                              <button
                                type="button"
                                className="advance-status-btn"
                                onClick={() => handleUpdateOrderStatus(order._id, nextStatus)}
                                title={`Advance status to ${nextStatus}`}
                              >
                                Mark {nextStatus}
                              </button>
                            ) : (
                              <span className="all-done-tag">
                                <Check size={14} /> Completed
                              </span>
                            )}
                          </td>
                          <td className="action-inspect-cell">
                            <button
                              type="button"
                              className="inspect-btn"
                              onClick={() => setInspectingOrder(order)}
                              title="Inspect full customer & items details"
                            >
                              <Eye size={16} /> Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: MENU CATALOG & CRUD ==================== */}
        {activeTab === 'menu' && (
          <div className="tab-pane menu-crud-pane">
            <div className="menu-crud-header">
              <div className="menu-cat-filter-pills">
                <span className="filter-label">Filter Category:</span>
                {['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`status-filter-pill ${menuFilterCategory === cat ? 'active' : ''}`}
                    onClick={() => setMenuFilterCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-primary add-dish-btn"
                onClick={() => {
                  setEditingMenuItem(null);
                  setIsMenuModalOpen(true);
                }}
              >
                <Plus size={18} /> Add New Dish
              </button>
            </div>

            {loadingData ? (
              <div className="dashboard-loading-box">
                <Loader2 size={32} className="spinner-icon" />
                <p>Loading restaurant dishes...</p>
              </div>
            ) : filteredMenuItems.length === 0 ? (
              <div className="empty-dashboard-table">
                <UtensilsCrossed size={40} />
                <h3>No Menu Items in this Category</h3>
                <p>Click "Add New Dish" to create your first delicious recipe.</p>
              </div>
            ) : (
              <div className="menu-crud-grid">
                {filteredMenuItems.map((item) => (
                  <div key={item._id} className="crud-menu-card">
                    <div className="crud-card-img-wrap">
                      <img src={item.image} alt={item.name} />
                      <span className="crud-category-tag">{item.category}</span>
                      <button
                        type="button"
                        className={`stock-toggle-pill ${item.available ? 'in-stock' : 'out-stock'}`}
                        onClick={() => handleToggleAvailability(item)}
                        title="Click to toggle availability"
                      >
                        {item.available ? 'In Stock' : 'Sold Out'}
                      </button>
                    </div>

                    <div className="crud-card-body">
                      <div className="crud-title-price">
                        <h4>{item.name}</h4>
                        <span className="crud-price">₹{item.price}</span>
                      </div>
                      <p className="crud-desc">{item.description}</p>

                      <div className="crud-card-actions">
                        <button
                          type="button"
                          className="crud-edit-btn"
                          onClick={() => {
                            setEditingMenuItem(item);
                            setIsMenuModalOpen(true);
                          }}
                        >
                          <Edit3 size={15} /> Edit
                        </button>
                        <button
                          type="button"
                          className="crud-delete-btn"
                          onClick={() => handleDeleteMenuItem(item._id, item.name)}
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inspect Order Details Modal */}
      {inspectingOrder && (
        <OrderDetailsModal
          order={inspectingOrder}
          onClose={() => setInspectingOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}

      {/* Add / Edit Menu Item Modal */}
      {isMenuModalOpen && (
        <MenuItemModal
          item={editingMenuItem}
          onClose={() => {
            setIsMenuModalOpen(false);
            setEditingMenuItem(null);
          }}
          onSave={handleSaveMenuItem}
        />
      )}
    </div>
  );
}
