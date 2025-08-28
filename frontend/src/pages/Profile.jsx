import { useEffect, useState } from "react";
import { authAPI, ordersAPI } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useUserStore from "../stores/useUserStore";
import AddressForm from "../components/AddressForm";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, addresses, orders, setAddresses, setOrders } = useUserStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      // Prevent infinite loops - only fetch if user exists and data not already loaded
      if (!user || dataLoaded) return;

      try {
        console.log("[Profile] Fetching user data...");
        const [addressRes, orderRes] = await Promise.all([
          authAPI.getAddresses(),
          ordersAPI.getUserOrders(),
        ]);

        if (isMounted) {
          setAddresses(addressRes.data.addresses || []);
          setOrders(orderRes.data.orders || []);
          setDataLoaded(true);
          console.log("[Profile] User data loaded successfully");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch user profile data:", error);
          // Don't retry automatically on error
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Only depend on user ID to prevent unnecessary re-renders

  const handleAddAddress = async (addressData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.addAddress(addressData);
      const newAddress = response.data.address;
      setAddresses([...addresses, newAddress]);
      setShowAddressForm(false);
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error("Failed to add address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = async (addressData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.updateAddress(
        editingAddress._id,
        addressData
      );
      const updatedAddress = response.data.address;
      setAddresses(
        addresses.map((addr) =>
          addr._id === editingAddress._id ? updatedAddress : addr
        )
      );
      setEditingAddress(null);
      toast.success("Address updated successfully!");
    } catch (error) {
      toast.error("Failed to update address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await authAPI.deleteAddress(addressId);
      setAddresses(addresses.filter((addr) => addr._id !== addressId));
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address. Please try again.");
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {(showAddressForm || editingAddress) && (
        <div className="mb-6">
          <AddressForm
            onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
            onCancel={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
            initialData={editingAddress}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Addresses</CardTitle>
            <Button onClick={() => setShowAddressForm(true)}>Add Address</Button>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div key={addr._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{addr.name}</p>
                        <p>
                          {addr.line1}, {addr.line2 && `${addr.line2},`}{" "}
                          {addr.city}
                        </p>
                        <p>
                          {addr.state} - {addr.pincode}
                        </p>
                        <p>Phone: {addr.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAddress(addr)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAddress(addr._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No addresses found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order._id} className="border-b last:border-b-0 py-2">
                  <p>
                    Order #{order.orderNumber} -{" "}
                    <strong>{order.status}</strong> - ₹{order.total}
                  </p>
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}