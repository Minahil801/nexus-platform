import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../api/payment';

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [formData, setFormData] = useState({
    amount: '',
    recipientId: '',
    paymentMethod: 'stripe'
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await paymentAPI.getTransactionHistory();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentAPI.deposit(Number(formData.amount), formData.paymentMethod);
      setFormData({ ...formData, amount: '' });
      loadTransactions();
      alert('Deposit successful!');
    } catch (error: any) {
      alert(error.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentAPI.withdraw(Number(formData.amount), formData.paymentMethod);
      setFormData({ ...formData, amount: '' });
      loadTransactions();
      alert('Withdrawal successful!');
    } catch (error: any) {
      alert(error.message || 'Withdrawal failed');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentAPI.transfer(formData.recipientId, Number(formData.amount));
      setFormData({ ...formData, amount: '', recipientId: '' });
      loadTransactions();
      alert('Transfer successful!');
    } catch (error: any) {
      alert(error.message || 'Transfer failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Payments & Transactions</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 px-6 py-4 font-medium ${
                    activeTab === 'deposit' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-600'
                  }`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 px-6 py-4 font-medium ${
                    activeTab === 'withdraw' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-600'
                  }`}
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`flex-1 px-6 py-4 font-medium ${
                    activeTab === 'transfer' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-600'
                  }`}
                >
                  Transfer
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Deposit Form */}
                {activeTab === 'deposit' && (
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount (USD)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="100.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Payment Method</label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Deposit Money
                    </button>
                  </form>
                )}

                {/* Withdraw Form */}
                {activeTab === 'withdraw' && (
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount (USD)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="100.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Payment Method</label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Withdraw Money
                    </button>
                  </form>
                )}

                {/* Transfer Form */}
                {activeTab === 'transfer' && (
                  <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Recipient User ID</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter user ID"
                        value={formData.recipientId}
                        onChange={(e) => setFormData({...formData, recipientId: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Amount (USD)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="100.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Transfer Money
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded">
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-2xl font-bold text-green-600">
                  ${transactions
                    .filter(t => t.type === 'deposit' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded">
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-2xl font-bold text-red-600">
                  ${transactions
                    .filter(t => t.type === 'withdraw' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${transactions
                    .filter(t => t.type === 'transfer' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Transaction History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn._id}>
                      <td className="px-6 py-4">
                        <span className="capitalize font-medium">{txn.type}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ${txn.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          txn.status === 'completed' ? 'bg-green-100 text-green-800' :
                          txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(txn.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}