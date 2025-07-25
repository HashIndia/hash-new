import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useUserStore from "../stores/useUserStore";
import AddressForm from "../components/AddressForm";
import { useState } from "react";

export default function Profile() {
  const { user, addresses, setAddresses, orders } = useUserStore();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function handleSave(address) {
    if (editing !== null) {
      setAddresses(addresses.map((a, i) => (i === editing ? address : a)));
    } else {
      setAddresses([...addresses, address]);
    }
    setShowForm(false);
    setEditing(null);
  }
  function handleEdit(idx) {
    setEditing(idx);
    setShowForm(true);
  }
  function handleDelete(idx) {
    setAddresses(addresses.filter((_, i) => i !== idx));
  }

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <>
              <div className="mb-2 font-semibold text-zinc-900">{user.name || 'John Doe'}</div>
              <div className="mb-2 text-zinc-600">{user.email || 'johndoe@email.com'}</div>
              <div className="mb-2 text-zinc-600">{user.phone || '+91 9876543210'}</div>
            </>
          ) : (
            <div className="text-zinc-500">Not logged in.</div>
          )}
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-zinc-500 mb-4">No addresses saved.</div>
          ) : (
            <ul className="mb-4">
              {addresses.map((address, idx) => (
                <li key={idx} className="mb-2 flex justify-between items-center">
                  <div>
                    {address.line1}, {address.city}, {address.state} - {address.zip}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(idx)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {showForm ? (
            <AddressForm
              initial={editing !== null ? addresses[editing] : {}}
              onSave={handleSave}
            />
          ) : (
            <Button onClick={() => { setShowForm(true); setEditing(null); }}>
              Add Address
            </Button>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-zinc-900 font-semibold text-lg mb-2">Total Orders: {orders.length}</div>
          <Button asChild variant="outline" size="sm">
            <a href="/orders">View Orders</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 